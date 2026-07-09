import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing BACKEND_URL environment variable');
}

export async function refreshAccessToken(cookieHeader: string): Promise<Response> {
  return fetch(`${BACKEND_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });
}

export async function logout(): Promise<ServerResult<void>> {
  const { res } = await aspnetFetch('/api/Auth/logout', {
    method: 'DELETE',
  });

  return await parseAspnetApiResponse<void>(res, 'Failed to logout user');
}
