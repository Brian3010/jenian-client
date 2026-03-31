'use client';
import React, { useState } from 'react';
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

import LogoutBtn from '@/app/(public)/sign-in/components/LogoutBtn';
import { LayoutDashboard, SquareLibrary } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Salary',
    url: '',
    icon: SquareLibrary,
  },
];

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <Sidebar variant="sidebar" collapsible={isMobile ? 'offcanvas' : 'icon'} className="z-50 block">
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
                const isActive = i.title === activeTab;

                return (
                  <SidebarMenuItem key={i.title}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => {
                        setActiveTab(i.title);
                      }}
                      className="hover:cursor-pointer"
                    >
                      <a
                        href={i.url}
                        className={`rounded-lg ${isActive ? 'bg-gray-100 font-semibold' : ' hover:bg-gray-50'}`}
                      >
                        <i.icon />
                        <span className={`${isActive ? 'font-semibold' : ''} px-2`}>{i.title}</span>
                      </a>
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
