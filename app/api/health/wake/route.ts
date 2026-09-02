import { BACKEND_READY_COOKIE, BACKEND_READY_MAX_AGE_SECONDS, wakeBackend } from '@/lib/backend-health';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // A short-lived cookie lets repeat app opens skip the wake-up call entirely.
  const backendReady = request.cookies.get(BACKEND_READY_COOKIE)?.value === '1';

  if (backendReady) {
    return NextResponse.json({ ok: true, cached: true });
  }

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ ok: false, error: 'Missing BACKEND_URL' }, { status: 500 });
  }

  const healthy = await wakeBackend(backendUrl);

  if (healthy) {
    const response = NextResponse.json({ ok: true });

    response.cookies.set(BACKEND_READY_COOKIE, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: BACKEND_READY_MAX_AGE_SECONDS,
    });

    return response;
  }

  return NextResponse.json({ ok: false }, { status: 503 });
}
