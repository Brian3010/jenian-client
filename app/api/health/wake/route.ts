import { NextRequest, NextResponse } from 'next/server';

const BACKEND_READY_COOKIE = 'backendReady';
const BACKEND_READY_MAX_AGE_SECONDS = 10 * 60;

// Keep the whole wake-up attempt bounded, but keep each backend call shorter
// so a single hung request does not consume the entire window.
const WAKE_TIMEOUT_MS = 45_000;
const REQUEST_TIMEOUT_MS = 8_000;
const RETRY_DELAY_MS = 2_000;

export const dynamic = 'force-dynamic';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkBackend(backendUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // This request is what wakes the scaled-to-zero ASP backend.
    const res = await fetch(`${backendUrl}/api/Home/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

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

  const startedAt = Date.now();

  // Poll until the backend responds or the wake-up window expires.
  while (Date.now() - startedAt < WAKE_TIMEOUT_MS) {
    const healthy = await checkBackend(backendUrl);

    if (healthy) {
      const response = NextResponse.json({ ok: true });

      // Mark the backend as recently ready for future server-rendered gates.
      response.cookies.set(BACKEND_READY_COOKIE, '1', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: BACKEND_READY_MAX_AGE_SECONDS,
      });

      return response;
    }

    await delay(RETRY_DELAY_MS);
  }

  return NextResponse.json({ ok: false }, { status: 503 });
}
