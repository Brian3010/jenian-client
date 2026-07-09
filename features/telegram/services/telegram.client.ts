import { parseClientApiResponse } from '@/lib/api/client-api';

export async function getTelegramToken() {
  // call api/private/telegram/link-token
  const res = await fetch('/api/private/telegram/link-token', {
    method: 'GET',
    cache: 'no-store',
  });

  return await parseClientApiResponse<{ linkToken: string }>(res, 'Failed to fetch Telegram link token');
}
