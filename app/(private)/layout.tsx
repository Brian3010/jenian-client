import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/ui/header';
import { NotificationsToaster } from '@/context/notifications/NotificationToaster';
import { UserInfoContextProvider } from '@/context/userInfo/UserInfoContext';

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserInfoContextProvider>
      <div className="w-full">
        <div className="min-h-screen flex flex-col">
          <Header />
          <NotificationsToaster />
          <div className="py-1 flex-1">{children}</div>
          <NavigationBar />
        </div>
      </div>
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
