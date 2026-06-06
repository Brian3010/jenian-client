import { PayCycleResponse } from '@/features/shift/types';

type PaySummaryCardProps = {
  summary: PayCycleResponse;
  className: string;
};

export default function PaySummaryCard({ summary, className }: PaySummaryCardProps) {
  if (!summary) return null;

  return (
    <div className={className}>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Estimated Gross Pay</p>
        <p className="text-xl font-semibold">${summary.estimatedGrossPay}</p>
      </div>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Scheduled Total Hours</p>
        <p className="text-xl font-semibold">{summary.shiftCountInCycle} hrs</p>
      </div>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Shifts</p>
        <p className="text-xl font-semibold">{summary.shiftCountInCycle}</p>
      </div>
    </div>
  );
}
