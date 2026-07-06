import { AppError } from '@/lib/AppError';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
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
} from '../types';

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

/**
 * Calls /api/CWH/shift-calculator/current
 * @returns {ServerResult<PayCycleSettings | null>} The user's pay cycle settings
 */
async function getUserCurrentPayCycleSettings(): Promise<ServerResult<PayCycleSettings>> {
  try {
    const { res } = await aspnetFetch('/api/CWH/shift-calculator/current');

    return await parseAspnetApiResponse<PayCycleSettings>(res, 'Failed to fetch current pay cycle settings');
  } catch (error) {
    console.error('Failed to fetch current pay cycle settings', error);
    return {
      ok: false,
      message: 'Failed to fetch current pay cycle settings',
      errors: ['Unexpected server function error.'],
      status: 500,
    };
  }
}

/**
 * Calls /api/CWH/shifts/by-cycle-date?userPayCyle=@param {PayCycleType}
 * @returns {ServerResult<ShiftSummaryResult>} user's shift summary for the given pay cycle
 */
async function getUserShiftSummaryByPayCycle(payCycle: PayCycleType): Promise<ServerResult<ShiftSummaryResult>> {
  try {
    const { res } = await aspnetFetch(`/api/CWH/shifts/by-cycle-date?userPayCyle=${payCycle}`);
    return await parseAspnetApiResponse<ShiftSummaryResult>(res, 'Failed to fetch user shift summary by pay cycle');
  } catch (error) {
    console.error('Failed to fetch user shift summary by pay cycle', error);
    return {
      ok: false,
      message: 'Failed to fetch user shift summary by pay cycle',
      errors: ['Unexpected server function error.'],
      status: 500,
    };
  }
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

  const payCycleSettingsData = payCycleSettingsResult.data;

  if (!payCycleSettingsData.hasPayCycleSettings || !hasPayCycleSettings(payCycleSettingsData)) {
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
