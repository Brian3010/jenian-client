import { AppError } from '@/lib/AppError';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';
import { PayCycleSettings } from '../types';

export async function getCurrentPayCycleSettings(): Promise<{ payDetail: PayCycleSettings }> {
  const { res } = await aspnetFetch('/api/cwh/shift-calculator/current');

  if (!res.ok) {
    const errorMessage = await getErrorMessageFromResponse(res);
    throw new AppError({
      message: errorMessage.join(', '),
      code: 'FETCH_PAY_CYCLE_SETTINGS_FAILED',
      status: res.status,
    });
  }

  const payCycleSettings = await parseJsonSafe<{ data: PayCycleSettings }>(res);

  if (!payCycleSettings) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }

  return { payDetail: payCycleSettings.data };
}
