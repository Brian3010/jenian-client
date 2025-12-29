import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from './ui/sidebar';

import { LayoutDashboard } from 'lucide-react';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="z-50">
      <SidebarContent>
        <SidebarGroup className="p-0">
          <div className="mx-auto flex w-full items-center justify-between p-1 sm:p-2 lg:p-3">
            <SidebarTrigger />
            <SidebarGroupLabel className="flex-1 text-base">Jenian</SidebarGroupLabel>
          </div>
          <SidebarGroupContent className="py-3">
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
    </Sidebar>
  );
}
