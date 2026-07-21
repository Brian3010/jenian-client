'use client';

import { Button } from '@/components/ui/button';
import { logoutUser } from '@/features/auth/services/auth.client';

export default function LogoutBtn() {
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }

    window.location.replace('/auth/sign-in');
  };

  return (
    <Button
      variant={'ghost'}
      className="hover:cursor-pointer hover:bg-white hover:text-destructive text-destructive p-0 font-semibold "
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
