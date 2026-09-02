import { fetchBackendWithWakeRetry } from '@/lib/backend-health';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) throw new Error('Missing BACKEND_URL environment variable');
const BACKEND_URL = backendUrl;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // Reuse existing deviceId or create a new one, then store it as a session cookie
    const existingDeviceId = cookieStore.get('deviceId')?.value;
    const deviceId = existingDeviceId ?? crypto.randomUUID();
    if (!existingDeviceId) {
      cookieStore.set('deviceId', deviceId, { sameSite: 'lax', path: '/' });
    }

    const body = await request.text();
    const aspRes = await fetchBackendWithWakeRetry(BACKEND_URL, '/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieStore.toString() },
      body,
    });
    const aspBody = await aspRes.text();

    // Forward the ASP.NET response back to the client, preserving status code and content type
    // If the ASP.NET response is 204 No Content (has no body), return null body to avoid parsing empty body.
    const nextRes = new NextResponse(aspRes.status === 204 ? null : aspBody, {
      status: aspRes.status,
      statusText: aspRes.statusText,
      headers: {
        'content-type': aspRes.headers.get('content-type') ?? 'application/json',
      },
    });

    //Forward cookies from ASP.NET response, because NextResponse doesn't support multiple Set-Cookie headers, we need to split and append them individually
    const setCookie = aspRes.headers.get('set-cookie');
    if (setCookie) {
      for (const c of setCookie.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g)) nextRes.headers.append('Set-Cookie', c);
    }
    return nextRes;
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
