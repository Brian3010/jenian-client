'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type ReprotFormHeaderProps = {
  stepNumber: number;
  totalStep: number;
};

export default function ReportFormHeader({ stepNumber, totalStep }: ReprotFormHeaderProps) {
  const router = useRouter();
  return (
    <div className="block sticky top-0 z-20 backdrop-blur px-5 border-b border-gray-200">
      <div className="mb-5 flex h-14 justify-between items-center">
        <div
          className="flex-1 flex py-1 hover:cursor-pointer text-sm font-medium"
          onClick={() => router.replace('/dashboard')}
        >
          <ArrowLeft />
        </div>
        <span className="flex-2 text-lg font-semibold text-gray-900">Generate Report</span>
        <span className="text-muted-foreground">
          {stepNumber}/{totalStep}
        </span>
      </div>
    </div>
  );
}
