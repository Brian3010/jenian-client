import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request: Request) {
  console.log('AUTH POST');
  const body = await request.text();
  // console.log('Request: ', { ...body });
  // Create deviceID, store it in cookie, send it to the asp and save it in db, attach to the body to submit
  const deviceId = crypto.randomUUID();
  const cookieStore = await cookies();
  if (!cookieStore.get('deviceId')) cookieStore.set('deviceId', deviceId);
  console.log("🚀 ~ POST ~ !cookieStore.get('deviceId'):", !cookieStore.get('deviceId'));

  const aspRes = await fetch(`${BACKEND_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookieStore.toString() },
    body,
  });

  //NOTE: use be.text() insteadof be.json() to preserve the raw response
  const bodyData = await aspRes.text();
  // console.log('🚀 ~ POST ~ data:', bodyData);
  const ct = aspRes.headers.get('content-type') ?? 'application/json';
  const nextRes = new NextResponse(bodyData, {
    status: aspRes.status,
    statusText: aspRes.statusText,
    headers: { 'content-type': ct },
  });
  // console.log('🚀 ~ POST ~ res:', res);

  const { accessToken } = JSON.parse(bodyData);
  if (accessToken) {
    nextRes.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false on localhost (http)
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  // pass through ALL cookies from backend (this is your refresh cookie) - set cookies from backend
  const setCookie = aspRes.headers.get('set-cookie');
  if (setCookie) {
    for (const c of setCookie.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g)) nextRes.headers.append('Set-Cookie', c);
  }

  return nextRes;
}
