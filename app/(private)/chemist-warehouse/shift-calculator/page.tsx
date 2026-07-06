import ShiftCalculatorData from '@/features/shift/components/ShiftCalculatorData';
import ShiftCalculatorHeader from '@/features/shift/components/ShiftCalculatorHeader';
import { Suspense } from 'react';
import Loading from './loading';

export default async function ShiftCalculatorPage() {
  return (
    <>
      <ShiftCalculatorHeader />
      <div className="flex flex-col gap-5 p-2 py-5 pb-30 md:pb-10">
        <Suspense fallback={<Loading />}>
          <ShiftCalculatorData />
        </Suspense>
      </div>
    </>
  );
}
