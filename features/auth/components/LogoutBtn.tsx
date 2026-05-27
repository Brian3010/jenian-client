'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/services/auth.service';

export default function LogoutBtn() {
  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      await logout();
      localStorage.clear();
      console.log('Logout successful, redirecting to sign-in page');
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Logout failed:', error);
      console.error('Logout failed. Please try again.');
      window.location.href = '/sign-in';
    }
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
