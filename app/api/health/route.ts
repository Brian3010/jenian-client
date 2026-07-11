// /api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/Home/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    console.log('🚀 ~ GET ~ res:', res.ok);

    clearTimeout(timeout);

    return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 503 });
  } catch {
    clearTimeout(timeout);
    console.error('Backend health check failed');
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
