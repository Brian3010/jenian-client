'use client';

import RouteErrorFallback from '@/components/errors/RouteErrorFallback';
import './globals.css';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <RouteErrorFallback
          error={error}
          reset={reset}
          title="Something went wrong"
          description="The app could not load. Please try again."
        />
      </body>
    </html>
  );
}
