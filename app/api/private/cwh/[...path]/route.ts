import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';
// headers: request.headers can be problematic with FormData if it includes a content-type from the incoming request.
// If you forward an existing content-type: multipart/form-data without the correct boundary, the outgoing upload may break.
//if body is FormData, it’s safest to not forward content-type and let fetch set it

export async function POST(request: Request, ctx: RouteContext<'/api/private/cwh/[...path]'>) {
  console.log('route entered');

  const { path } = await ctx.params;
  console.log('path =', path);

  const urlPath = `/api/${path.join('/')}`;
  console.log('urlPath =', urlPath);

  try {
    const formData = await request.formData();
    console.log('formData keys =', Array.from(formData.keys()));

    const { res } = await aspnetFetch(urlPath, {
      method: 'POST',
      body: formData,
    });

    return new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch (error) {
    console.error('route POST failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
