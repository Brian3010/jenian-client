import { aspnetFetch } from '@/lib/auth/aspnet';
import { clearAuthCookies, getAccessToken } from '@/lib/auth/session';
import { cookies } from 'next/headers';

export async function POST() {
  const urlPath = '/api/Auth/logout';

  console.log('Logout POST');

  try {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('deviceId');
    console.log('🚀 ~ POST ~ deviceId:', deviceId);

    const accessToken = await getAccessToken();
    console.log('🚀 ~ POST ~ accessToken:', accessToken);

    const { res } = await aspnetFetch(urlPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieStore.toString() },
      body: JSON.stringify({ deviceId: deviceId?.value }),
    });

    if (res.ok) {
      clearAuthCookies();
      console.log('Logout successful');
      return new Response(null, { status: 200 });
    }
    console.error('Logout failed with status:', res.status);
    return new Response(null, { status: res.status });
  } catch (error) {
    console.error('An error occurred during logout:', error);
    return new Response(null, { status: 500 });
  }
}
