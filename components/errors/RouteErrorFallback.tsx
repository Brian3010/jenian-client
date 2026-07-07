'use client';

import { useEffect } from 'react';

type RouteErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
};

export default function RouteErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  description = 'The page could not load. Please try again.',
  showBackButton = false,
}: RouteErrorFallbackProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <section aria-live="polite" className="w-full max-w-md rounded-2xl border bg-card p-4 py-2 shadow-sm sm:p-6">
        <div className="space-y-5">
          <div className="py-2 text-center">
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>

          {error.digest && (
            <div className="rounded-xl border bg-muted p-3">
              <p className="text-[13px] font-medium">Error reference</p>
              <p className="mt-1 break-all text-[13px] text-muted-foreground">{error.digest}</p>
            </div>
          )}

          <div className="flex justify-between gap-4 pt-2">
            {showBackButton && (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border bg-card px-4 text-sm font-medium transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Go back
              </button>
            )}

            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
