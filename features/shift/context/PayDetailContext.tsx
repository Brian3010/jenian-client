'use client';

import { getPayCycle } from '@/features/shift/services/shift.service';
import { PayCycleResponse } from '@/features/shift/types';
import { createContext, useContext, useEffect, useState } from 'react';

type PayDetailContextType = {
  payDetail: PayCycleResponse | null;
  addPayDetail: (detail: PayCycleResponse) => void;
  error: string | null;
  loading: boolean;
};

const PayDetailContext = createContext<PayDetailContextType | null>(null);

export function PayDetailContextProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [payDetail, setPayDetail] = useState<PayCycleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayDetail = async () => {
      try {
        const res = await getPayCycle();
        setPayDetail(res);
      } catch (error) {
        console.error('Error fetching context:', error);
        setError('failed to load pay cycle details. Please try again later.');
        setPayDetail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPayDetail();
  }, []);

  const addPayDetail = (detail: PayCycleResponse) => {
    setPayDetail(detail);
  };

  return (
    <PayDetailContext.Provider value={{ payDetail, addPayDetail, error, loading }}>
      {children}
    </PayDetailContext.Provider>
  );
}

export const usePayDetail = () => {
  const context = useContext(PayDetailContext);
  if (!context) throw new Error('usePayDetail must be used within PayDetailContextProvider');
  return context;
};
