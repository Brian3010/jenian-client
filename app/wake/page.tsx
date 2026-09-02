import { BackendHealthWakeGate } from '@/components/BackendHealthWakeGate';
import { getSafeWakeReturnTo } from '@/lib/backend-health';

type WakePageProps = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function WakePage({ searchParams }: WakePageProps) {
  const { returnTo } = await searchParams;
  const readyPath = getSafeWakeReturnTo('/dashboard', returnTo);

  return <BackendHealthWakeGate readyPath={readyPath} />;
}
