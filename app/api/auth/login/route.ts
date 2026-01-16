import { setAuthCookies } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

type DataResT = {
  message: string;
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

export async function POST(request: Request) {
  console.log('AUTH POST');
  const body = await request.text();
  // console.log('Request: ', { ...body });

  const be = await fetch(`${BACKEND_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  //NOTE: use be.text() insteadof be.json() to preserve the raw response
  const data = await be.text();
  console.log(data);
  const ct = be.headers.get('content-type') ?? 'application/json';

  const res = new NextResponse(data, { status: be.status, statusText: be.statusText, headers: { 'content-type': ct } });

  // pass through ALL cookies from backend (this is your refresh cookie)
  const setCookie = be.headers.get('set-cookie');
  if (setCookie) {
    for (const c of setCookie.split(/,(?=\s*[A-Za-z0-9_\-]+=)/g)) res.headers.append('Set-Cookie', c);
  }

  // TODO: set AccessToken cookie

  return res;
}
