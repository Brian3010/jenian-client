'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
type LoadingDemoSetupProps = {
  returnTo: string;
};

export default function LoadingDemoSetup({ returnTo }: LoadingDemoSetupProps) {
  const [demoSetupStatus, setDemoSetupStatus] = useState<'loading' | 'error'>('loading');
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const setupDemoAccount = async () => {
      try {
        const response = await fetch('/api/demo-account/setup', {
          method: 'POST',
          signal: controller.signal,
        });

        if (response.ok) {
          router.replace(returnTo);
          return;
        }

        setDemoSetupStatus('error');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Error setting up demo account:', error);
        setDemoSetupStatus('error');
      }
    };
    setupDemoAccount();

    return () => {
      controller.abort();
    };
  }, [returnTo, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex items-center text-2xl"></div>
      {demoSetupStatus === 'loading' && <div>Preparing demo account...</div>}
      {demoSetupStatus === 'error' && (
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
