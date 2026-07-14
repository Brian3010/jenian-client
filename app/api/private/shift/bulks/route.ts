import { submitShifts } from '@/features/shift/services/shift.server';
import { ShiftSummaryResult } from '@/features/shift/types';
import { ApiResponse } from '@/lib/api/api-types';
import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { shifts, deletedShiftIds } = await request.json();

  // Call the server-side feature function, which talks to ASP.NET.
  const { serverResult, cookieHeaders } = await submitShifts(shifts, deletedShiftIds);

  // Convert ServerResult to ApiResponse
  const apiResponseBody: ApiResponse<ShiftSummaryResult> = serverResult.ok
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
