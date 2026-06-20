'use client';

// import { formatTime12h } from '@/lib/utils';
import { SummaryBreakdown } from '@/features/shift/components/ShiftCalculatorData';
import { formatDateDayMonth, formatTime12h, formatWorkDate } from '@/lib/utils';
import { useState } from 'react';
import { EmploymentTypeOptions, EntryTypeOptions, ShiftFormValues } from '../schemas';
import ShiftModal from './shiftModal';

type ShiftCalculatorClientProps = {
  initialSummaryBreakdown: SummaryBreakdown;
  cycleStartDate: string;
  cycleEndDate: string;
  initialUserShifts: ShiftFormValues[];
  timeZoneId: string;
};

export default function ShiftCalculatorClient({
  initialSummaryBreakdown,
  initialUserShifts,
  cycleStartDate,
  cycleEndDate,
  timeZoneId,
}: ShiftCalculatorClientProps) {
  const [summaryBreakDown, setSummaryBreakDown] = useState<SummaryBreakdown>(initialSummaryBreakdown);
  const [savedShifts, setSavedShifts] = useState<ShiftFormValues[]>(initialUserShifts);
  const [draftShifts, setDraftShifts] = useState<ShiftFormValues[]>(initialUserShifts);
  console.log('🚀 ~ ShiftCalculatorClient ~ draftShifts:', draftShifts);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingShift, setEditingShift] = useState<ShiftFormValues | null>(null);

  const onModalCancel = () => {
    setShowAddModal(false);
    setEditingShift(null);
  };

  // add shift
  const handleAdd = (shift: ShiftFormValues) => {
    setDraftShifts(prev => [...prev, { id: `draft-${crypto.randomUUID()}`, ...shift }]);
    setShowAddModal(false);
  };

  // edit shift
  const handleEdit = (shift: ShiftFormValues) => {
    console.log('🚀 ~ handleEdit ~ shift:', shift);
    setDraftShifts(prev => prev.map(s => (s.id === shift.id ? shift : s)));
    setShowAddModal(false);
    setEditingShift(null); // reset as shiftModal will have old shift data, won't close
  };

  // delete shift
  const handleDelete = (id: string | null) => {
    if (id === null) return;
    setDraftShifts(prev => prev.filter(s => s.id !== id));
    setShowAddModal(false);
  };

  // submit shift to backend
  const handleSubmit = async () => {
    console.log('submiting .... ', draftShifts);
    await new Promise(r => setTimeout(r, 1600));
  };

  return (
    <>
      <div className="flex gap-3 md:flex-row flex-col">
        <div>
          <h1 className="text-slate-900 text-2xl font-semibold">Shift Calculator</h1>
          <p className="text-sm text-slate-500 py-1.5">
            Manage your shifts, breaks, and estimated pay for this pay cycle.
          </p>
          <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg">
            <span className="text-xs text-slate-700" style={{ fontWeight: 500 }}>
              {formatDateDayMonth(cycleStartDate)} - {formatDateDayMonth(cycleEndDate)}
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
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 text-sm bg-slate-700 text-white rounded-xl
                  hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ fontWeight: 500 }}
          >
            + Add shift
          </button>
        </div>
      </div>
      {/* Card summary */}
      <PaySummaryCard summary={summaryBreakDown} className="flex md:flex-row flex-col gap-2" />

      {/* shift details */}
      <div className="flex flex-col lg:flex-row gap-4">
        {draftShifts.length > 0 ? (
          draftShifts.map(shift => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              isSaving={false}
              isError={false}
              onEdit={() => setEditingShift(shift)}
              onDelete={() => handleDelete(shift.id || null)}
            />
          ))
        ) : (
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
              <p className="text-slate-800 mb-1">No shifts added yet</p>
              <p className="text-sm text-slate-400 mb-5 px-6">
                Add your first shift to estimate your pay for this period.
              </p>
            </div>
          </div>
        )}

        <div className="w-full lg:w-2xs shrink-0">
          <span className="text-sm text-slate-500">Pay breakdown coming soon...</span>
        </div>
        {(showAddModal || editingShift) && (
          <ShiftModal
            shift={editingShift || undefined}
            timeZoneId={timeZoneId}
            onCancel={onModalCancel}
            onSave={editingShift ? handleEdit : handleAdd}
          />
        )}
      </div>
    </>
  );
}

