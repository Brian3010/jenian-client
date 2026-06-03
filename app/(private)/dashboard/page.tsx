import ShiftCalculatorCard from '@/features/shift/components/ShiftCalculatorCard';
import TelegramIntegrationCard from '@/features/telegram/components/TelegramIntegrationCard';

export default function Dashboard() {
  return (
    <>
      <div className="w-full p-2">
        {/* <div className=""> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/**Card-1 */}
          <TelegramIntegrationCard />
          {/**Card-2 */}
          <ShiftCalculatorCard />
        </div>
      </div>
    </>
  );
}
