import Header from '@/components/ui/header';
import TelegramIntegrationCard from '@/features/telegram/components/TelegramIntegrationCard';

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
}
