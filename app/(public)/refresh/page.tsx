import { getSafeReturnTo } from '@/lib/utils';
import RefreshClientLoading from './RefreshClientLoading';

type RefreshPageProps = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function RefreshPage({ searchParams }: RefreshPageProps) {
  const { returnTo } = await searchParams;

  return <RefreshClientLoading returnTo={getSafeReturnTo('/dashboard', returnTo)} />;
}
