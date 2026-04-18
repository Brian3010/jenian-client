import { UserInfo } from '@/context/userInfo/UserInfoContext';
import { aspnetFetch } from '@/lib/auth/aspnet';
import { NextResponse } from 'next/server';

export async function GET() {
  const aspRes = await aspnetFetch('/api/Auth/get-me', {
    credentials: 'include',
  });
  const bodyData: UserInfo = await aspRes.res.json();
  const ct = aspRes.res.headers.get('content-type') ?? 'application/json';

  const nextRes = new NextResponse(JSON.stringify(bodyData), {
    status: aspRes.res.status,
    statusText: aspRes.res.statusText,
    headers: { 'content-type': ct },
  });

  return nextRes;
}
