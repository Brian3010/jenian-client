import AppSidebar from '@/components/AppSidebar';
import AppSidebarMain from '@/components/AppSidebarMain';
import NavBottomBar from '@/components/NavBottomBar';
import Header from '@/components/ui/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NotificationsToaster } from '@/context/notifications/NotificationToaster';
import { UserInfoContextProvider } from '@/context/userInfo/UserInfoContext';

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserInfoContextProvider>
      <SidebarProvider>
        <div className="w-full min-h-dvh md:flex">
          <AppSidebar />
          <div className="flex-1 justify-center flex flex-col">
            <Header />
            <NotificationsToaster />
            <div className="w-full max-w-5xl p-2 sm:p-0 flex-1 self-center">{children}</div>
          </div>
          <NavBottomBar />
        </div>
      </SidebarProvider>
    </UserInfoContextProvider>
  );

  // return (
  //   <div className="min-h-screen bg-gray-100 flex justify-center">
  //     <div className="w-full max-w-xl p-4">
  //       <SidebarProvider defaultOpen={true} className="">
  //         <AppSidebar />
  //         <div className="w-full py-2 px-1">
  //           <Header />

  //           {/* <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"> */}
  //           <NotificationsToaster />
  //           <div className="py-1">
  //             <div className="w-full border rounded-md">{children}</div>
  //           </div>
  //         </div>
  //       </SidebarProvider>
  //     </div>
  //   </div>
  // );
}
