'use client';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { formatDayMonth } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPayCycle } from '../services/shift.service';
import { PayCycleResponse } from '../types';
import DataTable from './DataTable';
import DataTableSkeleton from './DataTableSkeleton';

export default function ShiftCalculatorCard() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [payCycleData, setPayCycleData] = useState<PayCycleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPayCycle();
        console.log('🚀 ~ ShiftCalculatorCard ~ res:', res);
        setPayCycleData(res);
      } catch (error) {
        console.error('Error fetching pay cycle:', error);
        setError('Failed to load shift data. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  return (
    <Card className="p-5 flex flex-col gap-3">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
        </div>
        <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
      </CardHeader>
      <CardDescription className="flex flex-col gap-3 py-3 border-y">
        {loading ? (
          <DataTableSkeleton />
        ) : (
          payCycleData !== null &&
          payCycleData.hasPayCycleSettings && (
            <DataTable
              rows={[
                {
                  label: 'Current Cycle',
                  value: `${formatDayMonth(payCycleData.payCycleStartDate)} - ${formatDayMonth(payCycleData.payCycleEndDate)}`,
                },
                {
                  label: 'Shifts Worked',
                  value: payCycleData.shiftCountInCycle ? payCycleData.shiftCountInCycle.toString() : '0',
                },
                {
                  label: 'Estimated Pay',
                  value: `$${payCycleData.estimatedGrossPay ? payCycleData.estimatedGrossPay.toFixed(2) : '0.00'}`,
                },
              ]}
            />
          )
        )}
      </CardDescription>
      <CardAction className="w-full">
        <Button
          className="w-full"
          variant="primary"
          onClick={() => {
            router.push('/chemist-warehouse/shift-calculator');
          }}
        >
          <span className="font-semibold">Open Shift Calculator</span>
        </Button>
      </CardAction>
    </Card>
  );
}
