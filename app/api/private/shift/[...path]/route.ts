import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET(req: Request, ctx: RouteContext<'/api/private/shift/[...path]'>) {
  try {
    const { path } = await ctx.params;
    const search = new URL(req.url).search;
    const url = `/api/cwh/${path.join('/')}${search}`;

    const { res } = await aspnetFetch(url);
    const aspBody = await res.text();

    return new NextResponse(aspBody, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('BFF route error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
