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
