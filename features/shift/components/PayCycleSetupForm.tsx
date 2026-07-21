'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleSubmitPayCycleSetup } from '@/features/shift/services/shift.client';
import { AppError } from '@/lib/AppError';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PayCycleSetupFormSchema, PayCycleSetupFormValues } from '../schemas';
import { PayCycleType } from '../types';

export default function PayCycleSetupForm() {
  const router = useRouter();
  const {
    control,
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<PayCycleSetupFormValues>({
    resolver: zodResolver(PayCycleSetupFormSchema), // Add your resolver here if you have one
    defaultValues: {
      anchorStartDate: new Date().toISOString().split('T')[0], // Set default value to today's date
      payCycleType: PayCycleType.Fortnightly,
    },
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: PayCycleSetupFormValues) => {
    console.log('Form submitted with data:', data);

    try {
      // Call your API to submit the form data
      const result = await handleSubmitPayCycleSetup(data);
      if (result) {
        router.refresh();
      } else {
        throw new AppError({
          message: 'Failed to set up pay cycle',
        });
      }
    } catch (error) {
      console.error('Error submitting pay cycle setup:', error);
      setError('Failed to submit pay cycle setup. Please try again later.');
    }
  };
  return (
    <div className=" flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-130">
        {/* Heading */}
        <div className="pb-6">
          <h1 className="text-slate-900 mb-1 text-xl font-semibold">Set up your pay cycle</h1>
          <p className="text-sm text-slate-500">
            Tell Jenian how your pay period works so your shifts and wage estimate use the right dates.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Card */}
          <Card className="p-5 flex flex-col gap-3">
            {/* Anchor date */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="anchor-date" className="block text-sm text-slate-700 mb-1.5 font-semibold">
                  Anchor start date
                </FieldLabel>
                <Input
                  {...register('anchorStartDate')}
                  className="appearance-none rounded-xl"
                  id="anchor-date"
                  type="date"
                />
                {errors.anchorStartDate && (
                  <FieldError className="text-sm text-red-500" id="anchor-date-error">
                    {errors.anchorStartDate.message}
                  </FieldError>
                )}
                <FieldDescription className="text-sm text-slate-500">
                  Use the first day of a known pay period from your payslip.
                </FieldDescription>
              </Field>

              {/* Cycle type */}
              {/* */}
              <Controller
                control={control}
                name="payCycleType"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="payCycleType" className="block text-sm text-slate-700 mb-1.5 font-semibold">
                      Pay cycle type
                    </FieldLabel>
                    <Select value={String(field.value)} onValueChange={value => field.onChange(Number(value))}>
                      <SelectTrigger
                        id="payCycleType"
                        className="w-full max-w-48"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={fieldState.error ? 'payCycleType-error' : undefined}
                      >
                        <SelectValue placeholder="Select cycle type" />
                      </SelectTrigger>
                      <SelectContent className="z-90" position="popper">
                        <SelectGroup>
                          <SelectItem value={String(PayCycleType.Weekly)}>Weekly</SelectItem>
                          <SelectItem value={String(PayCycleType.Fortnightly)}>Fortnightly</SelectItem>
                          <SelectItem value={String(PayCycleType.Monthly)}>Monthly</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.payCycleType && (
                      <FieldError className="text-sm text-red-500" id="payCycleType-error">
                        {errors.payCycleType.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </Card>

          {/* Actions */}
          <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-2.5">
            <Button className="flex-1" variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>

            <Button className="flex-1 bor" variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save pay cycle settings'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
