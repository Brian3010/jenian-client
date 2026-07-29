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
import { UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from './button';

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  if (pathname !== '/dashboard' && pathname !== '/settings') return null;

  return (
    <div className="block sticky top-0 z-20 backdrop-blur px-5 py-1 border-b border-gray-200">
      {/* <div className="flex items-center justify-center h-14 mb-4"> */}
      <div className="mb-5 flex items-center justify-between">
        <Link href="/">
          <div className="text-xl font-semibold text-gray-900">Jenian</div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={'icon'} className="rounded-full bg-primary text-white">
              <UserRound />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl p-3">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user.name.slice(0, 10)}</DropdownMenuLabel>
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
