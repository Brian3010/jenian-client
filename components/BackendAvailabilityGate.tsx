'use client';

import { checkBackend } from '@/lib/api/backend-health/backend-health.client';
import { useEffect, useState } from 'react';
import BackendUnavailableFallBack from './ui/BackendUnavailableFallBack';

type BackendStatus = 'checking' | 'available' | 'unavailable';

export function BackendAvailabilityGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    async function runCheck() {
      const isAvailable = await checkBackend();
      setStatus(isAvailable ? 'available' : 'unavailable');
    }

    runCheck();
  }, []);

  if (status === 'checking') {
    return null;
  }

  if (status === 'unavailable') {
    return <BackendUnavailableFallBack />;
  }

  return <>{children}</>;
}
