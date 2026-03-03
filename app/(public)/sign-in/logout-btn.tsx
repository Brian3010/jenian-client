'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/services/auth.service';
import React from 'react';

export default function LogoutBtn() {
  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      await logout();
      console.log('Logout successful, redirecting to sign-in page');
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <Button variant={'secondary'} className="hover:cursor-pointer" onClick={handleLogout}>
      Log out
    </Button>
  );
}
