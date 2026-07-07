'use client';

import RouteErrorFallback from '@/components/errors/RouteErrorFallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return <RouteErrorFallback error={error} reset={reset} />;
}
