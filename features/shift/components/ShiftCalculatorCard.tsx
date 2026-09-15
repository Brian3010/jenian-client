import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { getCurrentPayCycleSummary } from '@/features/shift/services/shift.server';
import { CurrentPayCycleSummary } from '@/features/shift/types';
import { formatDateDayMonth } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default async function ShiftCalculatorCard() {
  const currentPayCycleSummaryResult = await getCurrentPayCycleSummary();

  if (!currentPayCycleSummaryResult.ok) {
    return (
      <Card className="p-5 flex flex-col gap-3">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          </div>
          <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
        </CardHeader>
        <CardDescription className="flex flex-col gap-3 py-3 border-y">
          <div className="text-sm text-red-500">Failed to load pay summary, please try again later.</div>
        </CardDescription>
      </Card>
    );
  }

  if (!currentPayCycleSummaryResult.data.hasPayCycleSettings) {
    return <PayCycleRequiredState />;
  }

  return <HasPayCycleState payDetailData={currentPayCycleSummaryResult.data} />;
}

type HasPayCycleStateProps = {
  payDetailData: Extract<CurrentPayCycleSummary, { hasPayCycleSettings: true }>;
};

function HasPayCycleState({
  payDetailData: { startDate, endDate, shiftCount, estimatedGrossPay },
}: HasPayCycleStateProps) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-gray-400" />
          <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
        </div>
        <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
      </CardHeader>
      <CardDescription className="flex flex-col gap-3 py-3 border-y">
        <DataTable
          rows={[
            {
              label: 'Current Cycle',
              value: `${formatDateDayMonth(startDate)} - ${formatDateDayMonth(endDate)}`,
            },
            {
              label: 'Shifts Worked',
              value: shiftCount.toString(),
            },
            {
              label: 'Estimated Pay',
              value: `$${estimatedGrossPay.toFixed(2)}`,
            },
          ]}
        />
      </CardDescription>
      <CardAction className="w-full">
        <Button className="w-full" variant="primary">
          <Link href={'/chemist-warehouse/shift-calculator'}>
            <span className="font-semibold">Open Shift Calculator</span>
          </Link>
        </Button>
      </CardAction>
    </Card>
  );
}

function DataTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-y-2" data-slot="data-table">
      {rows.map((row, index) => (
        <div key={index} className="flex items-center justify-between">
          <dt className="text-sm text-gray-400">{row.label}</dt>
          <dd className="text-sm text-gray-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function PayCycleRequiredState() {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <CardHeader className="grid-rows-none p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-warning text-warning-text">
            Setup Required
          </span>
        </div>
        <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
      </CardHeader>

      <CardAction className="w-full">
        <Button className="w-full" variant="primary" asChild>
          <Link href={'/chemist-warehouse/shift-calculator'}>
            <span className="font-semibold">Set up pay cycle</span>
          </Link>
        </Button>
      </CardAction>
    </Card>
  );
}
