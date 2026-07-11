import RefreshClientLoading from './RefreshClientLoading';

type RefreshPageProps = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

function getSafeReturnTo(value?: string | string[]) {
  const returnTo = Array.isArray(value) ? value[0] : value;

  if (!returnTo || !returnTo.startsWith('/') || returnTo.startsWith('//') || returnTo.startsWith('/refresh')) {
    return '/dashboard';
  }

  return returnTo;
}

export default async function RefreshPage({ searchParams }: RefreshPageProps) {
  const { returnTo } = await searchParams;

  return <RefreshClientLoading returnTo={getSafeReturnTo(returnTo)} />;
}
