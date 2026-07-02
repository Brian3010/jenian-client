import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { AppError } from '@/lib/AppError';
import { formatDateDayMonth } from '@/lib/utils';
import Link from 'next/link';
import { getCurrentPayCycleSettings } from '../services/shift.server';
import { PayCycleSettings } from '../types';

async function getShiftCalculatorCardData() {
  try {
    const { payDetail } = await getCurrentPayCycleSettings();
    return { success: true as const, payDetail };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      console.error('Failed to load shift calculator card data:', error.message);
      return { success: false as const, error: 'Failed to load pay summary, please try again later' };
    }
    console.error('Unexpected error occurred when getting shift calculator card data:', error);
    return { success: false as const, error: 'Unexpected error occurred when getting shift calculator card data' };
  }
}

export default async function ShiftCalculatorCard() {
  const result = await getShiftCalculatorCardData();

  // some errors occured
  if (!result.success) {
    return (
      <Card className="p-5 flex flex-col gap-3">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          </div>
          <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
        </CardHeader>
        <CardDescription className="flex flex-col gap-3 py-3 border-y">
          <div className="text-sm text-red-500">{result.error}</div>
        </CardDescription>
      </Card>
    );
  }

  if (!hasCompletePayCycleSettings(result.payDetail)) {
    return <PayCycleRequiredState />;
  }

  return <HasPayCycleState payDetailData={result.payDetail} />;
}

// Type guard to check if payDetail has complete pay cycle settings
function hasCompletePayCycleSettings(payDetail: PayCycleSettings): payDetail is PayCycleSettings & {
  hasPayCycleSettings: true;
  payCycleStartDate: string;
  payCycleEndDate: string;
  shiftCountInCycle: number;
  estimatedGrossPay: number;
} {
  return (
    payDetail.hasPayCycleSettings &&
    payDetail.payCycleStartDate !== null &&
    payDetail.payCycleEndDate !== null &&
    payDetail.shiftCountInCycle !== null &&
    payDetail.estimatedGrossPay !== null
  );
}

type HasPayCycleStateProps = {
  payDetailData: PayCycleSettings & {
    hasPayCycleSettings: true;
    payCycleStartDate: string;
    payCycleEndDate: string;
    shiftCountInCycle: number;
    estimatedGrossPay: number;
  };
};

function HasPayCycleState({
  payDetailData: { payCycleStartDate, payCycleEndDate, shiftCountInCycle, estimatedGrossPay },
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
