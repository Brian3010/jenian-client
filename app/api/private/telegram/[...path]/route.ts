import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET(_: Request, ctx: RouteContext<'/api/private/telegram/[...path]'>) {
  console.log('private route');
  const { path } = await ctx.params;

  // const url = `${API}/${ctx.params.path.join("/")}${req ? new URL(req.url).search : ""}`;
  const url = `/api/${path.join('/')}`;
  const aspRes = await aspnetFetch(url);
  // console.log('🚀 ~ GET ~ aspRes:', aspRes);
  const aspBody = await aspRes.res.text();
  // console.log('🚀 ~ GET ~ aspBody:', aspBody);

  const res = new NextResponse(aspBody, {
    status: aspRes.res.status,
    statusText: aspRes.res.statusText,
    headers: { 'content-type': aspRes.res.headers.get('content-type') ?? 'application/json' },
  });

  return res;
}
