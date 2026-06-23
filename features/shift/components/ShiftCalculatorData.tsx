import { ShiftFormValues } from '@/features/shift/schemas';
import { PayCycleResponse, UserShiftsResponse } from '@/features/shift/types';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '@/lib/AppError';
import { convertUtcIsoToLocalDateAndTime, getHoursBetween } from '@/lib/utils';
import { headers } from 'next/headers';
import ShiftCalculatorClient from './ShiftCalculatorClient';

export default async function ShiftCalculatorData() {
  const headerStore = await headers();
  const payCycleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/private/shift/shift-calculator/current`,
    {
      cache: 'no-store',
      headers: {
        cookie: headerStore.get('cookie') ?? '',
      },
    },
  );

  if (!payCycleResponse.ok) {
    const message = await getErrorMessageFromResponse(payCycleResponse);
    throw new AppError({
      message,
      code: 'FETCH_PAY_CYCLE_FAILED',
      status: payCycleResponse.status,
    });
  }

  const payCycle = await parseJsonSafe<PayCycleResponse>(payCycleResponse);

  if (!payCycle) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }

  //TODO: Can redirect to pay-cycle setup page
  if (!payCycle.hasPayCycleSettings) {
    throw new AppError({
      message: 'Pay cycle settings are not configured. Please set up your pay cycle to use the shift calculator.',
      code: 'PAY_CYCLE_SETTINGS_NOT_CONFIGURED',
      status: 400,
    });
  }

  // fetch user shifts for the pay cycle
  const userShiftsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/private/shift/shifts/by-cycle-date?${payCycle.payCycle}`,
    {
      cache: 'no-store',
      headers: {
        cookie: headerStore.get('cookie') ?? '',
      },
    },
  );
  if (!userShiftsResponse.ok) {
    const message = await getErrorMessageFromResponse(userShiftsResponse);
    throw new AppError({
      message,
      code: 'FETCH_USER_SHIFTS_FAILED',
      status: userShiftsResponse.status,
    });
  }
  const userShifts = await parseJsonSafe<UserShiftsResponse>(userShiftsResponse);
  if (!userShifts) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }

  //TODO: Convert dates, times with timezone info from backend before passing to client, to avoid doing it multiple times in the client
  const mapShiftToFormValues = (shift: UserShiftsResponse): ShiftFormValues[] => {
    const shiftForm: ShiftFormValues[] = shift.shifts.map(s => {
      return {
        id: s.id,
        workDate: convertUtcIsoToLocalDateAndTime(s.startAt, s.timeZoneId).date, //TODO: confirm if workDate should be based on startAt or endAt
        startTime: convertUtcIsoToLocalDateAndTime(s.startAt, s.timeZoneId).time,
        endTime: convertUtcIsoToLocalDateAndTime(s.endAt, s.timeZoneId).time,
        unpaidBreak: s.unpaidBreakMinutes,
        entryType: s.entryType,
        employmentType: s.employmentType,
        paidBreak: s.paidBreakMinutes,
      };
    });
    return shiftForm;
  };

  return (
    <ShiftCalculatorClient
      initialSummaryBreakdown={calculateSummaryBreakdown(payCycle, userShifts)}
      initialUserShifts={mapShiftToFormValues(userShifts)}
      cycleStartDate={payCycle.payCycleStartDate}
      cycleEndDate={payCycle.payCycleEndDate}
      timeZoneId={userShifts.shifts.length > 0 ? userShifts.shifts[0].timeZoneId : 'Australia/Melbourne'}
    />
  );
}

export type SummaryBreakdown = {
  estimatedGrossPay: number;
  shiftCountInCycle: number;
  scheduledTotalHours: number;
  startCycleDate: string;
  endCycleDate: string;
};
// calculate breakdown summary from paycyle and user shifts response
const calculateSummaryBreakdown = (payCycle: PayCycleResponse, userShifts: UserShiftsResponse): SummaryBreakdown => {
  return {
    estimatedGrossPay: payCycle.estimatedGrossPay,
    shiftCountInCycle: payCycle.shiftCountInCycle,
    scheduledTotalHours: userShifts.shifts.reduce(
      (total, shift) => total + getHoursBetween(shift.startAt, shift.endAt),
      0,
    ),
    startCycleDate: payCycle.payCycleStartDate,
    endCycleDate: payCycle.payCycleEndDate,
  };
};
