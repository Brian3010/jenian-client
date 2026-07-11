import { refreshAccessToken } from '@/features/auth/services/auth.server';
import { getErrorMessageFromResponse } from '@/lib/api/api-error';
import { ApiResponse } from '@/lib/api/api-types';
import { clearAuthCookies } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const res = await refreshAccessToken(request.headers.get('cookie') || '');

    if (!res.ok) {
      const errorBody = await getErrorMessageFromResponse(res);
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, errors: errorBody ? errorBody : ['Failed to refresh access token'] },
        {
          status: res.status || 401,
        },
      );
      await clearAuthCookies(response);
      return response;
    }

    const response = NextResponse.json<ApiResponse<null>>(
      { success: true, data: null, errors: [] },
      {
        status: 200,
      },
    );

    // Forward cookies from ASP.NET response, setting them in the Next.js response to the client.
    const setCookie = res.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookie) {
      response.headers.append('Set-Cookie', cookie);
    }
    return response;
  } catch (error) {
    console.error('Error in refresh route:', error);

    const response = NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, errors: ['Failed to refresh access token'] },
      {
        status: 500,
      },
    );
    await clearAuthCookies(response);
    return response;
  }
}
