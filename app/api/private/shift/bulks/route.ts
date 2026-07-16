import { submitShifts } from '@/features/shift/services/shift.server';
import { ShiftSummaryResult, UserShift } from '@/features/shift/types';
import { ApiResponse } from '@/lib/api/api-types';
import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { NextResponse } from 'next/server';
type ShiftSubmitPayload = {
  cycleStartDate: string;
  cycleEndDate: string;
  shifts: UserShift[];
  deletedShiftIds: string[];
};
export async function PUT(request: Request) {
  const { shifts, deletedShiftIds, cycleStartDate, cycleEndDate } = (await request.json()) as ShiftSubmitPayload;
  console.log(`🚀 ~ PUT ~ { shifts, deletedShiftIds, cycleStartDate, cycleEndDate } :`, {
    shifts,
    deletedShiftIds,
    cycleStartDate,
    cycleEndDate,
  });

  // Call the server-side feature function, which talks to ASP.NET.
  const { serverResult, cookieHeaders } = await submitShifts(cycleStartDate, cycleEndDate, shifts, deletedShiftIds);

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
