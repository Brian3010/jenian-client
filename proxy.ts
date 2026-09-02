// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

const REFRESH_COOKIE = 'refreshToken';
const DEVICE_ID_COOKIE = 'deviceId';

function isStaticOrNextAsset(pathname: string) {
  // Next.js generated assets
  if (pathname.startsWith('/_next/static')) return true;
  if (pathname.startsWith('/_next/image')) return true;

  // Metadata files
  if (pathname === '/favicon.ico') return true;
  if (pathname === '/robots.txt') return true;
  if (pathname === '/sitemap.xml') return true;
  if (pathname === '/manifest.json') return true;
  if (pathname === '/manifest.webmanifest') return true;

  // Public static assets
  return /\.(png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|map|txt|xml|webmanifest|woff|woff2|ttf|otf|pdf)$/.test(pathname);
}

function isAnyApi(pathname: string) {
  return pathname === '/api' || pathname.startsWith('/api/');
}

function isPublicApi(pathname: string) {
  return (
    pathname === '/api/auth' ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/api/public' ||
    pathname.startsWith('/api/public/') ||
    pathname === '/api/health' ||
    pathname.startsWith('/api/health/') ||
    pathname === '/api/demo-account' ||
    pathname.startsWith('/api/demo-account/')
  );
}

function isPublicPage(pathname: string) {
  return (
    pathname === '/auth/sign-in' || pathname === '/auth/register' || pathname === '/' || pathname === '/demo-account'
  );
}

function hasSession(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const deviceId = req.cookies.get(DEVICE_ID_COOKIE)?.value;

  return Boolean(refreshToken && deviceId);
}

export function proxy(req: NextRequest) {
  console.log(`🚀 ~ Proxy - Incoming request: ${req.method} ${req.url}`);
  const { pathname, search } = req.nextUrl;

  /**
   * Allow static assets and metadata files.
   */
  if (isStaticOrNextAsset(pathname)) {
    return NextResponse.next();
  }

  const sessionExists = hasSession(req);

  /**
   * Signed-in users should not stay on public authentication pages.
   */
  if (sessionExists && (pathname === '/' || isPublicPage(pathname))) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';

    return NextResponse.redirect(url);
  }

  /**
   * Public page routes.
   */
  if (isPublicPage(pathname)) {
    return NextResponse.next();
  }

  /**
   * API routes.
   *
   * Public:
   * - /api/auth/*
   * - /api/public/*
   * - /api/health/*
   *
   * Protected:
   * - every other /api/*
   */
  if (isAnyApi(pathname)) {
    if (isPublicApi(pathname)) {
      console.log('🚀 ~ Proxy - Public API route, allowing through without auth check');
      return NextResponse.next();
    }

    if (!sessionExists) {
      console.log('🚀 ~ Proxy - Protected API route, unauthorized access');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  /**
   * Private pages.
   */
  if (!sessionExists) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    url.searchParams.set('next', pathname + search);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|manifest.webmanifest).*)'],
};
