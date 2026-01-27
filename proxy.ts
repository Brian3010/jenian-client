// proxy.ts
/**
 * ----------------------
 * This file runs BEFORE your route/page/API handler.
 * Think of it as a lightweight "gatekeeper" for routing.
 *
 * WHAT proxy.ts DO
 * -----------------------
 * ✅ Redirect unauthenticated users away from PRIVATE pages (to /sign-in)
 * ✅ Optionally redirect authenticated users away from /sign-in (to /dashboard)
 * ✅ Optionally block calls to /api/private/* if there is no session
 *
 * WHAT proxy.ts SHOULD NOT DO
 * ---------------------------
 * ❌ It should NOT call your ASP.NET API
 * ❌ It should NOT refresh tokens
 *
 * Refreshing access tokens happens in your server fetch wrapper:
 *   src/lib/auth/aspnet.ts
 *
 * IMPORTANT RULE FOR YOUR TOKEN MODEL
 * -----------------------------------
 * Access tokens expire frequently, so they may be missing/expired.
 * Your app should treat the user as "has a session" if they have a
 * refresh token cookie (because aspnet.ts can use it to get a new access token).
 *
 * Therefore proxy.ts should check for refresh_token (or refresh OR access),
 * NOT only access_token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { aspnetFetch } from './lib/auth/aspnet';

// Keep cookie names consistent with src/lib/auth/session.ts
const ACCESS_COOKIE = 'accessToken';
const REFRESH_COOKIE = 'refreshToken';
const USER_DETAILS = 'userInfo';

/**
 * Decide which paths are ALWAYS public.
 * You said: "sign-in is public, the rest are private routes."
 */
function isPublicPath(pathname: string) {
  // Public UI route
  if (pathname === '/sign-in') return true;

  // (Optional) allow public BFF endpoints if you add them later
  if (pathname.startsWith('/api/public')) return true;

  return false;
}

/**
 * Next.js internal assets / static files must NOT be blocked.
 * If you block these, your app will look broken (CSS/JS/images won't load).
 */
function isNextOrStaticAsset(pathname: string) {
  if (pathname.startsWith('/_next')) return true;
  if (pathname === '/favicon.ico') return true;

  // Common static file extensions
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml)$/.test(pathname)) return true;

  return false;
}

/**
 * Is this a private API call?
 * With the BFF setup, your UI will call /api/private/* for authenticated calls.
 */
function isPrivateApi(pathname: string) {
  return pathname.startsWith('/api/private');
}

/**
 * Is this any API call?
 * (We handle API a bit differently than page navigation.)
 */
function isAnyApi(pathname: string) {
  return pathname.startsWith('/api/');
}

export async function proxy(req: NextRequest) {
  console.log('Proxy runned');
  const { pathname } = req.nextUrl;

  // Always allow Next internals + static files
  if (isNextOrStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Read cookies. Refresh cookie is the best "session exists" indicator.
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const userDetails = req.cookies.get(USER_DETAILS)?.value;

  // Treat user as authenticated if they have refresh OR access
  // (refresh is the important one for your setup)
  const hasSession = Boolean(refreshToken || accessToken);
  console.log('🚀 ~ proxy ~ hasSession:', hasSession);

  // If user is already authenticated, keep them out of /sign-in
  // (optional but nice UX)
  if (pathname === '/sign-in' && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Allow public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Optional: protect private API endpoints early
  // If there's no refresh token, the user cannot refresh an expired access token,
  // so private API calls should be rejected quickly.
  //
  // NOTE: We check refreshToken here (not accessToken) because access can expire.
  if (isPrivateApi(pathname) && !hasSession) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Protect private pages:
  // Anything that is not public and not an API route is treated as private UI.
  //
  // If no session => redirect to /sign-in and preserve "next" so you can return after login.
  if (!isAnyApi(pathname) && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // // Make sure there will be user detail available in cookie:
  if (hasSession && userDetails == null) {
    console.log('asdsdfgasgasdf');
    const aspRes = await aspnetFetch(`/api/Auth/get-me`);
    if (!aspRes.res.ok) {
      const url = req.nextUrl.clone();
      url.pathname = 'sign-in';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    const res = NextResponse.next();
    const cookieValue = await aspRes.res.text();
    res.cookies.set('user', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // maxAge: 60 * 5, // seconds
    });

    return res;
  }

  // Otherwise allow request to continue
  return NextResponse.next();
}

/**
 * Apply to all routes.
 * If you later add more public routes, keep them in isPublicPath().
 */
export const config = {
  matcher: ['/:path*'],
};
