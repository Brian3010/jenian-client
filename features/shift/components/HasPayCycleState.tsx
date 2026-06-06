import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { formatDayMonth } from '@/lib/utils';
import Link from 'next/link';
import DataTable from './DataTable';

type HasPayCycleStateProps = {
  payCycleData: {
    payCycleStartDate: string;
    payCycleEndDate: string;
    shiftCountInCycle: number;
    estimatedGrossPay: number;
  };
};

export default function HasPayCycleState({
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
              value: `${formatDayMonth(payCycleStartDate)} - ${formatDayMonth(payCycleEndDate)}`,
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
