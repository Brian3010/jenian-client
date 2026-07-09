import { getErrorMessageFromResponse } from '@/lib/api/api-error';
import { parseClientApiResponse } from '@/lib/api/client-api';
import { AppError } from '@/lib/AppError';

//TODO: review this
export async function loginUser(userName: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
    credentials: 'include',
  });

  if (res.status === 401)
    throw new AppError({
      message: 'Invalid username or password',
      code: 'INVALID_CREDENTIALS',
      status: 401,
    });
  if (!res.ok) {
    const errorBody = await getErrorMessageFromResponse(res);
    throw new AppError({
      message: errorBody.join(', '),
      code: 'LOGIN_FAILED',
      status: res.status,
    });
  }
}

// call logout api in route.ts, which will call server function to clear session and cookies
export async function logoutUser() {
  const res = await fetch('/api/auth/logout', {
    method: 'DELETE',
    credentials: 'include',
  });

  await parseClientApiResponse<void>(res, 'Failed to logout user');
  localStorage.clear();
  sessionStorage.clear();
}
