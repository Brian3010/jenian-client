import AppSidebar from '@/components/layout/AppSidebar';
import NavBottomBar from '@/components/layout/NavBottomBar';
import { NotificationsToaster } from '@/components/providers/NotificationToaster';
import BackendUnavailableFallBack from '@/components/ui/BackendUnavailableFallBack';
import Header from '@/components/ui/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthContextProvider } from '@/features/auth/context/AuthContext';
import { PayDetailContextProvider } from '@/features/shift/context/PayDetailContext';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

// backend health check, no cookies needed
async function checkBackendHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/health`, {
      next: {
        revalidate: 300,
      },
    });

    if (!res.ok) {
      console.error('Backend health check failed with status:', res.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to GET /api/health: ', error);
    return false;
  }
}

export default async function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isBackendHealthy = await checkBackendHealth();
  if (!isBackendHealthy) {
    return <BackendUnavailableFallBack />;
  }

  const user = await getSession();
  console.log('🚀 ~ PrivateLayout ~ user:', user);

  // null returned, do redirect to refresh route to get new token
  if (!user) {
    redirect('/api/auth/refresh?returnTo=/dashboard');
  }
  //TODO: PayDetailContextProvider can combine with AuthContextProvider ??
  return (
    <AuthContextProvider initialUser={user}>
      <SidebarProvider defaultOpen={false}>
        <PayDetailContextProvider>
          <div className="w-full min-h-dvh md:flex">
            <AppSidebar />
            <div className="flex-1 min-h-dvh justify-center flex flex-col md:gap-4">
              <NotificationsToaster />
              <Header />
              <div className="w-full max-w-5xl sm:p-0 flex-1 self-center">{children}</div>
            </div>
            <NavBottomBar />
          </div>
        </PayDetailContextProvider>
      </SidebarProvider>
    </AuthContextProvider>
  );
}
