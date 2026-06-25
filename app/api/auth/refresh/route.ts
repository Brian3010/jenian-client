import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard';

  // const res = await fetch(`${process.env.BACKEND_URL}/api/Auth/refresh-token`, {
  //   method: 'POST',
  //   headers: {
  //     cookie: request.headers.get('cookie') || '',
  //   },
  // });
  const { res } = await aspnetFetch('/api/Auth/refresh-token', {
    method: 'POST',
  });
  console.log('🚀 ~ GET refresh ~ res:', res);

  if (!res.ok) {
    // clear cookies and return to sign-in if refresh token is invalid
    const response = NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
    return response;
  }

  const url = new URL(returnTo, process.env.NEXT_PUBLIC_APP_URL);
  const response = NextResponse.redirect(url);

  // Forward cookies from ASP.NET response, setting them in the Next.js response to the client.
  const setCookie = res.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookie) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}
