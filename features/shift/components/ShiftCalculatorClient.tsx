'use client';

// import { formatTime12h } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { SummaryBreakdown } from '@/features/shift/components/ShiftCalculatorData';
import { formatDateDayMonth, formatTime12h, formatWorkDate, getHoursBetweenTimes } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import { useMemo, useReducer, useState } from 'react';
import { createInitialState, reducer, ShiftWithStatus } from '../reducer/shiftCalculator.reducer';
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
  // reducer
  const [state, dispatch] = useReducer(reducer, initialUserShifts, createInitialState);
  const [editingShift, setEditingShift] = useState<ShiftFormValues | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const hasUnsavedChanges = JSON.stringify(state.draftShifts) !== JSON.stringify(state.savedShifts);

  // recalculate summary breakdown whenever draftShifts changes
  const summaryBreakDown = useMemo<SummaryBreakdown & { hasUnsavedChanges: boolean }>(() => {
    const totalHours = state.draftShifts.reduce((total: number, s: ShiftFormValues) => {
      return total + getHoursBetweenTimes(s.startTime, s.endTime);
    }, 0);

    return {
      ...initialSummaryBreakdown,
      shiftCountInCycle: state.draftShifts.length,
      scheduledTotalHours: totalHours,
      hasUnsavedChanges: hasUnsavedChanges,
    };
  }, [state.draftShifts, initialSummaryBreakdown, hasUnsavedChanges]);

  const onModalCancel = () => {
    setShowAddModal(false);
    setEditingShift(null);
  };

  // add shift to draftShifts
  const handleAdd = (shift: ShiftFormValues) => {
    dispatch({ type: 'ADD_SHIFT', shift });
    setShowAddModal(false);
  };

  // edit shift in draftShifts
  const handleEdit = (shift: ShiftFormValues) => {
    dispatch({ type: 'EDIT_SHIFT', shift });
    setShowAddModal(false);
    setEditingShift(null); // reset as shiftModal will have old shift data, won't close
  };

  // delete shift from draftShifts
  const handleDelete = (id: string | null) => {
    if (id === null) return;
    dispatch({ type: 'DELETE_SHIFT', shiftId: id });
  };

  // submit shift to backend
  const handleSubmit = async () => {
    console.log('submiting .... ', state.draftShifts);

    setIsSaving(true);
    //TODO: call client function
    //TODO: handle errors, show error message, and set isError to true

    // add trycatch
    // call handleShiftSubmit(state.draftShifts, state.deletedShiftIds, cycleStartDate, cycleEndDate) from shift.client.ts
    // catch error, check if error is instance of AppError, then use error.message to display the error message to the user
    // if not instance of AppError, show generic error message "Something went wrong. Please try again later."
    await new Promise(r => setTimeout(r, 5600));

    // Load new saved shifts from backend
    dispatch({ type: 'LOAD_SHIFTS', shifts: state.draftShifts });
    setIsSaving(false);
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
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 text-sm bg-slate-700 text-white rounded-xl
                  hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
            disabled={isSaving}
          >
            + Add shift
          </button>
        </div>
      </div>
      {/* Card summary */}
      <PaySummaryCard isSaving={isSaving} summary={summaryBreakDown} className="flex md:flex-row flex-col gap-2" />

      {/* shift details */}
      <div className="flex flex-col lg:flex-row gap-4">
        {state.draftShifts.length > 0 ? (
          state.draftShifts.map(shift => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              isSaving={isSaving}
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
            payStartDate={cycleStartDate}
            payEndDate={cycleEndDate}
            shift={editingShift || undefined}
            timeZoneId={timeZoneId}
            onCancel={onModalCancel}
            onSave={editingShift ? handleEdit : handleAdd}
          />
        )}
        {
          //TODO: Add save changes button that triggers handleSubmit,
          // only show when there are unsaved changes (draftShifts !== savedShifts),
          // after submit, update savedShifts with draftShifts
        }

        {/**Unsaved Changes */}

        <StickyBar
          hasUnsavedChanges={hasUnsavedChanges}
          unSavedCount={state.changeCounter}
          isSaving={isSaving}
          isError={false}
          onSave={handleSubmit}
          onDiscard={() => dispatch({ type: 'DISCARD_CHANGES' })}
        />
      </div>
      <div className="h-20" />
    </>
  );
}

