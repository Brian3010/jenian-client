import { Skeleton } from '@/components/ui/skeleton';
import ShiftCalculatorData from '@/features/shift/components/ShiftCalculatorData';
import ShiftCalculatorHeader from '@/features/shift/components/ShiftCalculatorHeader';
import { requireSession } from '@/lib/auth/session';
import { Suspense } from 'react';

export default async function ShiftCalculatorPage() {
  await requireSession('/chemist-warehouse/shift-calculator');
  return (
    <>
      <ShiftCalculatorHeader />
      <div className="flex flex-col gap-5 p-2 py-5 pb-30 md:pb-10">
        <Suspense fallback={<ShiftCalculatorFallback />}>
          <ShiftCalculatorData />
        </Suspense>
      </div>
    </>
  );
}

function ShiftCalculatorFallback() {
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-5 w-full max-w-md" />
          <Skeleton className="mt-3 h-7 w-36 rounded-lg" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <ShiftCardSkeleton />
          <ShiftCardSkeleton />
        </div>

        <div className="w-full shrink-0 lg:w-2xs">
          <Skeleton className="h-5 w-44" />
        </div>
      </div>
      <div className="h-20" />
    </>
  );
}

function SummaryCardSkeleton() {
  return (
    <div className="flex-1 basis-0 rounded-xl border bg-white p-4">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-2 h-7 w-28" />
      <Skeleton className="mt-2 h-4 w-40" />
    </div>
  );
}

function ShiftCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white px-4 py-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-12 rounded" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-4 w-7" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>

      <Skeleton className="mb-2 h-5 w-32" />

      <div className="mb-3 flex gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="h-4 w-44" />
    </div>
  );
}
