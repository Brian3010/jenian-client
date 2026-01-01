import type { Metadata } from 'next';
import './globals.css';

import AppSidebar from '@/components/app-sidebar';

import { SidebarBackdrop } from '@/components/sidebar-backdrop';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Jenian Client',
  description: 'Frontend for Jenian',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background">
        <header className="sticky top-0 z-20 border-b backdrop-blur w-full">
          <div className="mx-auto flex items-center justify-center p-1 sm:p-2 lg:p-3">
            <span className="font-semibold italic tracking-wide underline decoration-amber-500">Jenian</span>
          </div>
        </header>
        <SidebarProvider defaultOpen={false}>
          <aside className="">
            {/* <SidebarBackdrop /> */}
            <AppSidebar />
          </aside>

          {/* <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"> */}
          <main className="">
            {/* <div className="w-full max-w-xl border-2 border-amber-300 "> */}
            {children}
            {/* </div> */}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
