import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';
import { TelegramIntegrationStatus } from '../types';

export async function getTelegramIntegrationStatus(): Promise<ServerResult<TelegramIntegrationStatus>> {
  const { res } = await aspnetFetch('/api/Auth/get-me', {
    method: 'GET',
    cache: 'no-store',
  });

  return await parseAspnetApiResponse<TelegramIntegrationStatus>(res, 'Failed to fetch Telegram integration status');
}

export async function getTelegramToken<T>(): Promise<{
  serverResult: ServerResult<T>;
  cookieHeaders: string[];
}> {
  const { res, setCookieHeaders } = await aspnetFetch('/api/Telegram/link-token');
  const cookieHeaders = setCookieHeaders;

  return {
    serverResult: await parseAspnetApiResponse<T>(res, 'Failed to fetch Telegram link token'),
    cookieHeaders,
  };
}
