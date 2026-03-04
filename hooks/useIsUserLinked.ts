import { isTelegramLinked } from '@/features/telegram/services/telegram.service';
import { useEffect, useState } from 'react';

export default function useIsUserLinked() {
  const [isUserLinked, setIsUserLinked] = useState<{ status: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserLinked = async () => {
      try {
        setIsLoading(true);

        const isLinked = await isTelegramLinked();
        if (!isLinked) setIsUserLinked({ status: false, message: 'Not Connected' });
        else setIsUserLinked({ status: true, message: 'Connected' });
      } catch (error) {
        console.error('Error checking if user is linked:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserLinked();
  }, []);

  return { isUserLinked, isLoading };
}
