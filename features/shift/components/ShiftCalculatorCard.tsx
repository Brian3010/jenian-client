'use client';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { TelegramIntegrationCardSkeleton } from '@/features/telegram/components/TelegramIntegrationCardSkeleton';
import { formatDateDayMonth } from '@/lib/utils';
import Link from 'next/link';
import { usePayDetail } from '../context/PayDetailContext';

export default function ShiftCalculatorCard() {
  const { payDetail, error, loading } = usePayDetail();

  if (error) {
    return (
      <Card className="p-5 flex flex-col gap-3">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          </div>
          <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
        </CardHeader>
        <CardDescription className="flex flex-col gap-3 py-3 border-y">
          <div className="text-sm text-red-500">{error}</div>
        </CardDescription>
      </Card>
    );
  }

  if (loading) return <TelegramIntegrationCardSkeleton />;

  return payDetail && payDetail.hasPayCycleSettings ? (
    <HasPayCycleState payCycleData={payDetail} />
  ) : (
    <PayCycleRequiredState />
  );
}

type HasPayCycleStateProps = {
  payCycleData: {
    payCycleStartDate: string;
    payCycleEndDate: string;
    shiftCountInCycle: number;
    estimatedGrossPay: number;
  };
};

function HasPayCycleState({
  payCycleData: { payCycleStartDate, payCycleEndDate, shiftCountInCycle, estimatedGrossPay },
}: HasPayCycleStateProps) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
        </div>
        <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
      </CardHeader>
      <CardDescription className="flex flex-col gap-3 py-3 border-y">
        <DataTable
          rows={[
            {
              label: 'Current Cycle',
              value: `${formatDateDayMonth(payCycleStartDate)} - ${formatDateDayMonth(payCycleEndDate)}`,
            },
            {
              label: 'Shifts Worked',
              value: shiftCountInCycle.toString(),
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
        <Button className="w-full" variant="primary">
          <span className="font-semibold">Set up pay cycle</span>
        </Button>
      </CardAction>
    </Card>
  );
}
