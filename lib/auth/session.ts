/**
 * Session / cookie utilities for the Next.js BFF.
 *
 * We store auth tokens as httpOnly cookies on the Next.js domain so:
 *   - Browser JavaScript cannot read them (safer against XSS).
 *   - Next Route Handlers (app/api/*) can read them on the server.
 *
 * This file is the single source of truth for session cookie names,
 * clearing auth cookies, and verifying the access-token session.
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

/**
 * Clear BOTH cookies.
 * Use this on:
 *   - logout
 *   - refresh failure (refresh token expired/invalid)
 *
 * We set maxAge: 0 to delete them in the browser.
 */
export async function clearAuthCookies(response?: NextResponse, cookieOptions?: CookieOptions) {
  // If a NextResponse is provided, clear cookies in the response headers for the client.
  if (response) {
    const deleteCookieOptions = {
      expires: new Date(0),
      path: '/',
    };

    response.cookies.set(AUTH_COOKIES.access, '', deleteCookieOptions);
    response.cookies.set(AUTH_COOKIES.refresh, '', deleteCookieOptions);
    response.cookies.set(AUTH_COOKIES.deviceId, '', deleteCookieOptions);
    response.cookies.set('userName', '', deleteCookieOptions);
  }

  // Clear cookies in the server-side cookie jar (for subsequent server requests).
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

export type SessionResult =
  | {
      status: 'authenticated';
      user: UserPayload;
      accessToken: string;
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

/**
 * This is a cached function that verifies the access token in the cookie.
 * It returns the session status and user info if authenticated.
 * The cache is per-request, so multiple calls in the same request will not re-verify the token.
 */
const verifySessionCache = cache(async (): Promise<SessionResult> => {
  const jar = await cookies();
  const accessToken = jar.get(AUTH_COOKIES.access)?.value;

  if (!accessToken) return { status: 'missing_access_token' };

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = (await jwtVerify(accessToken, secret, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    })) as { payload: UserPayload };

    return {
      status: 'authenticated',
      accessToken,
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

/**
 * This can be used in any server-side code to check if the user is authenticated.
 * It does NOT redirect or throw; it just returns the session status.
 */
export async function verifySession(): Promise<SessionResult> {
  return verifySessionCache();
}

/**
 * This is used in pages/layouts to ensure that the user is authenticated before rendering the page.
 * If the user is not authenticated, they will be redirected to the sign-in page.
 */
export async function requireSession(returnTo: string): Promise<UserPayload> {
  const session = await verifySession();

  if (session.status === 'authenticated') {
    return session.user;
  }

  if (session.status === 'missing_access_token' || session.status === 'expired_access_token') {
    redirect(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // if invalid access token, clear cookies and redirect to sign-in with error message
  redirect(`/api/auth/clear-session?returnTo=${encodeURIComponent('/sign-in?error=session-invalid')}`);
}
