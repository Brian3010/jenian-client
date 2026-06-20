/**
 * Server-side BFF helper for calling the ASP.NET Core API.
 * Browser/UI code should call Next.js routes; Next.js forwards authenticated
 * requests to ASP.NET and handles token refresh server-side.
 *
 * Handles:
 * - Reading the access token from httpOnly cookies
 * - Sending `Authorization: Bearer <token>` to ASP.NET
 * - Refreshing once on 401, then retrying the original request
 * - Clearing auth cookies when refresh fails
 *
 * Note: proxy.ts should only gate/redirect unauthenticated users, not refresh tokens.
 */

import { cookies } from 'next/headers';
import 'server-only';
import { clearAuthCookies, getAccessToken } from './session';

const BACKEND_URL = process.env.BACKEND_URL!;
if (!BACKEND_URL) {
  throw new Error('Missing BACKEND_URL in environment variables.');
}

async function refreshAccessToken(): Promise<{ ok: true } | { ok: false }> {
  // Forward browser cookies received by Next.js to the ASP.NET refresh endpoint.
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore).toString();

  const r = await fetch(`${BACKEND_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    cache: 'no-store', // Never cache auth requests.
  });

  // Refresh failed: expire the local session.
  if (!r.ok) {
    clearAuthCookies();
    return { ok: false };
  }

  return { ok: true };
}

/**
 * Fetches an ASP.NET endpoint from Next.js route handlers.
 *
 * Adds the bearer token when available. If ASP.NET returns 401, refreshes the
 * access token once and retries the original request once.
 *
 * Example:
 *   const { res } = await aspnetFetch('/api/CWH/eod-report', {
 *     method: 'POST',
 *     body: JSON.stringify(payload),
 *   });
 */
export async function aspnetFetch(
  path: string,
  init: RequestInit = {},
  opts?: {
    /** Retry once after refreshing the token when ASP.NET returns 401. Defaults to true. */
    retryOn401?: boolean;

    /** Override the backend base URL for rare special cases. */
    baseUrlOverride?: string;
  },
): Promise<{ res: Response }> {
  const retryOn401 = opts?.retryOn401 ?? true;
  const baseUrl = opts?.baseUrlOverride ?? BACKEND_URL;

  // Performs one ASP.NET request with current cookies and bearer token attached.
  const doRequest = async (): Promise<Response> => {
    const accessToken = await getAccessToken();

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const headers = new Headers(init.headers);

    // Attach the access token and cookies from the incoming Next.js request to the ASP.NET request.
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    if (cookieHeader) headers.set('Cookie', cookieHeader);
    // console.log('🚀 ~ aspnetFetch - doRequest ~ headers:', headers);

    return fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });
  };

  let res = await doRequest();

  if (res.status === 401 && retryOn401) {
    const refreshed = await refreshAccessToken();

    if (refreshed.ok) {
      res = await doRequest();
      return { res };
    }

    // Refresh failed; return the original 401 so the UI can redirect to sign-in.
  }

  console.log(`🚀 ~ aspnetFetch to backend: ${path} - Status: ${res.status}`);

  return { res };
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
  opts?: { retryOn401?: boolean },
): Promise<{ ok: true; data: T } | { ok: false; status: number; errorText: string }> {
  const { res } = await aspnetFetch(path, init, opts);

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    return { ok: false, status: res.status, errorText };
  }

  const data = (await res.json()) as T;
  return { ok: true, data };
}
