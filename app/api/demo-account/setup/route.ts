import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const backendUrl = process.env.BACKEND_URL;
  // set abort controller to cancel request in 10_000
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  // try to fecth /api/Auth/demo-login
  try {
    const res = await fetch(`${backendUrl}/api/Auth/demo-login`, {
      method: 'POST',
      signal: controller.signal,
    });

    if (res.ok) {
      const response = NextResponse.json(null, { status: 200 });
      appendSetCookieHeaders(response, res.headers.getSetCookie?.() || []);
      console.log('🚀 ~ POST ~ response:', response);
      return response;
    }
    return NextResponse.json({ message: 'Failed to setup demo account' }, { status: 500 });
  } catch (error) {
    console.error('Error setting up demo account:', error);
    return NextResponse.json({ message: 'Failed to setup demo account' }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }

  // if response is ok, wait 20_000 ms then return 200
  // if response is not ok or error occured, return 500
  // noted if abort controller is triggered, it jumps to catch block and return 500
}
