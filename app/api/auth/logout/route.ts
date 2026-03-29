import { aspnetFetch } from '@/lib/auth/aspnet';
import { clearAuthCookies, getAccessToken } from '@/lib/auth/session';

export async function GET() {
  const urlPath = '/api/Auth/logout';

  console.log('Logout POST');

  try {
    const accessToken = await getAccessToken();
    console.log('🚀 ~ POST ~ accessToken:', accessToken);

    const { res } = await aspnetFetch(urlPath);

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
