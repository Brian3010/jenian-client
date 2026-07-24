import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatTime12h } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  createDuplicateShiftFormSchema,
  DuplicateShiftFormValues,
  EmploymentTypeOptions,
  EntryTypeOptions,
  ShiftFormValues,
} from '../schemas';

type DuplicateShiftModalProps = {
  originalShift: ShiftFormValues;
  onDuplicate: (originalShift: ShiftFormValues, duplicateShiftDate: string) => void;
  onCancel: () => void;
  payStartDate: string;
  payEndDate: string;
};

export default function DuplicateShiftModal({
  originalShift,
  onDuplicate,
  onCancel,
  payStartDate,
  payEndDate,
}: DuplicateShiftModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DuplicateShiftFormValues>({
    resolver: zodResolver(createDuplicateShiftFormSchema(payStartDate, payEndDate)),
    defaultValues: {
      duplicateShiftDate: originalShift.workDate, // Set the default value to the original shift's date
    },
  });

  const handleDuplicate = (values: DuplicateShiftFormValues) => {
    onDuplicate(originalShift, values.duplicateShiftDate);
  };

  return (
    <>
      <div className="fixed inset-0 z-70 bg-[rgba(20,32,59,0.18)]" aria-hidden="true" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="duplicate-shift-modal-title"
        className="fixed inset-0 z-80 flex items-center justify-center px-4"
      >
        <div
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          className="bg-white w-full max-w-md overflow-y-auto max-h-[90dvh] rounded-2xl
            border border-slate-200 p-6 backdrop-blur shadow-lg shadow-[rgba(15,23,42,0.10)]"
        >
          <div>
            <h2 id="duplicate-shift-modal-title" className="text-xl font-semibold text-slate-900">
              Duplicate shift
            </h2>
            <p className="pt-1 text-sm leading-5 text-slate-500">
              Everything below is copied from the original shift. Just pick a new date to add it.
            </p>
          </div>

          <div className="pt-3">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
              <Copy size={13} strokeWidth={1.75} className="text-slate-400" aria-hidden="true" />
              <span className="font-semibold text-slate-700">
                {formatTime12h(originalShift.startTime)} – {formatTime12h(originalShift.endTime)}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="font-medium text-slate-700">{EntryTypeOptions[originalShift.entryType]}</span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span>{EmploymentTypeOptions[originalShift.employmentType]}</span>
            </div>
          </div>

          <form noValidate className="pt-5" onSubmit={handleSubmit(handleDuplicate)}>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Field data-invalid={Boolean(errors.duplicateShiftDate)}>
                <FieldLabel htmlFor="duplicateShiftDate" className="font-semibold text-slate-900">
                  Choose a date for this shift
                </FieldLabel>
                <Input
                  className="h-10 appearance-none rounded-xl bg-white"
                  id="duplicateShiftDate"
                  type="date"
                  min={payStartDate}
                  max={payEndDate}
                  aria-invalid={Boolean(errors.duplicateShiftDate)}
                  aria-describedby={errors.duplicateShiftDate ? 'duplicateShiftDate-error' : undefined}
                  {...register('duplicateShiftDate')}
                />
                <FieldError id="duplicateShiftDate-error" errors={[errors.duplicateShiftDate]} />
                <FieldDescription>All other details are copied from the original shift.</FieldDescription>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-5">
              <Button variant="outline" type="button" onClick={onCancel} className="h-10 rounded-xl">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting} className="h-10 rounded-xl">
                Duplicate shift
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
