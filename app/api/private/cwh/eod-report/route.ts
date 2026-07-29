import { submitEodReport } from '@/features/cwh/services/cwh.server';
import type { EodReportResponse } from '@/features/cwh/types';
import type { ApiResponse } from '@/lib/api/api-types';
import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { verifySession } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

// Read form data from the browser request.
// Call the server-side feature function, which talks to ASP.NET.
// Convert ServerResult<T> into browser-facing ApiResponse<T>.
export async function POST(request: Request) {
  const session = await verifySession();

  if (session.status === 'authenticated' && session.user.IsDemoUser) {
    const demoBodyRes: ApiResponse<EodReportResponse> = {
      success: true,
      data: { reportId: 'demo-report-id' },
      errors: [],
    };
    return NextResponse.json(demoBodyRes, { status: 200 });
  }

  const reportValues = await request.formData();
  const { serverResult, cookieHeaders } = await submitEodReport(reportValues);
  console.log('🚀 ~ POST ~ serverResult:', serverResult);

  // Convert ServerResult to ApiResponse
  const apiResponseBody: ApiResponse<EodReportResponse> = serverResult.ok
    ? { success: true, data: serverResult.data, errors: [] }
    : { success: false, data: null, errors: serverResult.errors };

  // Create a NextResponse with the ApiResponse and appropriate status code
  const response = NextResponse.json(apiResponseBody, {
    status: serverResult.ok ? 200 : (serverResult.status ?? 500),
  });

  // Append Set-Cookie headers to the response
  appendSetCookieHeaders(response, cookieHeaders);

  return response;
}
