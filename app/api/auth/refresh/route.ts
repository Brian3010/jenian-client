import { clearAuthCookies } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard';
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/Auth/refresh-token`, {
      method: 'POST',
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      // clear cookies and return to sign-in if refresh token is invalid
      await clearAuthCookies();
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
  } catch (error) {
    console.error('Error in refresh route:', error);
    const errorUrl = new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL);
    errorUrl.searchParams.set('error', 'server_error');
    errorUrl.searchParams.set('returnTo', returnTo); // Retain original destination for later retry

    return NextResponse.redirect(errorUrl);
  }
}
