import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET(req: Request, ctx: RouteContext<'/api/private/telegram/[...path]'>) {
  const { path } = await ctx.params;
  const search = new URL(req.url).search;
  const url = `/api/${path.join('/')}${search}`;

  const aspRes = await aspnetFetch(url);
  const aspBody = await aspRes.res.text();

  return new NextResponse(aspBody, {
    status: aspRes.res.status,
    statusText: aspRes.res.statusText,
    headers: {
      'content-type': aspRes.res.headers.get('content-type') ?? 'application/json',
    },
  });
}
