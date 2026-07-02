import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import TelegramTokenGenerateButton from '@/features/telegram/components/TelegramTokenGenerateButton';
import { getTelegramIntegrationStatus } from '@/features/telegram/services/telegram.server';
import Link from 'next/link';

export default async function TelegramIntegrationCard() {
  let isConnected: boolean | null = null;

  try {
    const status = await getTelegramIntegrationStatus();
    isConnected = status.isConnected;
  } catch (error) {
    console.error('Failed to load Telegram integration status:', error);
  }

  if (isConnected === null) return <TelegramIntegrationCardUnavailable />;

  return <TelegramIntegrationCardContent isConnected={isConnected} />;
}

function TelegramIntegrationCardContent({ isConnected }: { isConnected: boolean }) {
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="grid-rows-none p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">End-of-Day Report</h1>
          <div
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isConnected ? 'Connected' : 'Not connected'}
          </div>
        </div>
      </CardHeader>

      <CardDescription>
        {isConnected ? "Create and send today's report" : 'Connect Telegram to enable report generation'}
      </CardDescription>

      {!isConnected && <p className="text-sm text-red-500">Telegram is required before generating reports</p>}

      <CardAction className="flex-1 w-full flex items-end">
        {isConnected ? (
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

function TelegramIntegrationCardUnavailable() {
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="grid-rows-none p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">End-of-Day Report</h1>
          <div className="text-xs px-3 py-1 rounded-full font-medium bg-red-100 text-red-700">Unavailable</div>
        </div>
      </CardHeader>

      <CardDescription>Telegram status could not be loaded.</CardDescription>

      <p className="text-sm text-red-500">Please refresh the page or try again later.</p>
    </Card>
  );
}
