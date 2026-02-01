import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET(_: Request, ctx: RouteContext<'/api/private/telegram/[...path]'>) {
  console.log('private route');
  const { path } = await ctx.params;
  console.log('🚀 ~ GET ~ path:', path);

  // const url = `${API}/${ctx.params.path.join("/")}${req ? new URL(req.url).search : ""}`;
  const url = `/api/${path.join('/')}`;
  console.log('🚀 ~ GET ~ url:', url);
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
