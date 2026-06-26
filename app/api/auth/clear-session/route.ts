import { clearAuthCookies } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// api/auth/clear-session/route.ts
// clear the session cookies and redirect to the sign-in page or a specified returnTo URL
// this route is used for session failures
export async function GET(req: NextRequest) {
  const returnTo = req.nextUrl.searchParams.get('returnTo') || '/sign-in';

  const redirectUrl = new URL(returnTo, process.env.NEXT_PUBLIC_APP_URL);
  const res = NextResponse.redirect(redirectUrl);

  await clearAuthCookies(res);

  return res;
}
