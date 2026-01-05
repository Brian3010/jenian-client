import AppSidebar from '@/components/app-sidebar';
// import { SidebarBackdrop } from '@/components/sidebar-backdrop';
import Header from '@/components/ui/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import './globals.css';

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
      <body className="min-h-dvh bg-background ">
        <SidebarProvider defaultOpen={false} className="">
          <AppSidebar />
          <div className="w-full py-2 pr-2">
            <Header />

            {/* <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"> */}
            <main className="py-1">
              <div className="w-full border rounded-md">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
