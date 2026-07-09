/**
 * Server-side BFF helper for calling the ASP.NET Core API.
 *
 * Browser/UI code should call Next.js routes; Next.js forwards authenticated
 * requests to ASP.NET.
 *
 * Token refresh is handled here for backend data requests. Route handlers
 * should forward returned Set-Cookie headers back to the browser.
 */

import { refreshAccessToken } from '@/features/auth/services/auth.server';
import { cookies } from 'next/headers';
import 'server-only';
import { getCookieValueFromSetCookie, getSetCookieHeaders } from './cookie-headers';
import { AUTH_COOKIES, verifySession } from './session';

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error('Missing BACKEND_URL in environment variables.');
}

const BACKEND_URL = backendUrl;

function unauthorizedResponse() {
  return Response.json({ message: 'Unauthorized' }, { status: 401 });
}

type AspnetFetchResult = {
  res: Response;
  setCookieHeaders: string[];
};

/**
 * Builds the Cookie header used for the retry request after a token refresh.
 *
 * The refresh response may include Set-Cookie headers with updated access/refresh
 * tokens, but those cookies are not automatically reflected in the Cookie header
 * for this same server-side request. This merges the original request cookies
 * with any refreshed cookie values so the retry uses the latest cookie state.
 *
 * Note: Set-Cookie and Cookie use different formats, so we only copy the
 * cookie name/value pairs and discard attributes like HttpOnly, Secure, Path,
 * SameSite, and Expires.
 */
function buildCookieHeader(cookieHeader: string, setCookieHeaders: string[]) {
  if (!setCookieHeaders.length) return cookieHeader;

  const cookieMap = new Map<string, string>();

  for (const cookie of cookieHeader.split(';')) {
    const separatorIndex = cookie.indexOf('=');
    if (separatorIndex === -1) continue;

    const name = cookie.slice(0, separatorIndex).trim();
    const value = cookie.slice(separatorIndex + 1).trim();
    if (name) cookieMap.set(name, value);
  }

  for (const setCookie of setCookieHeaders) {
    const [nameValue] = setCookie.split(';', 1);
    const separatorIndex = nameValue.indexOf('=');
    if (separatorIndex === -1) continue;

    const name = nameValue.slice(0, separatorIndex).trim();
    const value = nameValue.slice(separatorIndex + 1).trim();
    if (name) cookieMap.set(name, value);
  }

  return Array.from(cookieMap, ([name, value]) => `${name}=${value}`).join('; ');
}

async function fetchWithAccessToken(
  path: string,
  init: RequestInit,
  accessToken: string,
  cookieHeader: string,
  baseUrl: string,
) {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  if (cookieHeader) headers.set('Cookie', cookieHeader);

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}

/**
 * Fetches an ASP.NET endpoint from Next.js route handlers and server helpers.
 *
 * Verifies the local access token and attaches it as a bearer token.
 */
export async function aspnetFetch(
  path: string,
  init: RequestInit = {},
  opts?: {
    /** Override the backend base URL for rare special cases. */
    baseUrlOverride?: string;
  },
): Promise<AspnetFetchResult> {
  const session = await verifySession();
  const cookieHeader = (await cookies()).toString();
  const baseUrl = opts?.baseUrlOverride ?? BACKEND_URL;

  if (session.status === 'authenticated') {
    const res = await fetchWithAccessToken(path, init, session.accessToken, cookieHeader, baseUrl);
    return { res, setCookieHeaders: [] };
  }

  if (session.status === 'invalid_access_token') {
    return { res: unauthorizedResponse(), setCookieHeaders: [] };
  }

  // accessToken missing, expired, or invalid. Attempt to refresh the access token.
  const refreshRes = await refreshAccessToken(cookieHeader);
  const setCookieHeaders = getSetCookieHeaders(refreshRes);

  if (!refreshRes.ok) {
    return { res: unauthorizedResponse(), setCookieHeaders };
  }

  const accessToken = getCookieValueFromSetCookie(setCookieHeaders, AUTH_COOKIES.access);
  if (!accessToken) {
    return { res: unauthorizedResponse(), setCookieHeaders };
  }

  // build a new Cookie header that merges the original request cookies with any refreshed cookie values
  const refreshedCookieHeader = buildCookieHeader(cookieHeader, setCookieHeaders);

  // Retry the original request with the refreshed access token and updated Cookie header
  const res = await fetchWithAccessToken(path, init, accessToken, refreshedCookieHeader, baseUrl);

  return { res, setCookieHeaders };
}

/**
 * Convenience wrapper for typed JSON responses.
 *
 * Example:
 *   const result = await aspnetJson<MyType>('/api/CWH/final-report/123');
 */
export async function aspnetJson<T>(
  path: string,
  init: RequestInit = {},
  opts?: { baseUrlOverride?: string },
): Promise<{ ok: true; data: T } | { ok: false; status: number; errorText: string }> {
  const { res } = await aspnetFetch(path, init, opts);

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    return { ok: false, status: res.status, errorText };
  }

  const data = (await res.json()) as T;
  return { ok: true, data };
}
