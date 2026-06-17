import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard';

  const res = await fetch(`${process.env.BACKEND_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const url = new URL(returnTo, process.env.NEXT_PUBLIC_APP_URL);
  const response = NextResponse.redirect(url);

  const setCookie = res.headers.getSetCookie?.() ?? [];

  for (const cookie of setCookie) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}
