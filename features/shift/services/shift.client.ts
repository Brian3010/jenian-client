import { parseClientApiResponse } from '@/lib/api/client-api';
import { convertLocalDateAndTimeToUtcIso, convertUtcIsoToLocalDateAndTime } from '@/lib/utils';
import { PayCycleSetupFormValues, ShiftFormValues } from '../schemas';
import { PayCycleSettings, ShiftSummaryResult, UserShift } from '../types';

export async function handleShiftClient(
  cycleStartDate: string,
  cycleEndDate: string,
  shiftFormValues: ShiftFormValues[],
  deletedShiftIds: string[],
): Promise<ShiftSummaryResult<ShiftFormValues>> {
  // Formatting shiftfromvalues to usershift before sending to route handler
  const userShifts: UserShift[] = shiftFormValuesToUserShift(shiftFormValues);

  const res = await fetch('/api/private/shift/bulks', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shifts: userShifts, deletedShiftIds, cycleStartDate, cycleEndDate }),
  });

  const shiftSummary = await parseClientApiResponse<ShiftSummaryResult>(res, 'Failed to submit shifts');

  return {
    shifts: userShiftToShiftFormValues(shiftSummary.shifts),
    dailySummaries: shiftSummary.dailySummaries,
  };
}
// prepare the shift data to be sent to the backend by converting ShiftFormValues to UserShift
function shiftFormValuesToUserShift(shifts: ShiftFormValues[]): UserShift[] {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return shifts.map(s => {
    return {
      id: s.id?.includes('draft-') ? undefined : s.id, // if the shift is new, don't send the id to backend
      startAt: convertLocalDateAndTimeToUtcIso(s.workDate, s.startTime, userTimeZone),
      endAt: convertLocalDateAndTimeToUtcIso(s.workDate, s.endTime, userTimeZone),
      unpaidBreakMinutes: s.unpaidBreak,
      paidBreakMinutes: s.paidBreak,
      entryType: s.entryType,
      employmentType: s.employmentType,
      timeZoneId: userTimeZone,
    };
  });
}

// prepare the shift data to be sent to the frontend by converting UserShift to ShiftFormValues
function userShiftToShiftFormValues(shifts: UserShift[]): ShiftFormValues[] {
  return shifts.map(s => {
    return {
      id: s.id,
      workDate: convertUtcIsoToLocalDateAndTime(s.startAt, s.timeZoneId).date,
      startTime: convertUtcIsoToLocalDateAndTime(s.startAt, s.timeZoneId).time,
      endTime: convertUtcIsoToLocalDateAndTime(s.endAt, s.timeZoneId).time,
      unpaidBreak: s.unpaidBreakMinutes,
      paidBreak: s.paidBreakMinutes,
      entryType: s.entryType,
      employmentType: s.employmentType,
    };
  });
}

export async function handleSubmitPayCycleSetup(data: PayCycleSetupFormValues): Promise<boolean> {
  const res = await fetch('/api/private/shift/pay-cycle-setup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const payCycleSettings = await parseClientApiResponse<PayCycleSettings>(res, 'Failed to submit pay cycle setup');

  return payCycleSettings.hasPayCycleSettings;
}
