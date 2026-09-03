'use client';
import { BackendUnavailable } from '@/components/BackendUnavailable';
import { BackendWakeLoading } from '@/components/BackendWakeLoading';
import { Button } from '@/components/ui/button';
import { wakeBackend } from '@/lib/backend-health.client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
type LoadingDemoSetupProps = {
  returnTo: string;
};

export default function LoadingDemoSetup({ returnTo }: LoadingDemoSetupProps) {
  const [demoSetupStatus, setDemoSetupStatus] = useState<'waking' | 'setting-up' | 'wake-error' | 'setup-error'>(
    'waking',
  );
  const [wakeAttempt, setWakeAttempt] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const setupDemoAccount = async () => {
      let backendIsReady = false;

      try {
        await wakeBackend(controller.signal);
        backendIsReady = true;
        setDemoSetupStatus('setting-up');

        const response = await fetch('/api/demo-account/setup', {
          method: 'POST',
          signal: controller.signal,
        });

        if (response.ok) {
          router.replace(returnTo);
          return;
        }

        setDemoSetupStatus('setup-error');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error setting up demo account:', error);
        setDemoSetupStatus(backendIsReady ? 'setup-error' : 'wake-error');
      }
    };
    void setupDemoAccount();

    return () => {
      controller.abort();
    };
  }, [returnTo, router, wakeAttempt]);

  if (demoSetupStatus === 'waking') {
    return <BackendWakeLoading />;
  }

  if (demoSetupStatus === 'wake-error') {
    return (
      <BackendUnavailable
        onRetry={() => {
          setDemoSetupStatus('waking');
          setWakeAttempt(current => current + 1);
        }}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex items-center text-2xl"></div>
      {demoSetupStatus === 'setting-up' && <div>Preparing demo account...</div>}
      {demoSetupStatus === 'setup-error' && (
        <div className="flex flex-col items-center gap-4">
          <div>Demo setup failed.</div>
          <Button asChild>
            <Link href="/auth/sign-in">Back to sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
