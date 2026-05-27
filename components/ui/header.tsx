'use client';
import Link from 'next/link';
// import { SidebarTrigger } from './sidebar';
import LogoutBtn from '@/features/auth/components/LogoutBtn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/features/auth/context/UserInfoContext';
import { Button } from './button';

export default function Header() {
  const { userInfo } = useUser();
  return (
    <div className="block sticky top-0 z-20 backdrop-blur px-5 py-2  border-gray-200">
      {/* <div className="flex items-center justify-center h-14 mb-4"> */}
      <div className="mb-5 flex h-14 items-center justify-between">
        <Link href="/">
          <span className="text-lg font-semibold text-gray-900">Jenian</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={'icon'} className="rounded-full">
              {userInfo != null && userInfo.username.charAt(0)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl p-3">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{userInfo !== null && userInfo.username}</DropdownMenuLabel>
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
