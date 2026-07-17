import { createShiftFormSchema, ShiftFormValues } from '@/features/shift/schemas';
import { EmploymentType, ShiftEntryType } from '@/features/shift/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { FormProvider, useForm } from 'react-hook-form';
import ShiftFormFields from './ShiftFormFields';

type ShiftModalProps = {
  shift: ShiftFormValues | undefined;
  timeZoneId: string;
  payStartDate: string;
  payEndDate: string;
  onCancel: () => void;
  onSave: (shift: ShiftFormValues) => void;
};

export default function ShiftModal({ shift, timeZoneId, payStartDate, payEndDate, onCancel, onSave }: ShiftModalProps) {
  const isEditing = Boolean(shift);
  const zonedToday = DateTime.now().setZone(timeZoneId);
  const defaultWorkDate = zonedToday.isValid ? (zonedToday.toISODate() ?? payStartDate) : payStartDate;

  const methods = useForm<ShiftFormValues>({
    resolver: zodResolver(createShiftFormSchema(payStartDate, payEndDate)),
    defaultValues: {
      workDate: shift?.workDate ?? defaultWorkDate,
      startTime: shift?.startTime ?? '',
      endTime: shift?.endTime ?? '',
      paidBreak: shift?.paidBreak ?? 10,
      unpaidBreak: shift?.unpaidBreak ?? 30,
      entryType: shift?.entryType ?? ShiftEntryType.Worked,
      employmentType: shift?.employmentType ?? EmploymentType.FullTime,
    },
  });

  const handleValidSubmit = (values: ShiftFormValues) => {
    onSave({
      ...values,
      ...(shift?.id ? { id: shift.id } : {}),
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-70 bg-[rgba(20,32,59,0.18)]" aria-hidden="true" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shift-modal-title"
        className="fixed z-80 inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-4"
      >
        <div
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          className="bg-white w-full overflow-y-auto max-h-[90dvh] sm:max-w-md rounded-t-2xl
            sm:rounded-2xl border border-slate-200 p-6 backdrop-blur shadow-lg shadow-[rgba(15,23,42,0.10)]"
        >
          <div className="sm:hidden flex justify-center mb-4" aria-hidden="true">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          <h2 id="shift-modal-title" className="text-slate-900 text-xl font-semibold py-2 pb-4">
            {isEditing ? 'Edit shift' : 'Add shift'}
          </h2>

          <FormProvider {...methods}>
            <form noValidate onSubmit={methods.handleSubmit(handleValidSubmit)}>
              <ShiftFormFields
                payStartDate={payStartDate}
                payEndDate={payEndDate}
                isEditing={isEditing}
                onCancel={onCancel}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
