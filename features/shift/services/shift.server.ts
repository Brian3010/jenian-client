import { AppError } from '@/lib/AppError';
import { ServerResult } from '@/lib/api/api-types';
import { parseAspnetApiResponse } from '@/lib/api/server-api';
import { aspnetFetch } from '@/lib/auth/aspnet';
import 'server-only';
import {
  HasPayCycleSettings,
  PayCycleSettings,
  PayCycleType,
  ShiftCalculatorPageData,
  ShiftSummaryResult,
  UserShift,
} from '../types';

/**
 * Calls /api/CWH/shift-calculator/current
 * @returns {ServerResult<PayCycleSettings | null>} The user's pay cycle settings
 */
export async function getUserCurrentPayCycleSettings(): Promise<ServerResult<PayCycleSettings>> {
  const { res } = await aspnetFetch('/api/CWH/shift-calculator/current');

  return await parseAspnetApiResponse<PayCycleSettings>(res, 'Failed to fetch current pay cycle settings');
}

/**
 * Calls /api/CWH/shifts/by-cycle-date?userPayCyle=@param {PayCycleType}
 * @returns {ServerResult<ShiftSummaryResult>} user's shift summary for the given pay cycle
 */
async function getUserShiftSummaryByPayCycle(payCycle: PayCycleType): Promise<ServerResult<ShiftSummaryResult>> {
  const { res } = await aspnetFetch(`/api/CWH/shifts/by-cycle-date?userPayCyle=${payCycle}`);
  return await parseAspnetApiResponse<ShiftSummaryResult>(res, 'Failed to fetch user shift summary by pay cycle');
}

export async function getShiftCalculatorPageData(): Promise<ShiftCalculatorPageData> {
  // get the user's current pay cycle settings
  const payCycleSettingsResult = await getUserCurrentPayCycleSettings();

  if (!payCycleSettingsResult.ok) {
    return {
      status: 'error',
      message: payCycleSettingsResult.message,
      errors: payCycleSettingsResult.errors,
      statusCode: payCycleSettingsResult.status,
    };
  }

  // check if the user has complete pay cycle settings - return 'needs_setup' if not
  const payCycleSettingsData = payCycleSettingsResult.data;

  if (!hasPayCycleSettings(payCycleSettingsData)) {
    return {
      status: 'needs_setup',
      payCycleSettings: payCycleSettingsData,
    };
  }

  // make sure paycycle exist to fetch the user's shift summary for the current pay cycle
  if (!payCycleSettingsData.payCycle) {
    throw new AppError({
      message: 'Pay cycle is missing in the pay cycle settings',
      code: 'MISSING_PAY_CYCLE',
      status: 500,
    });
  }

  // get the user's shift summary for the current pay cycle
  const shiftSummaryResult = await getUserShiftSummaryByPayCycle(payCycleSettingsData.payCycle);

  if (!shiftSummaryResult.ok) {
    return {
      status: 'error',
      message: shiftSummaryResult.message,
      errors: shiftSummaryResult.errors,
      statusCode: shiftSummaryResult.status,
    };
  }

  // return the pay cycle settings and shift summary data
  return {
    status: 'ready',
    payCycleSettings: payCycleSettingsData,
    shiftSummary: shiftSummaryResult.data,
  };
}

// Type guard to check if payCycleSettings has complete pay cycle settings
function hasPayCycleSettings(payCycleSettings: PayCycleSettings): payCycleSettings is HasPayCycleSettings {
  return (
    payCycleSettings.hasPayCycleSettings &&
    payCycleSettings.payCycle !== null &&
    payCycleSettings.payCycleStartDate !== null &&
    payCycleSettings.payCycleEndDate !== null &&
    payCycleSettings.shiftCountInCycle !== null &&
    payCycleSettings.estimatedGrossPay !== null
  );
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
