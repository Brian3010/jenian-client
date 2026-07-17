import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ShiftFormValues } from '@/features/shift/schemas';
import { EmploymentType, ShiftEntryType } from '@/features/shift/types';
import { Controller, useFormContext, type FieldError as HookFormFieldError } from 'react-hook-form';

type ShiftFormFieldsProps = {
  payStartDate: string;
  payEndDate: string;
  isEditing: boolean;
  onCancel: () => void;
};

export default function ShiftFormFields({ payStartDate, payEndDate, isEditing, onCancel }: ShiftFormFieldsProps) {
  const {
    control,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<ShiftFormValues>();

  return (
    <FieldGroup>
      <Field data-invalid={Boolean(errors.workDate)}>
        <FieldLabel htmlFor="workDate">Date</FieldLabel>
        <Input
          className="appearance-none rounded-xl"
          id="workDate"
          type="date"
          min={payStartDate}
          max={payEndDate}
          aria-invalid={Boolean(errors.workDate)}
          aria-describedby={errors.workDate ? 'workDate-error' : undefined}
          {...register('workDate')}
        />
        <FieldError id="workDate-error" errors={[errors.workDate]} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={Boolean(errors.startTime)}>
          <FieldLabel htmlFor="startTime">Start time</FieldLabel>
          <Input
            className="appearance-none rounded-xl"
            id="startTime"
            type="time"
            aria-invalid={Boolean(errors.startTime)}
            aria-describedby={errors.startTime ? 'startTime-error' : undefined}
            {...register('startTime')}
          />
          <FieldError id="startTime-error" errors={[errors.startTime]} />
        </Field>

        <Field data-invalid={Boolean(errors.endTime)}>
          <FieldLabel htmlFor="endTime">End time</FieldLabel>
          <Input
            className="appearance-none rounded-xl"
            id="endTime"
            type="time"
            aria-invalid={Boolean(errors.endTime)}
            aria-describedby={errors.endTime ? 'endTime-error' : undefined}
            {...register('endTime')}
          />
          <FieldError id="endTime-error" errors={[errors.endTime]} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <BreakField name="unpaidBreak" label="Unpaid Break (min)" error={errors.unpaidBreak} />
        <BreakField name="paidBreak" label="Paid Break (min)" error={errors.paidBreak} />
      </div>

      <Controller
        control={control}
        name="entryType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="entryType">Entry Type</FieldLabel>
            <Select value={String(field.value)} onValueChange={value => field.onChange(Number(value))}>
              <SelectTrigger
                id="entryType"
                className="w-full max-w-48"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? 'entryType-error' : undefined}
              >
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
            <FieldError id="entryType-error" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="employmentType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="employmentType">Employment Type</FieldLabel>
            <Select value={String(field.value)} onValueChange={value => field.onChange(Number(value))}>
              <SelectTrigger
                id="employmentType"
                className="w-full max-w-48"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? 'employmentType-error' : undefined}
              >
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
            <FieldError id="employmentType-error" errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="mt-6 flex justify-between gap-4 py-4">
        <Button variant="outline" type="button" onClick={onCancel} className="flex-1 rounded-xl">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting} className="flex-1 rounded-xl">
          {isEditing ? 'Save Changes' : 'Add Shift'}
        </Button>
      </div>
    </FieldGroup>
  );
}

type BreakFieldProps = {
  name: 'paidBreak' | 'unpaidBreak';
  label: string;
  error?: HookFormFieldError;
};

function BreakField({ name, label, error }: BreakFieldProps) {
  const { register } = useFormContext<ShiftFormValues>();
  const errorId = `${name}-error`;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        className="rounded-xl"
        id={name}
        type="number"
        min={0}
        max={60}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...register(name, {
          setValueAs: value => (value === '' ? 0 : Number(value)),
        })}
      />
      <FieldError id={errorId} errors={[error]} />
    </Field>
  );
}
