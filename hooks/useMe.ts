import { useEffect, useState } from 'react';

type UserT = { userIdd: string; username: string; email: string };

export default function useMe() {
  const [user, setUser] = useState<UserT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/auth/me');
        console.log('🚀 ~ useMe ~ res:', res);
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data: UserT = await res.json();
        console.log('🚀 ~ useMe ~ data:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user information', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, loading };
}
