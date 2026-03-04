'use client';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';

import LogoutBtn from '@/app/(public)/sign-in/logout-btn';
import { LayoutDashboard } from 'lucide-react';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
];

export default function AppSidebar() {
  const { isMobile, open } = useSidebar();

  return (
    <Sidebar variant="floating" collapsible={isMobile ? 'offcanvas' : 'icon'} className="z-50 block">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex justify-between">
            <SidebarMenuItem className="text-center">
              <SidebarTrigger className="h-8 w-8 min-w-8 max-w-8" />
            </SidebarMenuItem>
            <SidebarMenuItem>{open && <SidebarGroupLabel>Jenian</SidebarGroupLabel>}</SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="">
            <SidebarMenu>
              {items.map(i => (
                <SidebarMenuItem key={i.title}>
                  <SidebarMenuButton asChild>
                    <a href={i.url}>
                      <i.icon />
                      <span>{i.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <LogoutBtn />
      </SidebarFooter>
    </Sidebar>
  );
}
