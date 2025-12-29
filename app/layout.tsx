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
      <body>
        {/**ADD SIDE BAR */}
        <SidebarProvider defaultOpen={false}>
          <div className="absolute">
            <SidebarBackdrop />
            <AppSidebar />
          </div>

          {/* Header */}
          <div className="w-full min-h-dvh">
            <div className="sticky top-0 z-0 border-b backdrop-blur">
              <div className="mx-auto flex w-full items-center justify-center p-1 sm:p-2 lg:p-3">
                <span className="flex-1">
                  <SidebarTrigger />
                </span>

                <div className="font-semibold italic tracking-wide underline decoration-amber-500 flex-1">Jenian</div>
              </div>
            </div>
            {/* ---------*/}

            {/* Main Content */}
            <main className="w-full">
              {/* <div className="w-full max-w-xl border-2 border-amber-300 "> */}
              {children}
              {/* </div> */}
            </main>
            {/* Main Content */}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
