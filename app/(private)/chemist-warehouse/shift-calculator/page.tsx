import ShiftCalculatorClient from '@/features/shift/components/ShiftCalculatorClient';
import ShiftCalculatorHeader from '@/features/shift/components/ShiftCalculatorHeader';
import { PayCycleResponse } from '@/features/shift/types';
import { getDefaultErrorMessage, parseJsonSafe } from '@/lib/utils';
import { headers } from 'next/headers';

export default async function ShiftCalculatorPage() {
  const headerStore = await headers();
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/private/shift/shift-calculator/current`, {
    cache: 'no-store',
    headers: {
      cookie: headerStore.get('cookie') ?? '',
    },
  });

  if (!res.ok) {
    const errorBody = await parseJsonSafe<{ message?: string; title?: string }>(res);
    console.log('🚀 ~ ShiftCalculatorPage ~ errorBody:', errorBody);
    const message = errorBody?.message || errorBody?.title || getDefaultErrorMessage(res.status);
    throw new Error(message);
  }

  const payCycle = await parseJsonSafe<PayCycleResponse>(res);

  if (!payCycle) {
    throw new Error('Server response is not valid JSON');
  }

  return (
    <>
      <ShiftCalculatorHeader />
      <div className="flex flex-col gap-5 p-2 py-5">
        <ShiftCalculatorClient initialSummary={payCycle} />
      </div>
    </>
  );
}
