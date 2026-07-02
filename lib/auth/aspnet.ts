/**
 * Server-side BFF helper for calling the ASP.NET Core API.
 *
 * Browser/UI code should call Next.js routes; Next.js forwards authenticated
 * requests to ASP.NET.
 *
 * Token refresh is handled by /api/auth/refresh, where Set-Cookie can be
 * forwarded back to the browser correctly.
 */

import { cookies } from 'next/headers';
import 'server-only';
import { verifySession } from './session';

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing BACKEND_URL in environment variables.');
}

function unauthorizedResponse() {
  return Response.json({ message: 'Unauthorized' }, { status: 401 });
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
): Promise<{ res: Response }> {
  const session = await verifySession();

  if (session.status !== 'authenticated') {
    return { res: unauthorizedResponse() };
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  const cookieHeader = (await cookies()).toString();
  if (cookieHeader) headers.set('Cookie', cookieHeader);

  const baseUrl = opts?.baseUrlOverride ?? BACKEND_URL;
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

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
