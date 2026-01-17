import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(request: Request) {
  console.log('AUTH POST');
  const body = await request.text();
  // console.log('Request: ', { ...body });

  const aspRes = await fetch(`${BACKEND_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  //NOTE: use be.text() insteadof be.json() to preserve the raw response
  const bodyData = await aspRes.text();
  // console.log('🚀 ~ POST ~ data:', bodyData);
  const ct = aspRes.headers.get('content-type') ?? 'application/json';
  const res = new NextResponse(bodyData, {
    status: aspRes.status,
    statusText: aspRes.statusText,
    headers: { 'content-type': ct },
  });
  // console.log('🚀 ~ POST ~ res:', res);

  //Bug: AccessToken dont register after successfully logined in - might be because of proxy or session.ts
  const { accessToken } = JSON.parse(bodyData);
  if (accessToken) {
    res.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false on localhost (http)
      sameSite: 'lax',
      path: '/',
    });
  }

  // pass through ALL cookies from backend (this is your refresh cookie) - set cookies from backend
  const setCookie = aspRes.headers.get('set-cookie');
  if (setCookie) {
    for (const c of setCookie.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g)) res.headers.append('Set-Cookie', c);
  }

  return res;
}
