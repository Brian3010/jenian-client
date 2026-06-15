import { PayCycleResponse } from '@/features/shift/types';
import { getDefaultErrorMessage, parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '@/lib/AppError';

export async function getPayCycle(): Promise<PayCycleResponse> {
  const res = await fetch('/api/private/shift/shift-calculator/current', {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);

    const message = errorBody?.message || errorBody?.title || getDefaultErrorMessage(res.status);
    throw new AppError({
      message,
      code: 'GET_PAY_CYCLE_FAILED',
      status: res.status,
    });
  }

  const data = await parseJsonSafe<PayCycleResponse>(res);

  if (!data) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }
  return data;
}

// export async function getUserShiftsByPayCycle(p) {
//   const res = await fetch('/api/private/shift/shift-calculator/shifts', {
//     credentials: 'include',
//   });
