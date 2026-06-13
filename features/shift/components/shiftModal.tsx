import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { shiftFormSchema, ShiftFormValues } from '@/features/shift/schemas';
import { EmploymentType, ShiftEntryType, UserShift } from '@/features/shift/types';
import { formatDateTimeOffset, formatTime24h } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

type ShiftModalProps = {
  shift: UserShift | undefined;
  onCancel: () => void;
  onSave: (shift: UserShift) => void;
};

export default function ShiftModal({ shift, onCancel, onSave }: ShiftModalProps) {
  console.log('🚀 ~ ShiftModal ~ shift:', shift);
  const isEditing = !!shift;
  const {
    control,
    trigger,
    register,
    formState: { errors },
    getValues,
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
      entryType: isEditing ? shift.entryType : ShiftEntryType.Worked, // default to 'Worked'
      employmentType: isEditing ? shift.employmentType : EmploymentType.FullTime, // default to 'Full-time'
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form values:', getValues().entryType, getValues().employmentType);

    if (!(await trigger())) {
      console.log('Validation failed:', errors);
      return;
    }

    const toSaveData = {
      ...(shift && shift.id ? { id: shift.id } : {}),
      startAt: formatDateTimeOffset(getValues().workDate, getValues().startTime),
      endAt: formatDateTimeOffset(getValues().workDate, getValues().endTime),
      paidBreakMinutes: getValues().paidBreak,
      unpaidBreakMinutes: getValues().unpaidBreak,
      entryType: getValues().entryType,
      employmentType: getValues().employmentType,
    } as UserShift;
    console.log('🚀 ~ handleSubmit ~ toSaveData:', toSaveData);
    onSave(toSaveData);
    // Handle form submission logic here
  };

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

                      <SelectContent className="z-70" position="popper">
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
                      <SelectContent className="z-70" position="popper">
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
