import { SummaryBreakdown } from '@/features/shift/components/ShiftCalculatorClient';

type PaySummaryCardProps = {
  summary: SummaryBreakdown;
  className: string;
};

export default function PaySummaryCard({ summary, className }: PaySummaryCardProps) {
  console.log('🚀 ~ PaySummaryCard ~ summary:', summary);
  return (
    <div className={className}>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Estimated Gross Pay</p>
        <p className="text-xl font-semibold">${summary.estimatedGrossPay}</p>
      </div>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Scheduled Total Hours</p>
        <p className="text-xl font-semibold">{summary.scheduledTotalHours} hrs</p>
      </div>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Shifts</p>
        <p className="text-xl font-semibold">{summary.shiftCountInCycle}</p>
      </div>
    </div>
  );
}