type ShiftCardProps = {
  shift: ShiftWithStatus;
  isSaving: boolean;
  isError: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function ShiftCard({ shift, isSaving, isError, onEdit, onDelete }: ShiftCardProps) {
  return (
    <div className={`rounded-2xl border px-4 py-4 bg-white`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
            {/* {formatShortDate(shift.startAt, shift.timeZoneId)} */}
            {formatWorkDate(shift.workDate)}
          </span>
          {shift.status === 'saved' ? null : (
            <span
              className={`px-1.5 py-px rounded text-xs ${
                shift.status === 'new'
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {shift.status}
            </span>
          )}
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

// TODO: calculate pay breakdown from shifts including new and updated shifts, show total hours, base hours...
// TODO: cross pay will be calculated from backend
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
  summary: SummaryBreakdown & { hasUnsavedChanges: boolean };
  className: string;
  isSaving: boolean;
};

function PaySummaryCard({ summary, className, isSaving }: PaySummaryCardProps) {
  return (
    <div className={className}>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Estimated Gross Pay</p>
        {isSaving ? (
          <Skeleton className="h-7 w-28" />
        ) : (
          <p className="text-xl font-semibold">${summary.estimatedGrossPay.toFixed(2)}</p>
        )}
        {summary.hasUnsavedChanges ? (
          <span className="flex items-center gap-1 text-xs leading-5 text-amber-600">
            <CircleAlert size={14} />
            <p>Save changes to update pay</p>
          </span>
        ) : (
          <p className="text-xs leading-5 text-slate-400">Based on last saved shifts</p>
        )}
      </div>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Scheduled Total Hours</p>
        <p className="text-xl font-semibold">{summary.scheduledTotalHours.toFixed(2)} hrs</p>
        <p className="text-xs leading-5 text-slate-400">
          {summary.hasUnsavedChanges ? 'Includes unsaved changes' : 'Based on last saved shifts'}
        </p>
      </div>
      <div className="p-4 bg-white rounded-xl border flex-1 basis-0">
        <p className=" text-gray-400 text-sm uppercase font-medium">Shifts</p>
        <p className="text-xl font-semibold">{summary.shiftCountInCycle}</p>
        <p className="text-xs leading-5 text-slate-400">
          {summary.hasUnsavedChanges ? 'Includes unsaved changes' : 'Based on last saved shifts'}
        </p>
      </div>
    </div>
  );
}

// ─── Sticky save bar ───────────────────────────────────────────────────────

function StickyBar({
  unSavedCount,
  hasUnsavedChanges,
  isSaving,
  isError,
  onSave,
  onDiscard,
}: {
  unSavedCount: number;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isError: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  if (!hasUnsavedChanges) return null;
  const msg = isSaving
    ? 'Saving shifts and updating pay estimate…'
    : isError
      ? 'Save failed. Review the highlighted row and try again.'
      : `You have ${hasUnsavedChanges ? 'unsaved changes' : 'no unsaved changes'}. Save to update pay estimate.`;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-60 bg-white border-t border-slate-200"
      style={{ boxShadow: '0 -2px 10px rgba(15,23,42,0.06)' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-0 min-h-28 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <p className="sr-only">{msg}</p>
        <p aria-hidden="true" className="text-sm text-slate-500 truncate w-full sm:w-auto">
          <span className="sm:hidden">
            {isSaving ? 'Saving changes...' : isError ? 'Save failed' : `You have ${unSavedCount} unsaved changes`}
          </span>
          <span className="hidden sm:inline">{msg}</span>
        </p>
        <div className="flex items-center gap-2.5 w-full sm:w-auto sm:shrink-0">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-3 py-2.5 sm:py-1.5 text-sm text-slate-600 border border-slate-200 rounded-xl bg-white
              hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 text-sm bg-slate-700 text-white rounded-xl flex items-center justify-center gap-1.5
              hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            style={{ fontWeight: 500 }}
          >
            {isSaving && <Spinner />}
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
