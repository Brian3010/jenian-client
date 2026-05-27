import { isTelegramLinked } from '@/features/telegram/services/telegram.service';
import { useEffect, useState } from 'react';

export default function useIsUserConnected() {
  const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserLinked = async () => {
      try {
        setIsLoading(true);

        const isLinked = await isTelegramLinked();
        setIsUserConnected(isLinked);
      } catch (error) {
        console.error('Error checking if user is linked:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserLinked();
  }, []);

  return { isUserConnected, isLoading };
}
