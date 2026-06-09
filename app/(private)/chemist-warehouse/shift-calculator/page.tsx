import ShiftCalculatorClient from '@/features/shift/components/ShiftCalculatorClient';
import ShiftCalculatorHeader from '@/features/shift/components/ShiftCalculatorHeader';
import { PayCycleResponse, UserShiftsResponse } from '@/features/shift/types';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
import { getHoursBetween } from '@/lib/utils';
import { headers } from 'next/headers';

export default async function ShiftCalculatorPage() {
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
    throw new Error(message);
  }

  const payCycle = await parseJsonSafe<PayCycleResponse>(payCycleResponse);

  if (!payCycle) {
    throw new Error('Server response is not valid JSON');
  }

  if (!payCycle.hasPayCycleSettings) {
    throw new Error('Pay cycle settings are not configured. Please set up your pay cycle to use the shift calculator.');
  }

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
    throw new Error(message);
  }
  const userShifts = await parseJsonSafe<UserShiftsResponse>(userShiftsResponse);
  if (!userShifts) {
    throw new Error('Server response is not valid JSON');
  }
  console.log('🚀 ~ ShiftCalculatorPage ~ userShifts:', userShifts);

  return (
    <>
      <ShiftCalculatorHeader />
      <div className="flex flex-col gap-5 p-2 py-5">
        <ShiftCalculatorClient
          summaryBreakdown={{
            estimatedGrossPay: payCycle.estimatedGrossPay,
            shiftCountInCycle: payCycle.shiftCountInCycle,
            scheduledTotalHours: userShifts.shifts.reduce(
              (total, shift) => total + getHoursBetween(shift.startAt, shift.endAt),
              0,
            ),
          }}
          userShifts={userShifts}
        />
      </div>
    </>
  );
}
