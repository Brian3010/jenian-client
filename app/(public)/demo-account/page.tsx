import { getSafeReturnTo } from '@/lib/utils';
import LoadingDemoSetup from './LoadingDemoSetup';

type DemoAccountPageProps = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};
export default async function DemoAccountPage({ searchParams }: DemoAccountPageProps) {
  const { returnTo } = await searchParams;
  return <LoadingDemoSetup returnTo={getSafeReturnTo('/dashboard', returnTo)} />;
}
