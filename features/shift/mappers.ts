import { convertUtcIsoToLocalDateAndTime } from '@/lib/utils';
import { ShiftFormValues } from './schemas';
import { UserShift } from './types';

export function userShiftsToFormValues(shifts: UserShift[]): ShiftFormValues[] {
  return shifts.map(shift => {
    const start = convertUtcIsoToLocalDateAndTime(shift.startAt, shift.timeZoneId);
    const end = convertUtcIsoToLocalDateAndTime(shift.endAt, shift.timeZoneId);

    return {
      id: shift.id,
      workDate: start.date,
      startTime: start.time,
      endTime: end.time,
      unpaidBreak: shift.unpaidBreakMinutes,
      paidBreak: shift.paidBreakMinutes,
      entryType: shift.entryType,
      employmentType: shift.employmentType,
    };
  });
}
