'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

import { BadgeDollarSign, LayoutDashboard, Settings, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
};

const items: SidebarItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Shift Calculator',
    url: '/chemist-warehouse/shift-calculator',
    icon: BadgeDollarSign,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible={isMobile ? 'offcanvas' : 'icon'} className="z-50 block bg-gray-50">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex justify-between">
            <SidebarMenuItem className="text-center">
              <SidebarTrigger className="h-8 w-8 min-w-8 max-w-8" />
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map(i => {
                const isActive = pathname === i.url || pathname.startsWith(`${i.url}/`);

                if (i.disabled) {
                  return (
                    <SidebarMenuItem key={i.title}>
                      <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-400">
                        <i.icon className="h-4 w-4" />
                        <span className="px-2 font-medium">{i.title}</span>
                      </div>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={i.title}>
                    <SidebarMenuButton asChild className="hover:cursor-pointer">
                      <Link
                        href={i.url}
                        className={`rounded-lg ${isActive ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                      >
                        <i.icon />
                        <span className={`${isActive ? 'font-semibold' : ''} px-2`}>{i.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
