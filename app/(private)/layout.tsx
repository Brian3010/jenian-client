import AppSidebar from '@/components/layout/AppSidebar';
import NavBottomBar from '@/components/layout/NavBottomBar';
import { NotificationsToaster } from '@/components/providers/NotificationToaster';
import Header from '@/components/ui/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthContextProvider } from '@/features/auth/context/AuthContext';
import { requireSession } from '@/lib/auth/session';

export default async function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireSession('/dashboard');
  console.log('🚀 ~ PrivateLayout ~ user:', user);

  return (
    <AuthContextProvider initialUser={user}>
      <SidebarProvider defaultOpen={false}>
        {/* <PayDetailContextProvider> */}
        <div className="w-full min-h-dvh md:flex">
          <AppSidebar />
          <div className="flex-1 min-h-dvh justify-center flex flex-col md:gap-4">
            <NotificationsToaster />
            <Header />
            <div className="w-full max-w-5xl sm:p-0 flex-1 self-center">{children}</div>
          </div>
          <NavBottomBar />
        </div>
        {/* </PayDetailContextProvider> */}
      </SidebarProvider>
    </AuthContextProvider>
  );
}
