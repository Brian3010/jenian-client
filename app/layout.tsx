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
      <body>
        <div className="flex justify-center items-center h-dvh">
          <div className="w-full max-w-xl border-2 border-amber-300 ">
            <div className="w-full p-1">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
