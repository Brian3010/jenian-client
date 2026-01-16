/**
 * aspnet.ts
 * ---------
 * Server-side (BFF) helper for calling your ASP.NET Core API.
 * UI should call Next.js endpoints (e.g. /api/private/...)
 * and Next.js should call your ASP.NET API server-to-server.
 *
 * This file provides ONE consistent way to:
 *   1) Read the access token from httpOnly cookies (server-side only)
 *   2) Add `Authorization: Bearer <accessToken>` to ASP.NET requests
 *   3) If ASP.NET returns 401 (expired access token):
 *        - call ASP.NET refresh-token endpoint using refresh token
 *        - update the access token cookie
 *        - retry the original request ONCE
 *   4) If refresh fails (refresh token expired/invalid):
 *        - clear cookies so the user must log in again
 *
 * IMPORTANT: proxy.ts is NOT the place to refresh tokens.
 * proxy.ts is just a "gatekeeper" to redirect users to /sign-in if there is no session.
 */

import 'server-only';
import { clearAuthCookies, getAccessToken, getRefreshToken, setAccessCookie } from './session';

const BACKEND_URL = process.env.BACKEND_URL!;
if (!BACKEND_URL) {
  throw new Error('Missing BACKEND_URL in environment variables.');
}

/**
 *
 *   POST /api/Auth/refresh-token
 *   -> { accessToken, userDetails }
 */
export type UserDetails = Record<string, unknown>; // Replace with your real type
type RefreshResponse = {
  accessToken: string;
  userDetails: UserDetails;
};

async function refreshAccessToken(): Promise<{ ok: true; userDetails: UserDetails } | { ok: false }> {
  // Refresh token comes from httpOnly cookie (server-only)
  const refreshToken = getRefreshToken();
  if (!refreshToken) return { ok: false };

  // Call ASP.NET refresh endpoint
  const r = await fetch(`${BACKEND_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

    // Adjust this body if your backend expects a different payload
    body: JSON.stringify({ refreshToken }),

    // Avoid caching auth calls
    cache: 'no-store',
  });

  // Refresh failed => treat session as expired
  if (!r.ok) {
    clearAuthCookies(); // force user to login next time
    return { ok: false };
  }

  const data = (await r.json()) as RefreshResponse;

  // If response doesn't contain a usable access token, treat as invalid session
  if (!data?.accessToken) {
    clearAuthCookies();
    return { ok: false };
  }

  // Refresh succeeded => update only access cookie (refresh token unchanged)
  setAccessCookie({
    accessToken: data.accessToken,
    // Optionally set accessMaxAgeSec to match backend access TTL
  });

  return { ok: true, userDetails: data.userDetails };
}

/**
 * Main helper you will use from Next.js route handlers.
 *
 * Example usage:
 *   const { res } = await aspnetFetch("/api/CWH/eod-report", { method: "POST", body: JSON.stringify(payload) });
 *
 * WHAT IT DOES
 * ------------
 * - Adds Authorization header if access token exists
 * - Calls ASP.NET
 * - If response is 401:
 *     * tries refresh once
 *     * retries the original request once
 * - Returns the final Response
 */
export async function aspnetFetch(
  path: string,
  init: RequestInit = {},
  opts?: {
    /**
     * If true (default), try refresh+retry once when ASP.NET returns 401.
     * You may turn this off for endpoints where 401 should just pass through.
     */
    retryOn401?: boolean;

    /**
     * Optional: override base URL if needed (rare).
     */
    baseUrlOverride?: string;
  }
): Promise<{ res: Response; refreshedUser?: UserDetails }> {
  const retryOn401 = opts?.retryOn401 ?? true;
  const baseUrl = opts?.baseUrlOverride ?? BACKEND_URL;

  /**
   * doRequest():
   * Performs the actual fetch to ASP.NET with bearer token injected.
   */
  const doRequest = async (): Promise<Response> => {
    const accessToken = getAccessToken();

    // Merge caller headers safely (supports both object and Headers inputs)
    const headers = new Headers(init.headers);

    // Add content-type if sending a body and caller didn't specify it
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add bearer token if present
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Make request to ASP.NET server
    return fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      cache: 'no-store',
    });
  };

  // First attempt (using current access token if present)
  let res = await doRequest();

  // If access token is expired, ASP.NET typically returns 401
  if (res.status === 401 && retryOn401) {
    // Try to refresh access token (using refresh token)
    const refreshed = await refreshAccessToken();

    // If refresh succeeded, retry original request once with new access token
    if (refreshed.ok) {
      res = await doRequest();
      return { res, refreshedUser: refreshed.userDetails };
    }

    // If refresh failed, cookies were cleared and we return the original 401.
    // UI can redirect to /sign-in.
  }

  return { res };
}

/**
 * Optional convenience wrapper if you commonly want JSON typed responses.
 *
 * Usage:
 *   const result = await aspnetJson<MyType>("/api/CWH/final-report/123");
 */
export async function aspnetJson<T>(
  path: string,
  init: RequestInit = {},
  opts?: { retryOn401?: boolean }
): Promise<{ ok: true; data: T; refreshedUser?: UserDetails } | { ok: false; status: number; errorText: string }> {
  const { res, refreshedUser } = await aspnetFetch(path, init, opts);

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    return { ok: false, status: res.status, errorText };
  }

  const data = (await res.json()) as T;
  return { ok: true, data, refreshedUser };
}
