// import { SidebarBackdrop } from '@/components/sidebar-backdrop';
import { NotificationProvider } from '@/context/notifications/NotificationContext';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

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
      <body className="min-h-dvh bg-[#F7F7F8] flex justify-center">
        <main className="w-full max-w-xl px-1 sm:px-4">
          <NotificationProvider>
            <div>{children}</div>
          </NotificationProvider>
        </main>
      </body>
    </html>
  );
}
