import { registerUserServer } from '@/features/auth/services/auth.server';
import { RegisterRequest } from '@/features/auth/types';
import { ApiResponse } from '@/lib/api/api-types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let body: RegisterRequest;

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

    const result = await registerUserServer(body);

    if (!result.ok) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        errors: result.errors,
      };
      return NextResponse.json(response, { status: result.status });
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: result.data,
      errors: [],
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Something went wrong in register route:', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      errors: ['Internal Server Error'],
    };
    return NextResponse.json(response, { status: 500 });
  }
}
