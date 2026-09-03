'use client';

import { wakeBackend } from '@/lib/backend-health.client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BackendUnavailable } from './BackendUnavailable';
import { BackendWakeLoading } from './BackendWakeLoading';

type BackendHealthWakeGateProps = {
  children: React.ReactNode;
};

export function BackendHealthWakeGate({ children }: BackendHealthWakeGateProps) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const router = useRouter();

  const checkBackend = useCallback(async () => {
    try {
      await wakeBackend();
      setStatus('ready');
      router.refresh();
    } catch {
      setStatus('unavailable');
    }
  }, [router]);

  function retryWakeBackend() {
    setStatus('checking');
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

  if (status === 'ready') {
    return <>{children}</>;
  }

  if (status === 'unavailable') {
    return <BackendUnavailable onRetry={retryWakeBackend} />;
  }

  return <BackendWakeLoading />;
}
