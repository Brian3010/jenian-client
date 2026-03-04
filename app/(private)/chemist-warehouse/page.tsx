import BotConnectCard from './components/BotConnectCard';
import ReportCard from './components/ReportCard';

export default async function ChemistWarehouse() {
  return (
    <div className="w-full p-2">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col text-sm gap-2">
          <p>
            * Link your Telegram account to receive the end of day report, by clicking the &quot;Connect Telegram&quot;
          </p>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 "> */}
        <div className="flex flex-col gap-2">
          <BotConnectCard />
          <ReportCard />
        </div>
      </div>
    </div>
  );
}
