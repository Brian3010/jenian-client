import { logout } from '@/features/auth/services/auth.server';
import { clearAuthCookies } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const response = new NextResponse(null, { status: 204 });

  try {
    const serverResult = await logout();

    if (!serverResult.ok) {
      console.error('Backend logout failed:', {
        status: serverResult.status,
        errors: serverResult.errors,
      });
    }
  } catch (error) {
    console.error('Backend logout threw an error:', error);
  }

  await clearAuthCookies(response);
  return response;
}
