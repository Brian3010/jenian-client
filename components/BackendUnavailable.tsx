'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

type BackendUnavailableProps = {
  onRetry: () => void;
};

export function BackendUnavailable({ onRetry }: BackendUnavailableProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-slate-50 px-5"
      role="alert"
      aria-live="assertive"
    >
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
          onClick={onRetry}
          className="mt-6 w-full bg-slate-700 font-semibold text-white hover:bg-slate-800"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </div>
    </div>
  );
}
