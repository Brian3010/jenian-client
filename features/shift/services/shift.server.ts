import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';
import { PayCycleSetupFormValues } from '../schemas';
import {
  CurrentPayCycleData,
  CurrentPayCycleSummary,
  PayCycleSettings,
  ShiftSummaryResult,
  UserShift,
} from '../types';

export async function getCurrentPayCycle(): Promise<ServerResult<CurrentPayCycleData>> {
  const { res } = await aspnetFetch('/api/cwh/shifts/current-pay-cycle');
  return await parseAspnetApiResponse<CurrentPayCycleData>(res, 'Failed to fetch current pay cycle');
}

export async function getCurrentPayCycleSummary(): Promise<ServerResult<CurrentPayCycleSummary>> {
  const { res } = await aspnetFetch('/api/cwh/shifts/current-pay-cycle/summary');
  return await parseAspnetApiResponse<CurrentPayCycleSummary>(res, 'Failed to fetch current pay cycle summary');
}

// Submit shifts to the backend
export async function submitShifts(
  cycleStartDate: string,
  cycleEndDate: string,
  shifts: UserShift[],
  deletedShiftIds: string[],
): Promise<{
  serverResult: ServerResult<ShiftSummaryResult>;
  cookieHeaders: string[];
}> {
  const { res, setCookieHeaders } = await aspnetFetch(
    `/shifts/bulks?cycleStartDate=${cycleStartDate}&cycleEndDate=${cycleEndDate}`,
    {
      method: 'PUT',
      body: JSON.stringify({ shifts, deletedShiftIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return {
    serverResult: await parseAspnetApiResponse<ShiftSummaryResult>(res, 'Failed to submit shifts'),
    cookieHeaders: setCookieHeaders,
  };
}

export async function submitPayCycleSetup(data: PayCycleSetupFormValues): Promise<{
  serverResult: ServerResult<PayCycleSettings>;
  cookieHeaders: string[];
}> {
  const { res, setCookieHeaders } = await aspnetFetch('/api/CWH/pay-cycle-settings/update', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    serverResult: await parseAspnetApiResponse<PayCycleSettings>(res, 'Failed to submit pay cycle setup'),
    cookieHeaders: setCookieHeaders,
  };
}
