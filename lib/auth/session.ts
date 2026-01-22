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

import { cookies } from 'next/headers';
import 'server-only';

export const AUTH_COOKIES = {
  access: 'accessToken',
  refresh: 'refreshToken',
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
    maxAge: params.accessMaxAgeSec ?? 60 * 5,
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
export async function clearAuthCookies(cookieOptions?: CookieOptions) {
  const jar = await cookies();
  const opt = baseCookieOptions(cookieOptions);

  jar.set(AUTH_COOKIES.access, '', { ...opt, maxAge: 0 });
  jar.set(AUTH_COOKIES.refresh, '', { ...opt, maxAge: 0 });
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

/**
 * Quick helper for "do we have any session at all?"
 * Typically, proxy.ts should treat having a refresh token as "logged in",
 * because access tokens can expire frequently.
 */
export function hasSession(): boolean {
  const refresh = getRefreshToken();
  const access = getAccessToken();
  return Boolean(refresh || access);
}
