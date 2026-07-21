import { ShiftFormValues } from '@/features/shift/schemas';
import { HasPayCycleSettings, ShiftSummaryResult } from '@/features/shift/types';
import { AppError } from '@/lib/AppError';
import { convertUtcIsoToLocalDateAndTime, getHoursBetween } from '@/lib/utils';
import { getShiftCalculatorPageData } from '../services/shift.server';
import PayCycleSetupForm from './PayCycleSetupForm';
import ShiftCalculatorClient from './ShiftCalculatorClient';

export default async function ShiftCalculatorData() {
  // fetch data from server function
  const summary = await getShiftCalculatorPageData();

  // handle errors and redirect to pay cycle setup if needed
  if (summary.status === 'error') {
    console.error('Failed to fetch shift summary', { message: summary.message }, { errors: summary.errors });
    throw new AppError({
      message: summary.message || 'Failed to fetch shift summary',
      code: 'FETCH_SHIFT_SUMMARY_FAILED',
      status: summary.statusCode || 500,
    });
  }

  // redirect to pay cycle setup if the user needs to set up their pay cycle
  if (summary.status === 'needs_setup') {
    // redender a setup component here, redirect for now
    // redirect('/chemist-warehouse/shift-calculator/pay-cycle-setup');
    // TODO: setting up the pay cycle setup form
    return <PayCycleSetupForm />;
  }

  // summary.status === 'ready' at this point, so we can safely access summary.payCycleSettings and summary.shiftSummary
  return (
    <ShiftCalculatorClient
      initialSummaryBreakdown={calculateSummaryBreakdown(summary.payCycleSettings, summary.shiftSummary)}
      initialUserShifts={mapShiftToFormValues(summary.shiftSummary)}
      initialDailySummaries={summary.shiftSummary.dailySummaries}
      cycleStartDate={summary.payCycleSettings.payCycleStartDate!}
      cycleEndDate={summary.payCycleSettings.payCycleEndDate!}
      timeZoneId={
        summary.shiftSummary.shifts.length > 0 ? summary.shiftSummary.shifts[0].timeZoneId : 'Australia/Melbourne'
      }
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
const calculateSummaryBreakdown = (payCycle: HasPayCycleSettings, userShifts: ShiftSummaryResult): SummaryBreakdown => {
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

//TODO: Convert dates, times with timezone info from backend before passing to client, to avoid doing it multiple times in the client
const mapShiftToFormValues = (shift: ShiftSummaryResult): ShiftFormValues[] => {
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
