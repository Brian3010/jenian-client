import { userShiftsToFormValues } from '@/features/shift/mappers';
import { AppError } from '@/lib/AppError';
import { getCurrentPayCycle } from '../services/shift.server';
import PayCycleSetupForm from './PayCycleSetupForm';
import ShiftCalculatorClient from './ShiftCalculatorClient';

export default async function ShiftCalculatorData() {
  const result = await getCurrentPayCycle();

  if (!result.ok) {
    console.error('Failed to fetch current pay cycle', { message: result.message }, { errors: result.errors });
    throw new AppError({
      message: result.message || 'Failed to fetch current pay cycle',
      code: 'FETCH_SHIFT_SUMMARY_FAILED',
      status: result.status || 500,
    });
  }

  const currentPayCycle = result.data;

  if (!currentPayCycle.hasPayCycleSettings) {
    return <PayCycleSetupForm />;
  }

  return (
    <ShiftCalculatorClient
      initialUserShifts={userShiftsToFormValues(currentPayCycle.shifts)}
      initialDailySummaries={currentPayCycle.dailySummaries}
      cycleStartDate={currentPayCycle.startDate}
      cycleEndDate={currentPayCycle.endDate}
      timeZoneId={
        currentPayCycle.shifts.length > 0 ? currentPayCycle.shifts[0].timeZoneId : 'Australia/Melbourne'
      }
    />
  );
}
