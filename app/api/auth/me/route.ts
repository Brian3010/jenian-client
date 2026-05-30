import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET() {
  const { res } = await aspnetFetch('/api/Auth/get-me');

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
