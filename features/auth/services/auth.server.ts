import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import { verifySession } from '@/lib/auth/session';
import 'server-only';
import type { RegisterValues } from '../schemas';

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
  const session = await verifySession();
  console.log('🚀 ~ logout ~ session:', session);
  if (session.status === 'authenticated' && session.user.IsDemoUser) {
    console.log('🚀 ~ logout ~ session.user.IsDemoUser:', session.user.IsDemoUser);
    const { res } = await aspnetFetch('/api/Auth/demo-logout', {
      method: 'DELETE',
    });
    return await parseAspnetApiResponse<void>(res, 'Failed to logout demo user');
  }

  const { res } = await aspnetFetch('/api/Auth/logout', {
    method: 'DELETE',
  });

  return await parseAspnetApiResponse<void>(res, 'Failed to logout user');
}

export async function registerUserServer(registerData: RegisterValues): Promise<ServerResult<{ message: string }>> {
  const res = await fetch(`${BACKEND_URL}/api/Auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData),
    cache: 'no-store',
  });

  return await parseAspnetApiResponse<{ message: string }>(res, 'Failed to register user');
}
