'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ReprotFormHeaderProps = {
  stepNumber: number;
  totalStep: number;
};

export default function ReportFormHeader({ stepNumber, totalStep }: ReprotFormHeaderProps) {
  const router = useRouter();
  return (
    <div className="block sticky top-0 z-20 backdrop-blur px-5 py-2 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <button
          aria-label="Exit to Dashboard"
          className="hover:cursor-pointer w-8 h-8"
          onClick={() => router.replace('/dashboard')}
        >
          <ArrowLeft size={19} />
        </button>
        <span className="flex-2  text-gray-900">Generate Report</span>
        <span className="text-muted-foreground">
          {stepNumber}/{totalStep}
        </span>
      </div>
      {/* progress bar */}
      <div className="h-1 border rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(stepNumber / totalStep) * 100}%` }}
        />
      </div>
    </div>
  );
}
