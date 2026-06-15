import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { res } = await aspnetFetch('/api/Auth/get-me');

    const aspBody = await res.text();

    return new NextResponse(aspBody || null, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me: ', error);

    return NextResponse.json({ message: 'Unable to fetch current user.' }, { status: 500 });
  }
}
