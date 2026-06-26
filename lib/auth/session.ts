/**
 * Session / cookie utilities for the Next.js BFF.
 *
 * We store auth tokens as httpOnly cookies on the Next.js domain so:
 *   - Browser JavaScript cannot read them (safer against XSS).
 *   - Next Route Handlers (app/api/*) can read them on the server.
 *
 * This file is the SINGLE SOURCE OF TRUTH for:
 *   - cookie names
 *   - cookie options (httpOnly, secure, sameSite, etc.)
 *   - setting / updating / clearing tokens
 *
 * Keep cookie behavior consistent here so you don't repeat it across
 * login / refresh / logout routes.
 */

import { errors, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { cache } from 'react';
import 'server-only';

export const AUTH_COOKIES = {
  access: 'accessToken',
  refresh: 'refreshToken',
  deviceId: 'deviceId',
} as const;

type CookieOptions = {
  secure?: boolean; // true in production (HTTPS)
  sameSite?: 'lax' | 'strict' | 'none'; // "lax" is a good default for same-site usage
  path?: string; // default "/"
  domain?: string; // usually undefined (host-only cookie)
};

function baseCookieOptions(opts?: CookieOptions) {
  return {
    httpOnly: true,
    secure: opts?.secure ?? process.env.NODE_ENV === 'production',
    sameSite: opts?.sameSite ?? 'lax',
    path: opts?.path ?? '/',
    domain: opts?.domain, // leave undefined unless you know you need it
  } as const;
}

export async function setAuthCookies(params: {
  accessToken: string;
  // refreshToken: string;
  accessMaxAgeSec?: number;
  refreshMaxAgeSec?: number;
  cookieOptions?: CookieOptions;
}) {
  const jar = await cookies(); // server-side cookie jar
  const opt = baseCookieOptions(params.cookieOptions);
  console.log(params.accessToken);

  // Access token: short-lived
  jar.set(AUTH_COOKIES.access, params.accessToken, {
    ...opt,
    maxAge: params.accessMaxAgeSec ?? 60 * 5, // default 5 minutes
  });
  console.log('🚀 ~ setAuthCookies ~ jar:', jar.get(AUTH_COOKIES.access));

  // // Refresh token: longer-lived
  // jar.set(AUTH_COOKIES.refresh, params.refreshToken, {
  //   ...opt,
  //   maxAge: params.refreshMaxAgeSec ?? 60 * 60 * 24 * 7, // default 7 days
  // });
}

/**
 * Update ONLY the access token cookie.
 * Use this when your ASP.NET refresh-token endpoint returns a new access token
 * but does NOT rotate the refresh token.
 */
export async function setAccessCookie(params: {
  accessToken: string;
  accessMaxAgeSec?: number;
  cookieOptions?: CookieOptions;
}) {
  const jar = await cookies();
  const opt = baseCookieOptions(params.cookieOptions);

  jar.set(AUTH_COOKIES.access, params.accessToken, {
    ...opt,
    maxAge: params.accessMaxAgeSec ?? 60 * 30, // default 30 minutes
  });
}

/**
 * Clear BOTH cookies.
 * Use this on:
 *   - logout
 *   - refresh failure (refresh token expired/invalid)
 *
 * We set maxAge: 0 to delete them in the browser.
 */
export async function clearAuthCookies(response?: NextResponse, cookieOptions?: CookieOptions) {
  if (response) {
    const cookieOptions = {
      expires: new Date(0),
      path: '/',
    };

    response.cookies.set(AUTH_COOKIES.access, '', cookieOptions);
    response.cookies.set(AUTH_COOKIES.refresh, '', cookieOptions);
    response.cookies.set(AUTH_COOKIES.deviceId, '', cookieOptions);
  }

  const jar = await cookies();
  const opt = baseCookieOptions(cookieOptions);

  jar.set(AUTH_COOKIES.access, '', { ...opt, maxAge: 0 });
  jar.set(AUTH_COOKIES.refresh, '', { ...opt, maxAge: 0 });
  jar.set(AUTH_COOKIES.deviceId, '', { ...opt, maxAge: 0 });
  jar.set('userName', '', { ...opt, maxAge: 0 });
}
/**
 * Read access token from cookie.
 * Server-only: can be used in aspnetFetch() when adding Authorization header.
 */
export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIES.access)?.value;
}

/**
 * Read refresh token from cookie.
 * Server-only: can be used by refresh logic to obtain a new access token.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIES.refresh)?.value;
}

export async function getDeviceId(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIES.deviceId)?.value;
}

/**
 * verify session
 */

type SessionResult =
  | {
      status: 'authenticated';
      user: UserPayload;
    }
  | {
      status: 'missing_access_token';
    }
  | {
      status: 'expired_access_token';
    }
  | {
      status: 'invalid_access_token';
      reason: string;
    };

export type UserPayload = {
  name: string;
  email: string;
};

// get session from access token cookie, if not valid, return null
const getSessionCache = cache(async (): Promise<SessionResult> => {
  const jar = await cookies();
  const accessToken = jar.get(AUTH_COOKIES.access)?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  if (!accessToken) return { status: 'missing_access_token' };

  try {
    const { payload } = (await jwtVerify(accessToken, secret, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    })) as { payload: UserPayload };

    return {
      status: 'authenticated',
      user: {
        name: payload.name,
        email: payload.email,
      },
    };
  } catch (error) {
    console.error('Failed to validate access token', error);

    if (error instanceof errors.JWTExpired) {
      return { status: 'expired_access_token' };
    }
    return {
      status: 'invalid_access_token',
      reason: error instanceof Error ? error.message : 'Unknown JWT validation error',
    };
  }
});

export async function requireSession(returnTo: string): Promise<UserPayload> {
  const session = await getSessionCache();
  console.log('🚀 ~ requireSession ~ session:', session);

  if (session.status === 'authenticated') {
    return session.user;
  }

  if (session.status === 'missing_access_token' || session.status === 'expired_access_token') {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // if invalid access token, clear cookies and redirect to sign-in with error message
  redirect(`/api/auth/clear-session?returnTo=${encodeURIComponent('/sign-in?error=session-invalid')}`);
}
