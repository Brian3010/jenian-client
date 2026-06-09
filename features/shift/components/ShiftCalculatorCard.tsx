'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { TelegramIntegrationCardSkeleton } from '@/features/telegram/components/TelegramIntegrationCardSkeleton';
import { usePayDetail } from '../context/PayDetailContext';
import HasPayCycleState from './HasPayCycleState';
import PayCycleRequiredState from './PayCycleRequiredState';

export default function ShiftCalculatorCard() {
  const { payDetail, error, loading } = usePayDetail();

  if (error) {
    return (
      <Card className="p-5 flex flex-col gap-3">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          </div>
          <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
        </CardHeader>
        <CardDescription className="flex flex-col gap-3 py-3 border-y">
          <div className="text-sm text-red-500">{error}</div>
        </CardDescription>
      </Card>
    );
  }

  if (loading) return <TelegramIntegrationCardSkeleton />;

  return payDetail && payDetail.hasPayCycleSettings ? (
    <HasPayCycleState payCycleData={payDetail} />
  ) : (
    <PayCycleRequiredState />
  );
}

/*
export default function ShiftCalculatorCard() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [payCycleData, setPayCycleData] = useState<PayCycleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPayCycle();
        console.log('🚀 ~ ShiftCalculatorCard ~ res:', res);
        setPayCycleData(res);
      } catch (error) {
        console.error('Error fetching pay cycle:', error);
        setError('Failed to load shift data. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) {
    return (
      <Card className="p-5 flex flex-col gap-3">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Shift Calculator</h1>
          </div>
          <div className="text-sm text-gray-500">Manage shifts and estimate your pay for the current cycle.</div>
        </CardHeader>
        <CardDescription className="flex flex-col gap-3 py-3 border-y">
          <div className="text-sm text-red-500">{error}</div>
        </CardDescription>
      </Card>
    );
  }

  if (loading) return <TelegramIntegrationCardSkeleton />;

  return payCycleData && payCycleData.hasPayCycleSettings ? (
    <HasPayCycleState payCycleData={payCycleData} />
  ) : (
    <PayCycleRequiredState />
  );
}
  */
