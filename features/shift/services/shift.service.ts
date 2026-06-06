import { PayCycleResponse } from '@/features/shift/types';
import { getDefaultErrorMessage, parseJsonSafe } from '@/lib/utils';

export async function getPayCycle(): Promise<PayCycleResponse> {
  const res = await fetch('/api/private/shift/shift-calculator/current', {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);

    const message = errorBody?.message || errorBody?.title || getDefaultErrorMessage(res.status);
    throw new Error(`${res.status} - ${message}`);
  }

  const data = await parseJsonSafe<PayCycleResponse>(res);

  if (!data) {
    throw new Error('server response is not valid JSON');
  }
  return data;
}
