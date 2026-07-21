import { registerSchema } from '@/features/auth/schemas';
import { registerUserServer } from '@/features/auth/services/auth.server';
import { ApiResponse } from '@/lib/api/api-types';
import { NextResponse } from 'next/server';

function registrationFailureStatus(status?: number) {
  if (status && status >= 400 && status <= 599) return status;
  if (status && status >= 200 && status <= 299) return 400;
  return 500;
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        errors: ['Invalid JSON request body.'],
      };
      return NextResponse.json(response, { status: 400 });
    }

    const parsedBody = registerSchema.safeParse(body);
    if (!parsedBody.success) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        errors: parsedBody.error.issues.map(issue => issue.message),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const result = await registerUserServer(parsedBody.data);

    if (!result.ok) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        errors: result.errors,
      };
      return NextResponse.json(response, { status: registrationFailureStatus(result.status) });
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: result.data,
      errors: [],
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in register route:', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      errors: ['Internal Server Error'],
    };
    return NextResponse.json(response, { status: 500 });
  }
}
