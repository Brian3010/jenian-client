import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';
// headers: request.headers can be problematic with FormData if it includes a content-type from the incoming request.
// If you forward an existing content-type: multipart/form-data without the correct boundary, the outgoing upload may break.
//if body is FormData, it’s safest to not forward content-type and let fetch set it

export async function POST(request: Request, ctx: RouteContext<'/api/private/cwh/[...path]'>) {
  const { path } = await ctx.params;
  // console.log('🚀 ~ POST ~ path:', path.join('/'));
  const urlPath = `/api/${path.join('/')}`;
  const formData = await request.formData();
  // console.log('🚀 ~ POST ~ formData:', formData);

  try {
    const { res } = await aspnetFetch(urlPath, {
      method: 'POST',
      body: formData,
    });
    const nextRes = new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
    return nextRes;
  } catch (error) {
    throw error;
  }
}
