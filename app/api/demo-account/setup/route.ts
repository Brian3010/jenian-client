import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { fetchBackendWithWakeRetry } from '@/lib/backend-health';
import { NextResponse } from 'next/server';

export async function POST() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ message: 'Missing backend configuration' }, { status: 500 });
  }

  try {
    const res = await fetchBackendWithWakeRetry(backendUrl, '/api/Auth/demo-login', {
      method: 'POST',
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
  }
}
