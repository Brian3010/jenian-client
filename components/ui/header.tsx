'use client';
import Link from 'next/link';
// import { SidebarTrigger } from './sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoutBtn from '@/features/auth/components/LogoutBtn';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoaderCircle } from 'lucide-react';
import { Button } from './button';

export default function Header() {
  const { userInfo, loading } = useAuth();

  return (
    <div className="block sticky top-0 z-20 backdrop-blur px-5 py-2  border-gray-200">
      {/* <div className="flex items-center justify-center h-14 mb-4"> */}
      <div className="mb-5 flex h-14 items-center justify-between">
        <Link href="/">
          <span className="text-lg font-semibold text-gray-900">Jenian</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {loading ? (
              <Button variant="outline" size={'icon'} className="rounded-full" disabled>
                <LoaderCircle className="animate-spin" />
              </Button>
            ) : (
              <Button variant="outline" size={'icon'} className="rounded-full">
                {userInfo != null && userInfo.userName.charAt(0).toUpperCase()}
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl p-3">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{userInfo !== null && userInfo.userName}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-gray-800 font-normal">
                <Link href="/settings">Settings</Link>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <LogoutBtn />
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
