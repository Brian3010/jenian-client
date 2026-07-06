import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';
import { TelegramIntegrationStatus } from '../types';

export async function getTelegramIntegrationStatus(): Promise<ServerResult<TelegramIntegrationStatus>> {
  try {
    const { res } = await aspnetFetch('/api/Auth/get-me', {
      method: 'GET',
      cache: 'no-store',
    });

    return await parseAspnetApiResponse<TelegramIntegrationStatus>(res, 'Failed to fetch Telegram integration status');
  } catch (error) {
    console.error('Failed to fetch Telegram integration status', error);
    return {
      ok: false,
      message: 'Failed to fetch Telegram integration status',
      errors: ['Unexpected server function error.'],
      status: 500,
    };
  }
}
