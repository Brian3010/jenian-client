import AppSidebar from '@/components/AppSidebar';
import { NotificationsToaster } from '@/components/notifications/NotificationToaster';
import Header from '@/components/ui/header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background ">
      <SidebarProvider defaultOpen={false} className="">
        <AppSidebar />
        <div className="w-full py-2 px-1">
          <Header />

          {/* <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"> */}
          <NotificationsToaster />
          <main className="py-1">
            <div className="w-full border rounded-md">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
