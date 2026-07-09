import { DashboardCardSkeleton } from '@/components/DashboardCardSkeleton';
import ShiftCalculatorCard from '@/features/shift/components/ShiftCalculatorCard';
import TelegramIntegrationCard from '@/features/telegram/components/TelegramIntegrationCard';
import { default as DateWeatherDisplay, DateWeatherSkeleton } from '@/features/weather/components/DateWeatherDisplay';
import { requireSession } from '@/lib/auth/session';
import { Suspense } from 'react';

export default async function DashboardPage() {
  await requireSession('/dashboard');

  return (
    <div className="w-full p-3">
      <Suspense fallback={<DateWeatherSkeleton />}>
        <DateWeatherDisplay />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={<DashboardCardSkeleton />}>
          <TelegramIntegrationCard />
        </Suspense>

        <Suspense fallback={<DashboardCardSkeleton />}>
          <ShiftCalculatorCard />
        </Suspense>
      </div>
    </div>
  );
}
