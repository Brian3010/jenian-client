'use client';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/features/auth/context/AuthContext';
import TelegramTokenGenerateButton from '@/features/telegram/components/TelegramTokenGenerateButton';
import { useRouter } from 'next/navigation';
import { TelegramIntegrationCardSkeleton } from './TelegramIntegrationCardSkeleton';

export default function TelegramIntegrationCard() {
  const router = useRouter();
  // const { isUserConnected, isLoading } = useIsUserConnected();
  const { userInfo, loading } = useAuth();

  if (loading) return <TelegramIntegrationCardSkeleton />;

  if (!userInfo) return null;

  const isUserConnected = userInfo.isTelegramConnected;

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
          <Button
            className="w-full"
            variant="primary"
            onClick={() => {
              router.push('/chemist-warehouse/create-report');
            }}
          >
            <span className="font-semibold">Generate Report</span>
          </Button>
        ) : (
          <TelegramTokenGenerateButton />
        )}
      </CardAction>
    </Card>
  );
}
