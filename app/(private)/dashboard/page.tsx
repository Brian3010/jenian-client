import TelegramIntegrationCard from './components/TelegramIntegrationCard';

export default function Dashboard() {
  return (
    <div className="w-full sm:p-2">
      <div className="flex w-full flex-col gap-6">
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 "> */}
        <div className="flex flex-col gap-2">
          <TelegramIntegrationCard />
        </div>
      </div>
    </div>
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
