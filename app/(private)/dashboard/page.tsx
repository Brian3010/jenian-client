import { DashboardCardSkeleton } from '@/components/DashboardCardSkeleton';
import { Card, CardDescription } from '@/components/ui/card';
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
        <Card className="flex min-h-65 flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <svg
              className="h-6 w-6 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              Coming soon
            </span>

            <h1 className="mt-3 text-base font-semibold text-gray-900">Shift Calculator</h1>

            <CardDescription className="mt-2 max-w-sm">
              The Shift Calculator is currently in development.
            </CardDescription>
          </div>
        </Card>

        {/* <Suspense fallback={<DashboardCardSkeleton />}>
          <ShiftCalculatorCard />
        </Suspense> */}
      </div>
    </div>
  );
}
