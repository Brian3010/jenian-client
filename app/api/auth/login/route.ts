import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;
if (!BACKEND_URL) throw new Error('Missing BACKEND_URL environment variable');

/**
export async function POST(request: Request) {

  
  const cookieStore = await cookies();

  // Reuse existing deviceId or create a new one, then store it as a session cookie
  const existingDeviceId = cookieStore.get('deviceId')?.value;
  const deviceId = existingDeviceId ?? crypto.randomUUID();
  if (!existingDeviceId) {
    cookieStore.set('deviceId', deviceId, { sameSite: 'lax', path: '/' });
  }

  
  const body = await request.text();

  const aspRes = await fetch(`${BACKEND_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieStore.toString() },
    body,
  });

  // Use text() to preserve raw response — avoids double-parsing
  const bodyData = await aspRes.text();
  console.log('🚀 ~ POST ~ bodyData:', bodyData);
  const ct = aspRes.headers.get('content-type') ?? 'application/json';

  const nextRes = new NextResponse(bodyData, {
    status: aspRes.status,
    statusText: aspRes.statusText,
    headers: { 'content-type': ct },
  });

  // Only set accessToken cookie on successful login
  // if (aspRes.ok) {
  //   try {
  //     const { accessToken } = JSON.parse(bodyData);
  //     if (accessToken) {
  //       nextRes.cookies.set('accessToken', accessToken, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === 'production',
  //         sameSite: 'lax',
  //         path: '/',
  //         expires: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
  //       });
  //       nextRes.cookies.set('userName', JSON.parse(bodyData).user.userName || '', {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === 'production',
  //         sameSite: 'lax',
  //         path: '/',
  //         expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  //       });
  //     }
  //   } catch {
  //     // bodyData wasn't JSON — skip setting cookie
  //   }
  // }

  // Forward refresh token cookie from ASP.NET
  // const setCookie = aspRes.headers.get('set-cookie');
  // if (setCookie) {
  //   for (const c of setCookie.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g)) nextRes.headers.append('Set-Cookie', c);
  // }

  return nextRes;
}
*/

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const existingDeviceId = cookieStore.get('deviceId')?.value;
    const deviceId = existingDeviceId ?? crypto.randomUUID();
    if (!existingDeviceId) {
      cookieStore.set('deviceId', deviceId, { sameSite: 'lax', path: '/' });
    }

    const body = await request.text();
    const aspRes = await fetch(`${BACKEND_URL}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieStore.toString() },
      body,
    });
    console.log('🚀 ~ POST ~ aspRes:', aspRes);

    const nextRes = new NextResponse(null, {
      status: aspRes.status,
      statusText: aspRes.statusText,
      headers: {
        'content-type': aspRes.headers.get('content-type') ?? 'application/json',
        'set-cookie': aspRes.headers.get('set-cookie') ?? '',
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
