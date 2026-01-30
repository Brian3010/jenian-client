import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET() {
  const aspRes = await aspnetFetch('/api/Auth/get-me');
  const bodyData: { userId: string; username: string; email: string } = await aspRes.res.json();
  const ct = aspRes.res.headers.get('content-type') ?? 'application/json';

  const nextRes = new NextResponse(JSON.stringify(bodyData), {
    status: aspRes.res.status,
    statusText: aspRes.res.statusText,
    headers: { 'content-type': ct },
  });

  // nextRes.cookies.set('user', JSON.stringify(bodyData), {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production', // false on localhost (http)
  //   sameSite: 'lax',
  //   path: '/',
  // });

  return nextRes;
}
