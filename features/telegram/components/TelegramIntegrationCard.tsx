'use client';

import TelegramTokenGenerateButton from '@/features/telegram/components/TelegramTokenGenerateButton';
import { GradientButton } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card';
import useIsUserConnected from '@/features/telegram/hooks/useIsUserConnected';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TelegramIntegrationCardSkeleton } from './TelegramIntegrationCardSkeleton';

export default function TelegramIntegrationCard() {
  const router = useRouter();
  const { isUserConnected, isLoading } = useIsUserConnected();

  if (isLoading) return <TelegramIntegrationCardSkeleton />;

  return (
    <Card className="p-5 gap-0 ">
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
        {isUserConnected ? 'Create and send today’s report' : 'Connect Telegram to enable report generation'}
      </CardDescription>

      {!isUserConnected && <p className="text-sm text-red-500">Telegram is required before generating reports</p>}

      <CardAction className="pt-4 w-full">
        {isUserConnected ? (
          <GradientButton
            onClick={() => {
              router.push('/chemist-warehouse/create-report');
            }}
          >
            <span className="font-semibold">Generate Report</span>
          </GradientButton>
        ) : (
          <TelegramTokenGenerateButton />
        )}
      </CardAction>
    </Card>
  );
}
