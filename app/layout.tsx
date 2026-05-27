// import { SidebarBackdrop } from '@/components/sidebar-backdrop';
import { NotificationProvider } from '@/components/providers/NotificationContext';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Jenian',
  description: 'Jenian App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gray-50 flex justify-center">
        <main className="w-full">
          <NotificationProvider>
            <div>{children}</div>
          </NotificationProvider>
        </main>
      </body>
    </html>
  );
}
