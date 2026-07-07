import { refreshAccessToken } from '@/features/auth/services/auth.server';
import { clearAuthCookies } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

function getSafeReturnTo(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard';

  // Only allow same-site relative paths. Avoid open redirects like:
  // /api/auth/refresh?returnTo=https://evil.example
  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
    return '/dashboard';
  }

  return returnTo;
}

export async function GET(request: NextRequest) {
  const returnTo = getSafeReturnTo(request);
  try {
    const res = await refreshAccessToken(request.headers.get('cookie') || '');

    if (!res.ok) {
      const response = NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
      await clearAuthCookies(response);
      return response;
    }

    const response = NextResponse.redirect(new URL(returnTo, process.env.NEXT_PUBLIC_APP_URL));

    // Forward cookies from ASP.NET response, setting them in the Next.js response to the client.
    const setCookie = res.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookie) {
      response.headers.append('Set-Cookie', cookie);
    }
    console.log('🚀 ~ GET ~ response:', response);

    return response;
  } catch (error) {
    console.error('Error in refresh route:', error);
    const errorUrl = new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL);
    errorUrl.searchParams.set('error', 'server_error');
    errorUrl.searchParams.set('returnTo', returnTo); // Retain original destination for later retry

    return NextResponse.redirect(errorUrl);
  }
}
