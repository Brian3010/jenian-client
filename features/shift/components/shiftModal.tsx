import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { shiftFormSchema, ShiftFormValues } from '@/features/shift/schemas';
import { EmploymentType, ShiftEntryType } from '@/features/shift/types';
import { formatDateDayMonth } from '@/lib/utils';
// import { formatDateTimeOffset, formatTime24h } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';

type ShiftModalProps = {
  shift: ShiftFormValues | undefined;
  timeZoneId: string;
  payStartDate: string;
  payEndDate: string;
  onCancel: () => void;
  onSave: (shift: ShiftFormValues) => void;
};

export default function ShiftModal({ shift, payStartDate, payEndDate, onCancel, onSave }: ShiftModalProps) {
  console.log('🚀 ~ ShiftModal ~ shift:', shift);
  const isEditing = !!shift;
  const {
    control,
    trigger,
    register,
    setError,
    formState: { errors },
    getValues,
  } = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      workDate: isEditing ? shift.workDate : new Date().toISOString().split('T')[0], // default to today
      startTime: isEditing ? shift.startTime : undefined,
      endTime: isEditing ? shift.endTime : undefined,
      paidBreak: isEditing ? shift.paidBreak : 10,
      unpaidBreak: isEditing ? shift.unpaidBreak : 30,
      entryType: isEditing ? shift.entryType : ShiftEntryType.Worked,
      employmentType: isEditing ? shift.employmentType : EmploymentType.FullTime,
    },
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log('Form values:', getValues().entryType, getValues().employmentType);

    // validate form before submitting
    if (getValues().workDate < payStartDate || getValues().workDate > payEndDate) {
      setError('workDate', {
        type: 'manual',
        message: `Work date is outside the pay period (${formatDateDayMonth(payStartDate)} - ${formatDateDayMonth(payEndDate)})`,
      });
      return;
    }
    if (!(await trigger())) {
      console.log('Validation failed:', errors);
      return;
    }

    // pass validated form values to parent component to handle saving to backend
    onSave({
      ...(shift && shift.id ? { id: shift.id } : {}),
      workDate: getValues().workDate,
      startTime: getValues().startTime,
      endTime: getValues().endTime,
      paidBreak: getValues().paidBreak,
      unpaidBreak: getValues().unpaidBreak,
      entryType: getValues().entryType,
      employmentType: getValues().employmentType,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-70 bg-[rgba(20,32,59,0.18)]" aria-hidden="true" onClick={onCancel} />
      {/* Panel — bottom sheet on mobile, centred dialog on ≥sm */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shift-modal-title"
        className="fixed z-80 inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-4 "
      >
        <div
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          className="bg-white w-full overflow-y-auto max-h-[90dvh] sm:max-w-md rounded-t-2xl 
          sm:rounded-2xl border border-slate-200 p-6  backdrop-blur shadow-lg shadow-[rgba(15,23,42,0.10)]"
        >
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center mb-4" aria-hidden="true">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          <h2 id="shift-modal-title" className="text-slate-900 text-xl font-semibold py-2 pb-4">
            {isEditing ? 'Edit shift' : 'Add shift'}
          </h2>
          <form onSubmit={handleSubmit}>
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
                  <Input
                    className="rounded-xl"
                    id="unpaidBreak"
                    type="number"
                    {...register('unpaidBreak', {
                      setValueAs: value => (value === '' ? 0 : Number(value)),
                    })}
                  />
                  {errors.unpaidBreak && <p className="text-sm text-red-500 mt-1">{errors.unpaidBreak.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="paidBreak">Paid Break (min)</FieldLabel>
                  <Input
                    className="rounded-xl"
                    id="paidBreak"
                    type="number"
                    {...register('paidBreak', {
                      setValueAs: value => (value === '' ? 0 : Number(value)),
                    })}
                  />
                  {errors.paidBreak && <p className="text-sm text-red-500 mt-1">{errors.paidBreak.message}</p>}
                </Field>
              </div>

              {/* Entry type */}
              <Field>
                <FieldLabel htmlFor="entryType">Entry Type</FieldLabel>
                <Controller
                  control={control}
                  name="entryType"
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={value => field.onChange(Number(value))}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select entry type" />
                      </SelectTrigger>

                      <SelectContent className="z-90" position="popper">
                        <SelectGroup>
                          <SelectItem value={String(ShiftEntryType.Worked)}>Worked</SelectItem>
                          <SelectItem value={String(ShiftEntryType.PaidNonWorked)}>Paid Non-Worked</SelectItem>
                          <SelectItem value={String(ShiftEntryType.Leave)}>Leave</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.entryType && <p className="text-sm text-red-500 mt-1">{errors.entryType.message}</p>}
              </Field>

              {/* Employment type */}
              <Field>
                <FieldLabel htmlFor="employmentType">Employment Type</FieldLabel>
                <Controller
                  control={control}
                  name="employmentType"
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={value => field.onChange(Number(value))}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent className="z-90" position="popper">
                        <SelectGroup>
                          <SelectItem value={String(EmploymentType.FullTime)}>Full-time</SelectItem>
                          <SelectItem value={String(EmploymentType.PartTime)}>Part-time</SelectItem>
                          <SelectItem value={String(EmploymentType.Casual)}>Casual</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.employmentType && <p className="text-sm text-red-500 mt-1">{errors.employmentType.message}</p>}
              </Field>

              {/* Save and cancel buttons */}
              <div className="mt-6 flex justify-between gap-4 py-4">
                <Button variant={'outline'} type="button" onClick={onCancel} className="flex-1 rounded-xl ">
                  Cancel
                </Button>
                <Button variant={'primary'} type="submit" className="flex-1 rounded-xl">
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
