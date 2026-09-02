'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';

const loadingMessages = [
  {
    title: 'Getting Jenian ready',
    description: 'We’re preparing your workspace. This can take a moment.',
  },
  {
    title: 'Putting everything in place',
    description: 'Your shifts, reports, and tools are being set up.',
  },
  {
    title: 'Nearly there',
    description: 'Thanks for hanging tight—Jenian should be ready shortly.',
  },
];

type BackendHealthWakeGateProps = {
  children?: React.ReactNode;
  readyPath?: string;
};

export function BackendHealthWakeGate({ children, readyPath }: BackendHealthWakeGateProps) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();

  const checkBackend = useCallback(async () => {
    try {
      const res = await fetch('/api/health/wake', {
        method: 'POST',
        cache: 'no-store',
      });

      if (!res.ok) {
        setStatus('unavailable');
        return;
      }

      if (readyPath) {
        router.replace(readyPath);
        return;
      }

      setStatus('ready');
    } catch {
      setStatus('unavailable');
    }
  }, [readyPath, router]);

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
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 motion-safe:animate-pulse">
            <Image src="/icon.png" alt="" width={36} height={36} priority className="rounded-lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div
              key={loadingStep}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-500"
            >
              <div className="flex items-center gap-2.5">
                <h1 className="text-sm font-semibold text-slate-900">{loadingMessage.title}</h1>

                <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
                  <span className="size-1.5 rounded-full bg-slate-400 motion-safe:animate-bounce motion-safe:[animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-slate-400 motion-safe:animate-bounce motion-safe:[animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-slate-400 motion-safe:animate-bounce" />
                </span>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-slate-600">{loadingMessage.description}</p>
            </div>

            <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
              No need to refresh—we’ll continue automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
