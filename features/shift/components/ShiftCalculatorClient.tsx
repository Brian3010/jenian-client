'use client';

import { PayCycleResponse } from '@/features/shift/types';
import { useState } from 'react';
import PaySummaryCard from './PaySummaryCard';

type ShiftCalculatorClientProps = {
  initialSummary: PayCycleResponse;
};

export default function ShiftCalculatorClient({ initialSummary }: ShiftCalculatorClientProps) {
  const [summary, setSummary] = useState<PayCycleResponse>(initialSummary);

  return (
    // <div className="flex flex-col gap-5 p-2 py-5">
    <>
      <div className="flex gap-3 md:flex-row flex-col">
        <div>
          <h1 className="text-slate-900 text-2xl font-semibold">Shift Calculator</h1>
          <p className="text-sm text-slate-500 py-1.5">
            Manage your shifts, breaks, and estimated pay for this pay cycle.
          </p>
          <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg">
            <span className="text-xs text-slate-700" style={{ fontWeight: 500 }}>
              {'1 Jun - 14 Jun '}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white">
                <button
                  // onClick={() => setCycleOffset(o => o - 1)} disabled={isSaving}
                  aria-label="Previous cycle"
                  className="px-3 py-1.5 text-sm text-slate-500 border-r border-slate-200
                    hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                <button
                  // onClick={() => setCycleOffset(0)} disabled={isSaving}
                  className="px-3 py-1.5
                    hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <span className="text-xs text-slate-500">Current</span>
                </button>
                <button
                  // onClick={() => setCycleOffset(o => o + 1)} disabled={isSaving}
                  aria-label="Next cycle"
                  className="px-3 py-1.5 text-sm text-slate-500 border-l border-slate-200
                    hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
              </div> */}
          <button
            // onClick={() => setShowAddModal(true)} disabled={isSaving}
            className="px-3.5 py-1.5 text-sm bg-slate-700 text-white rounded-xl
                  hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ fontWeight: 500 }}
          >
            + Add shift
          </button>
        </div>
      </div>
      {/* Card summary */}
      <PaySummaryCard summary={summary} className="flex md:flex-row flex-col gap-2" />{' '}
    </>
    // </div>
  );
}
