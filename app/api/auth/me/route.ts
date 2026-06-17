import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

// api/auth/me/route.ts
export async function GET() {
  console.log('GET /api/auth/me: Request received');
  try {
    const { res } = await aspnetFetch('/api/Auth/get-me');
    console.log('🚀 ~ GET ~ api/auth/me/route.ts res:', res);
    //BUG: Missing Cookies here
    const aspBody = await res.text();

    return new NextResponse(aspBody, {
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
