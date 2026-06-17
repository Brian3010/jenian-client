import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/Home/health`, {
      method: 'GET',
    });
    console.log('🚀 ~ GET ~ res:', res);

    return new NextResponse(null, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('GET /api/health: ', error);
    return NextResponse.json({ message: 'Backend unavailable' }, { status: 503 });
  }
}