type ShiftCardProps = {
  shift: ShiftFormValues;
  isSaving: boolean;
  isError: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

//TODO: convert start and end times to user's sytem timezone to display, and convert back to shift timezone when saving
function ShiftCard({ shift, isSaving, isError, onEdit, onDelete }: ShiftCardProps) {
  return (
    <div className={`rounded-2xl border px-4 py-4 bg-white`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
            {/* {formatShortDate(shift.startAt, shift.timeZoneId)} */}
            {formatWorkDate(shift.workDate)}
          </span>
        </div>
        <div className="flex gap-3 shrink-0 ml-2 text-sm">
          <button
            onClick={onEdit}
            disabled={isSaving}
            className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-40 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={isSaving}
            className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-2">
        {/* {formatTime12h(shift.startAt, shift.timeZoneId)} - {formatTime12h(shift.endAt, shift.timeZoneId)} */}
        {formatTime12h(shift.startTime)} - {formatTime12h(shift.endTime)}
      </p>

      <div className="flex gap-3 text-xs text-slate-400 mb-3">
        {/* <span>Unpaid: {shift.unpaidBreakMinutes} min</span>
        <span>Paid: {shift.paidBreakMinutes} min</span> */}
        <span>Unpaid: {shift.unpaidBreak} min</span>
        <span>Paid: {shift.paidBreak} min</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{EntryTypeOptions[shift.entryType]}</span>
          <span className="text-slate-300">·</span>
          <span>{EmploymentTypeOptions[shift.employmentType]}</span>
        </div>
      </div>

      {isError && (
        <p className="mt-2.5 pt-2.5 border-t border-red-100 text-xs text-red-700" style={{ fontWeight: 500 }}>
          This shift is outside the selected pay cycle.
        </p>
      )}
    </div>
  );
}

// function PayBreakDown({ shifts }: { shifts: UserShift[] }) {
//   //TODO: calculate base hours, evening penalty, overtime, paid breaks, unpaid breaks from shifts
//   return (
//     <div
//       className="bg-white rounded-2xl border border-slate-200 p-5"
//       style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}
//     >
//       <h3 className="text-slate-900 mb-4" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
//         Pay breakdown
//       </h3>

//       {/* {hasUnsaved && !isSaving && (
//         <div className="mb-4 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
//           <p className="text-xs text-amber-800">Breakdown is based on last saved shifts. Save changes to update.</p>
//         </div>
//       )} */}

//       {breakdown ? (
//         <div className="space-y-2.5">
//           {(
//             [
//               ['Base hours', `${breakdown.baseHours} hrs`],
//               ['Evening penalty', `${breakdown.eveningPenalty} hrs`],
//               ['Overtime', `${breakdown.overtime} hrs`],
//               ['Paid breaks', `${breakdown.paidBreaks} hrs`],
//               ['Unpaid breaks', `${breakdown.unpaidBreaks} hrs`],
//             ] as [string, string][]
//           ).map(([label, value]) => (
//             <div key={label} className="flex items-center justify-between">
//               <span className="text-sm text-slate-500">{label}</span>
//               <span className="text-sm text-slate-900" style={{ fontWeight: 500 }}>
//                 {value}
//               </span>
//             </div>
//           ))}
//           <div className="pt-3 border-t border-slate-100">
//             <p className="text-xs text-slate-400">Last updated: {breakdown.lastUpdated}</p>
//           </div>
//         </div>
//       ) : (
//         <p className="text-sm text-slate-400">No breakdown yet. Save your first shifts to generate one.</p>
//       )}
//     </div>
//   );
// }

type PaySummaryCardProps = {
  summary: SummaryBreakdown;
  className: string;
};

function PaySummaryCard({ summary, className }: PaySummaryCardProps) {
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
