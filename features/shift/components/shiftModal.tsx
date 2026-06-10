import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatTime24h } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { shiftFormSchema, ShiftFormValues } from '../schemas';
import { UserShift } from '../types';

type ShiftModalProps = {
  shift: UserShift | undefined;
  onCancel: () => void;
  onSave: (shift: UserShift) => void;
};

export default function ShiftModal({ shift, onCancel, onSave }: ShiftModalProps) {
  const isEditing = !!shift;
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      workDate: isEditing
        ? new Date(shift.startAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0], // default to today
      startTime: isEditing ? formatTime24h(shift.startAt, shift.timeZoneId) : '09:00', // default to 09:00
      endTime: isEditing ? formatTime24h(shift.endAt, shift.timeZoneId) : '17:00', // default to 17:00
      paidBreak: isEditing ? shift.paidBreakMinutes : 30,
      unpaidBreak: isEditing ? shift.unpaidBreakMinutes : 0,
      entryType: 'Worked',
      employmentType: 'Full-Time',
    },
  });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-[rgba(20,32,59,0.18)]" aria-hidden="true" onClick={onCancel} />
      {/* Panel — bottom sheet on mobile, centred dialog on ≥sm */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shift-modal-title"
        className="fixed z-60 inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-4 "
      >
        <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-200 p-6  backdrop-blur shadow-lg shadow-[rgba(15,23,42,0.10)]">
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center mb-4" aria-hidden="true">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          <h2 id="shift-modal-title" className="text-slate-900 text-xl font-semibold py-2 pb-4">
            {isEditing ? 'Edit shift' : 'Add shift'}
          </h2>
          <form>
            <FieldGroup>
              {/* Work date */}
              <Field>
                <FieldLabel htmlFor="workDate">Date</FieldLabel>
                <Input className="appearance-none rounded-xl" id="workDate" type="date" {...register('workDate')} />
                {errors.workDate && <p className="text-sm text-red-500 mt-1">{errors.workDate.message}</p>}
              </Field>

              {/* Start and end time */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="startTime">Start time</FieldLabel>
                  <Input
                    // defaultValue={formatTime24h(shift?.startAt, shift?.timeZoneId)}
                    className="appearance-none rounded-xl"
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                  />
                  {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="endTime">End time</FieldLabel>
                  <Input className="appearance-none rounded-xl" id="endTime" type="time" {...register('endTime')} />
                  {errors.endTime && <p className="text-sm text-red-500 mt-1">{errors.endTime.message}</p>}
                </Field>
              </div>

              {/* Breaks */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="unpaidBreak">Unpaid Break (min)</FieldLabel>
                  <Input className="rounded-xl" id="unpaidBreak" type="number" {...register('unpaidBreak')} />
                  {errors.unpaidBreak && <p className="text-sm text-red-500 mt-1">{errors.unpaidBreak.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="paidBreak">Paid Break (min)</FieldLabel>
                  <Input className="rounded-xl" id="paidBreak" type="number" {...register('paidBreak')} />
                  {errors.paidBreak && <p className="text-sm text-red-500 mt-1">{errors.paidBreak.message}</p>}
                </Field>
              </div>

              {/* Entry type */}
              <Field>
                <FieldLabel htmlFor="entryType">Entry Type</FieldLabel>
                <Input className="appearance-none rounded-xl" id="entryType" type="text" {...register('entryType')} />
                {errors.entryType && <p className="text-sm text-red-500 mt-1">{errors.entryType.message}</p>}
              </Field>

              {/* Employment type */}
              <Field>
                <FieldLabel htmlFor="employmentType">Employment Type</FieldLabel>
                <Input
                  className="appearance-none rounded-xl"
                  id="employmentType"
                  type="text"
                  {...register('employmentType')}
                />
                {errors.employmentType && <p className="text-sm text-red-500 mt-1">{errors.employmentType.message}</p>}
              </Field>

              {/* Save and cancel buttons */}
              <div className="mt-6 flex justify-between gap-4 py-4">
                <Button variant={'outline'} type="button" onClick={onCancel} className="flex-1 rounded-xl ">
                  Cancel
                </Button>
                <Button
                  variant={'primary'}
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {}}
                  className="flex-1 rounded-xl"
                >
                  {isEditing ? 'Save Changes' : 'Add Shift'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  );
}
