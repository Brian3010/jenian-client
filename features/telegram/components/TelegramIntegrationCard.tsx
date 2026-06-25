import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { GetUserResponse } from '@/features/auth/types';
import TelegramTokenGenerateButton from '@/features/telegram/components/TelegramTokenGenerateButton';
import { getErrorMessageFromResponse, parseJsonSafe } from '@/lib/api/api-error';
import { AppError } from '@/lib/AppError';
import { aspnetFetch } from '@/lib/auth/aspnet';
import Link from 'next/link';

export default async function TelegramIntegrationCard() {
  // Check if user is connected to Telegram
  const { res } = await aspnetFetch(
    '/api/Auth/get-me',
    {
      method: 'GET',
      cache: 'no-store',
    },
    { retryOn401: false },
  );

  if (!res.ok) {
    const message = await getErrorMessageFromResponse(res);
    throw new AppError({
      message,
      code: 'FETCH_USER_FAILED',
      status: res.status,
    });
  }

  const user = await parseJsonSafe<GetUserResponse>(res);

  if (!user) {
    throw new AppError({
      message: 'Server response is not valid JSON',
      code: 'INVALID_JSON_RESPONSE',
      status: 500,
    });
  }

  const isUserConnected = user.isTelegramConnected;

  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="grid-rows-none p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">End-of-Day Report</h1>
          <div
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              isUserConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isUserConnected ? 'Connected' : 'Not connected'}
          </div>
        </div>
      </CardHeader>

      <CardDescription>
        {isUserConnected ? "Create and send today's report" : 'Connect Telegram to enable report generation'}
      </CardDescription>

      {!isUserConnected && <p className="text-sm text-red-500">Telegram is required before generating reports</p>}

      <CardAction className="flex-1 w-full flex items-end">
        {isUserConnected ? (
          <Link href="/chemist-warehouse/create-report" className="w-full">
            <Button className="w-full" variant="primary">
              <span className="font-semibold">Generate Report</span>
            </Button>
          </Link>
        ) : (
          <TelegramTokenGenerateButton />
        )}
      </CardAction>
    </Card>
  );
}
