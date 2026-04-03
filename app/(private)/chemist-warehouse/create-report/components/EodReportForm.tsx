'use client';

import { Button, GradientButton } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useNotifications } from '@/context/notifications/NotificationContext';
import { handleReport } from '@/features/cwh/services/cwh.service';
import {
  ailesFacing,
  cleaning,
  generalCheck,
  nightTasks,
  reportSchema,
  ReportValuesInput,
  ReportValuesOutput,
  stockUpdate,
} from '@/zodSchema/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BackStepButton from './BackStepButton';
import InputFieldAndError from './InputFieldAndError';
import NextStepButton from './NextStepButton';

const STORAGE_KEY = 'eod-report-draft';

export default function EodReportForm() {
  const [step, setStep] = useState(1);
  const { notifySuccess, notifyError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    subscribe,
    reset,
    formState: { errors },
  } = useForm<ReportValuesInput, unknown, ReportValuesOutput>({
    resolver: zodResolver(reportSchema),
    mode: 'onSubmit',
    defaultValues: {
      DeliveryScreenShots: [],
    },
  });

  const router = useRouter();

  const stepForward = (targetStep: number) => {
    setStep(targetStep);
  };

  const stepBack = (targetStep: number) => {
    setStep(targetStep);
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);

        reset({
          ...parsedDraft,
          DeliveryScreenShots: [], // file inputs should not be restored (reconmended)
        });
      } catch (error) {
        console.error('Failed to parse saved draft', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [reset]);

  useEffect(() => {
    // Subscribe to form value changes (runs on every change, no re-render)
    const unsubscribe = subscribe({
      // start the listent
      formState: {
        values: true, // we only care about form values (not errors, touched, etc.)
      },
      callback: ({ values }) => {
        // Exclude file inputs (cannot/should not be stored in localStorage)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { DeliveryScreenShots, ...rest } = values;

        // Persist form data as a string in localStorage (auto-save draft)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      },
    });
    // Cleanup: stop listening when component unmounts
    return unsubscribe;
  }, [subscribe]);

  const onSubmit = async (signInData: ReportValuesOutput) => {
    console.log('clicked clicked');
    console.log('🚀 ~ onSubmit ~ signInData:', signInData);
    // alert(`Report is being submitted, please wait... ${JSON.stringify(signInData)}`);
    try {
      setIsLoading(true);
      const data: { message: string; status: number } = await handleReport(signInData);
      // alert(data.message);
      console.log('🚀 ~ onSubmit ~ data:', data);
      setIsLoading(false);
      if (data.status === 200) {
        localStorage.removeItem(STORAGE_KEY);
        notifySuccess('Report submitted successfully!');
        return router.push('/dashboard');
      }
      // proxy will return message = Unauthorized when refreshtoken not detected
      if (data.message === 'Unauthorized' || data.status === 401) return router.push('/sign-in');
    } catch (error) {
      console.error(error);
      notifyError('Failed to submit report. Please try again.');
      alert(error instanceof Error ? error + '|' + error.message : 'An unknown error occurred');
      setIsLoading(false);
      return router.push('/dashboard');
    }
  };

  return (
    <div className="w-full sm:p-3 flex justify-center ">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl">
        {/* Content */}
        {/* <div
          className="flex py-1 hover:cursor-pointer text-sm font-medium"
          onClick={() => router.replace('/dashboard')}
        >
          ← Back
        </div> */}
        <div className="sm:p-6">
          <div className={'flex flex-col gap-2 pt-5  space-y-6 pb-2'}>
            {/* Deliveries */}

            {step === 1 && (
              <>
                <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <div className="border-b px-5 py-3">
                    <h2 className="text-black font-medium text-md">Deliveries</h2>
                    <p className="text-gray-600">Upload delivery screenshots for AI extraction.</p>
                  </div>
                  <div className="px-5 py-3">
                    <Field>
                      {errors.DeliveryScreenShots && (
                        <p className="text-sm text-destructive mt-1">{errors.DeliveryScreenShots.message}</p>
                      )}
                      <div className="flex gap-4 items-center">
                        <Input type="file" {...register('DeliveryScreenShots')} multiple />
                        <FieldDescription className="font-semibold">Optional</FieldDescription>
                      </div>
                      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Delivery result is AI-extracted and may contain errors. Review the final report on Telegram.
                      </div>
                    </Field>
                  </div>
                </section>
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.replace('/dashboard')}
                    type="button"
                    variant={'outline'}
                    className="flex-1 py-5 rounded-xl text-sm transition active:scale-[0.99] border-gray-400"
                    // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                  >
                    <span className="font-semibold">Back</span>
                  </Button>
                  <GradientButton
                    onClick={() => setStep(2)}
                    type="button"
                    className="flex-1 flex items-center justify-center rounded-2xl text-sm font-medium text-white transition"
                    // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                  >
                    <span className="font-semibold">Next</span>
                  </GradientButton>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="pb-20">
                <div className={`flex flex-col gap-2${isLoading ? 'blur-xs pointer-events-none select-none' : ''}`}>
                  {/* Stock Updates */}
                  {/* <p className="text-sm text-destructive">{errors.stockUpdate?.trolleyOfStock?.message}</p> */}
                  <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="border-b px-5 py-3 flex items-center justify-between">
                      <h2 className="text-black font-medium text-md">Stock Updates</h2>
                      <p className="text-muted-foreground text-sm">Optional</p>
                    </div>
                    <div className="px-5 py-3">
                      <InputFieldAndError fieldArray={stockUpdate} register={register} errors={errors} />
                    </div>
                  </section>

                  {/*Night Task*/}
                  <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="border-b px-5 py-3">
                      <h2 className="text-black font-medium text-md">Night Tasks</h2>
                      <p className="text-gray-600">Off Locations (Fill & Face) @ 8.00pm</p>
                    </div>
                    {/* Off Locations */}
                    <div className="px-5 py-3">
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <InputFieldAndError fieldArray={nightTasks} register={register} errors={errors} />
                        </div>
                      </div>
                      <div>
                        <Field>
                          <FieldLabel>Addtional Tasks: </FieldLabel>
                          <Textarea {...register('AdditionalTasks')} />
                        </Field>
                      </div>
                    </div>
                  </section>

                  {/* Off Aisles (Fill & Face) */}
                  <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="border-b px-5 py-3">
                      <h2 className="text-black font-medium text-md">Night Tasks</h2>
                      <p className="text-gray-600">Aisles (Fill & Face) @ 8.00pm</p>
                    </div>
                    <div className="px-5 py-3">
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <InputFieldAndError fieldArray={ailesFacing} register={register} errors={errors} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/*Cleaning*/}
                  <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="border-b px-5 py-3">
                      <h2 className="text-black font-medium text-md">Cleaning</h2>
                    </div>
                    <div className="px-5 py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <InputFieldAndError fieldArray={cleaning} register={register} errors={errors} />
                      </div>
                    </div>
                  </section>

                  {/*General check*/}
                  <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="border-b px-5 py-3">
                      <h2 className="text-black font-medium text-md">General checks</h2>
                    </div>
                    <div className="px-5 py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <InputFieldAndError fieldArray={generalCheck} register={register} errors={errors} />
                      </div>
                    </div>
                  </section>
                  <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col gap-5">
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        onClick={() => setStep(1)}
                        type="button"
                        disabled={isLoading}
                        variant={'outline'}
                        className="flex-1 py-5 rounded-xl text-sm transition active:scale-[0.99] border-gray-400"
                        // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                      >
                        <span className="font-semibold">Back</span>
                      </Button>
                      <GradientButton
                        disabled={isLoading}
                        type="submit"
                        className="flex-1 flex justify-center rounded-2xl text-sm font-medium text-white transition active:scale-[0.99]"
                        // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                      >
                        {isLoading ? (
                          <Spinner className="size-6" data-icon="inline-start" />
                        ) : (
                          <span className="font-semibold">Submit</span>
                        )}
                      </GradientButton>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-600">
                        You will receive the report summary via Telegram (@JenianBot). Make sure your Telegram account
                        is linked in the dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
