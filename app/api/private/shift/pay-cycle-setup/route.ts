import { PayCycleSetupFormValues } from '@/features/shift/schemas';
import { submitPayCycleSetup } from '@/features/shift/services/shift.server';
import { PayCycleSettings } from '@/features/shift/types';
import { ApiResponse } from '@/lib/api/api-types';
import { appendSetCookieHeaders } from '@/lib/auth/cookie-headers';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = (await request.json()) as PayCycleSetupFormValues;
    } catch {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        errors: ['Invalid JSON request body.'],
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { serverResult, cookieHeaders } = await submitPayCycleSetup(body as PayCycleSetupFormValues);
    if (!serverResult.ok) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        errors: serverResult.errors,
      };
      return NextResponse.json(response, { status: serverResult.status || 400 });
    }

    // sucessful submission, return the pay cycle settings
    const response: ApiResponse<PayCycleSettings> = {
      success: true,
      data: serverResult.data,
      errors: [],
    };

    const nextResponse = NextResponse.json(response, { status: 200 });

    // Append Set-Cookie headers to the response
    appendSetCookieHeaders(nextResponse, cookieHeaders);

    return nextResponse;
  } catch (error) {
    console.error('Error in pay-cycle-setup route:', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      errors: ['Internal Server Error'],
    };
    return NextResponse.json(response, { status: 500 });
  }
}
