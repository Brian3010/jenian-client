import { getTelegramToken } from '@/features/telegram/services/telegram.server';
import { ApiResponse } from '@/lib/api/api-types';
import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const { serverResult, cookieHeaders } = await getTelegramToken<{ linkToken: string }>();

  // Convert ServerResult to ApiResponse
  const apiResponseBody: ApiResponse<{ linkToken: string }> = serverResult.ok
    ? { success: true, data: serverResult.data, errors: [] }
    : { success: false, data: null, errors: serverResult.errors };
  console.log('🚀 ~ GET ~ apiResponseBody:', apiResponseBody);

  // Create a NextResponse with the ApiResponse and appropriate status code
  const response = NextResponse.json(apiResponseBody, {
    status: serverResult.ok ? 200 : (serverResult.status ?? 500),
  });

  // Append Set-Cookie headers to the response
  appendSetCookieHeaders(response, cookieHeaders);

  return response;
}
