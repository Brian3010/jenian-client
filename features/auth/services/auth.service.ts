import { LoginResponse, User } from '@/features/auth/types';
import { getDefaultErrorMessage, parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '@/lib/AppError';

export async function loginUser(userName: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
    credentials: 'include',
  });

  if (res.status == 401) throw new Error('Invalid username or password');
  if (!res.ok) throw new Error('Something went wrong');

  const data = (await res.json()) as LoginResponse;
  console.log('🚀 ~ login ~ data:', data);

  return data as LoginResponse;
}

//TODO:  review this
export async function logoutUser() {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      console.error('Logout failed with status:', res.status);
      throw new Error('Logout failed');
    } else {
      console.log('Logout successful');
    }
  } catch (error) {
    console.error('An error occurred during logout:', error);
    throw error;
  }
}

export async function GetUser(): Promise<User> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorbody = await res.json().catch(() => null);
    const message = errorbody?.message || errorbody?.title || getDefaultErrorMessage(res.status);
    throw new AppError({
      message,
      code: 'GET_USER_FAILED',
      status: res.status,
    });
  }
  const data = await parseJsonSafe<User>(res);

  if (!data) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }

  return data;
}
