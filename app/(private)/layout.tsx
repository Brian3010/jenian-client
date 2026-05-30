import AppSidebar from '@/components/layout/AppSidebar';
import NavBottomBar from '@/components/layout/NavBottomBar';
import { NotificationsToaster } from '@/components/providers/NotificationToaster';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="w-full min-h-dvh md:flex">
        <AppSidebar />
        <div className="flex-1 min-h-dvh justify-center flex flex-col md:gap-4">
          <NotificationsToaster />
          <div className="w-full max-w-5xl pt-2 px-2 sm:p-0 flex-1 self-center">{children}</div>
        </div>
        <NavBottomBar />
      </div>
    </SidebarProvider>
  );
}
