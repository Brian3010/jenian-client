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

    async function refresh() {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'same-origin',
        });

        if (!isMounted) return;

        if (res.ok) {
          router.replace(returnTo);
          return;
        }
      } catch {
        // Fall through to the sign-in redirect below.
      }

      if (isMounted) {
        router.replace('/sign-in?error=session-expired');
      }
    }

    refresh();

    return () => {
      isMounted = false;
    };
  }, [returnTo, router]);

  return <Loading />;
}
