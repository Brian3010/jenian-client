<<<<<<< HEAD
import TelegramIntegrationCard from '@/features/telegram/components/TelegramIntegrationCard';
=======
import Header from '@/components/ui/header';
import TelegramIntegrationCard from './components/TelegramIntegrationCard';
>>>>>>> origin/newfeatures

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="w-full p-2">
        {/* <div className=""> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          {/**Card-1 */}
          <div className="flex flex-col">
            <TelegramIntegrationCard />
          </div>
          {/**Card-2 */}
        </div>
      </div>
    </>
  );

  // return (
  //   <div className="w-full">
  //     <div className="flex flex-col gap-3">
  //       {/* <HelloMe /> */}
  //       <div className="flex flex-col sm:flex-row w-full items-center gap-4 shadow-">
  //         <Link href="/chemist-warehouse" className="w-full">
  //           <Card className="w-full hover:bg-gray-100 cursor-pointer">
  //             <CardHeader>
  //               <CardTitle>Chemist Warehouse</CardTitle>
  //               <CardDescription>Link Telegram account, generate report</CardDescription>
  //             </CardHeader>
  //           </Card>
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );
}
