import { GetUserResponse } from '@/features/auth/types';
import ShiftCalculatorCard from '@/features/shift/components/ShiftCalculatorCard';
import TelegramIntegrationCard from '@/features/telegram/components/TelegramIntegrationCard';
import { default as DateWeatherDisplay } from '@/features/weather/components/DateWeatherDisplay';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '@/lib/AppError';
import { headers } from 'next/headers';

export default async function Dashboard() {
  const headerStore = await headers();
  // console.log('🚀 ~ Dashboard ~ headerStore:', headerStore);

  //TODO: fetch User info and pass to the cards that need it, instead of fetching user info in each card component. This way we can avoid multiple calls to /api/auth/me and also have the user info available in the dashboard for any future cards that might need it.
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      cookie: headerStore.get('cookie') ?? '',
    },
  });

  if (!res.ok) {
    const message = await getErrorMessageFromResponse(res);
    throw new AppError({
      message,
      code: 'FETCH_USER_FAILED',
      status: res.status,
    });
  }

  const user = await parseJsonSafe<GetUserResponse>(res);

  return (
    <div className="w-full p-3">
      <DateWeatherDisplay />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TelegramIntegrationCard user={user} />
        <ShiftCalculatorCard />
      </div>
    </div>
  );
}
