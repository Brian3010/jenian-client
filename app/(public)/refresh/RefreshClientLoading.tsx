'use client';
import Loading from '@/components/ui/loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type RefreshClientLoadingProps = {
  returnTo: string;
};

export default function RefreshClientLoading({ returnTo }: RefreshClientLoadingProps) {
  const router = useRouter();

  useEffect(() => {
    // Prevent a late refresh response from navigating after this loading page unmounts.
    let isMounted = true;
    const controller = new AbortController();

    async function refresh() {
      try {
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
  }, [returnTo, router]);

  return <Loading />;
}
