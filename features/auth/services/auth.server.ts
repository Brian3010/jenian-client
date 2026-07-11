import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing BACKEND_URL environment variable');
}

// this function is used in the refresh route to call backend and get the new access token and set it in the cookie
export async function refreshAccessToken(cookieHeader: string): Promise<Response> {
  return fetch(`${BACKEND_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  // No need to convert to Server Result here,
  // the cookieHeader is set by backend
  // return response to route handler to set the cookie in the response to the client
}

export async function logout(): Promise<ServerResult<void>> {
  const { res } = await aspnetFetch('/api/Auth/logout', {
    method: 'DELETE',
  });

  return await parseAspnetApiResponse<void>(res, 'Failed to logout user');
}
