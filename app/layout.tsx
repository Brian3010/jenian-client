// import { SidebarBackdrop } from '@/components/sidebar-backdrop';
import { NotificationProvider } from '@/components/providers/NotificationContext';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // themeColor: "#0F766E",
};

export const metadata: Metadata = {
  title: 'Jenian',
  description: 'A personal productivity assistant.',
  applicationName: 'Jenian',
  appleWebApp: {
    capable: true,
    title: 'Jenian',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
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
