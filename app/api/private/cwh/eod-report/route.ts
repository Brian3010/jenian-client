import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // trycatch to handle unexpected errors in the route handler itself, separate from network errors when connecting to the ASP.NET backend.
  try {
    let aspRes: Response;

    const formData = await request.formData();

    // trycatch to handle network errors when connecting to the ASP.NET backend.
    try {
      const { res } = await aspnetFetch('/api/CWH/eod-report', {
        method: 'POST',
        body: formData,
      });

      aspRes = res;
    } catch (error) {
      console.error('ASP.NET backend request failed:', error);
      return NextResponse.json(
        {
          message: 'Unable to reach backend service',
        },
        { status: 502 },
      );
    }

    const aspBody = await aspRes.text();

    // Forward the ASP.NET response back to the client, preserving status code and content type.
    return new NextResponse(aspBody, {
      status: aspRes.status,
      statusText: aspRes.statusText,
      headers: {
        'content-type': aspRes.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error('route POST failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
