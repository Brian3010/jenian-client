'use client';

import { AlertTriangle, LoaderCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';

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

type BackendHealthWakeGateProps = {
  children: React.ReactNode;
};

export function BackendHealthWakeGate({ children }: BackendHealthWakeGateProps) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const [loadingStep, setLoadingStep] = useState(0);

  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch('/api/health/wake', {
        method: 'POST',
        cache: 'no-store',
      });

      setStatus(res.ok ? 'ready' : 'unavailable');
    } catch {
      setStatus('unavailable');
    }
  }, []);

  function retryWakeBackend() {
    setStatus('checking');
    setLoadingStep(0);
    void checkBackend();
  }

  useEffect(() => {
    const wakeTimer = window.setTimeout(() => {
      void checkBackend();
    }, 0);

    return () => {
      window.clearTimeout(wakeTimer);
    };
  }, [checkBackend]);

  useEffect(() => {
    if (status !== 'checking') return;

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
  }, [status]);

  if (status === 'ready') {
    return <>{children}</>;
  }

  if (status === 'unavailable') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-5" role="alert" aria-live="assertive">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
              <AlertTriangle className="size-5 text-amber-600" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Connection issue</p>

              <h1 className="mt-1 text-base font-semibold text-slate-900">Jenian could not connect</h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The service may still be starting. Please try again shortly.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={retryWakeBackend}
            className="mt-6 w-full bg-slate-700 font-semibold text-white hover:bg-slate-800"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const loadingMessage = loadingMessages[loadingStep];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-5">
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
