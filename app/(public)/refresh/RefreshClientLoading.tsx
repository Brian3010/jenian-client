'use client';
import { BackendUnavailable } from '@/components/BackendUnavailable';
import { BackendWakeLoading } from '@/components/BackendWakeLoading';
import Loading from '@/components/ui/loading';
import { wakeBackend } from '@/lib/backend-health.client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type RefreshClientLoadingProps = {
  returnTo: string;
};

export default function RefreshClientLoading({ returnTo }: RefreshClientLoadingProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'waking' | 'refreshing' | 'unavailable'>('waking');
  const [wakeAttempt, setWakeAttempt] = useState(0);

  useEffect(() => {
    // Prevent a late refresh response from navigating after this loading page unmounts.
    let isMounted = true;
    const controller = new AbortController();

    async function refresh() {
      let backendIsReady = false;

      try {
        await wakeBackend(controller.signal);
        backendIsReady = true;

        if (!isMounted) return;
        setStatus('refreshing');

        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'same-origin',
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (res.ok) {
          router.replace(returnTo);
          return;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;

        if (isMounted && !backendIsReady) {
          setStatus('unavailable');
          return;
        }
      }

      if (isMounted) {
        router.replace('/auth/sign-in?error=session-expired');
      }
    }

    void refresh();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [returnTo, router, wakeAttempt]);

  if (status === 'waking') {
    return <BackendWakeLoading />;
  }

  if (status === 'unavailable') {
    return (
      <BackendUnavailable
        onRetry={() => {
          setStatus('waking');
          setWakeAttempt(current => current + 1);
        }}
      />
    );
  }

  return <Loading />;
}
