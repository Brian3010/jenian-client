'use client';

import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const WAKE_SCREEN_DELAY_MS = 250;

const loadingMessages = [
  {
    title: 'Starting Jenian...',
    description: 'To keep running costs low, Jenian rests when not in use. We are getting it ready now.',
  },
  {
    title: 'Almost ready...',
    description: 'Jenian is preparing your workspace.',
  },
  {
    title: 'Finishing up...',
    description: 'Everything should be ready shortly.',
  },
];

type BackendWakeLoadingProps = {
  delayMs?: number;
};

export function BackendWakeLoading({ delayMs = WAKE_SCREEN_DELAY_MS }: BackendWakeLoadingProps) {
  const [isVisible, setIsVisible] = useState(delayMs === 0);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (delayMs === 0) return;

    const visibilityTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(visibilityTimer);
    };
  }, [delayMs]);

  useEffect(() => {
    const almostThereTimer = window.setTimeout(() => {
      setLoadingStep(1);
    }, 12_000);

    const finishingUpTimer = window.setTimeout(() => {
      setLoadingStep(2);
    }, 28_000);

    return () => {
      window.clearTimeout(almostThereTimer);
      window.clearTimeout(finishingUpTimer);
    };
  }, []);

  if (!isVisible) return null;

  const loadingMessage = loadingMessages[loadingStep];

  return (
    <div className="fixed inset-0 z-200 flex min-h-dvh items-center justify-center bg-slate-50 px-5">
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <Image src="/icon.png" alt="" width={36} height={36} priority className="rounded-lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-900">{loadingMessage.title}</h1>
              <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin text-slate-500" />
            </div>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">{loadingMessage.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
