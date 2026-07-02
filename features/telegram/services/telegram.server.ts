import { GetUserResponse } from '@/features/auth/types';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '@/lib/AppError';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';

export async function getTelegramIntegrationStatus(): Promise<{ isConnected: boolean }> {
  const { res } = await aspnetFetch('/api/Auth/get-me', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    const message = await getErrorMessageFromResponse(res);
    throw new AppError({
      message: message.join(', '),
      code: 'FETCH_USER_FAILED',
      status: res.status,
    });
  }

  const user = await parseJsonSafe<GetUserResponse>(res);

  if (!user) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }

  return { isConnected: user.isTelegramConnected };
}
