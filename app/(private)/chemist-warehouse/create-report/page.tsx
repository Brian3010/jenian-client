<<<<<<< HEAD
import React from 'react';
import EodReportForm from '@/features/cwh/components/EodReportForm';
=======
'use client';

import { Button, GradientButton } from '@/components/ui/button';
import { Field, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useNotifications } from '@/context/notifications/NotificationContext';
import { handleReport } from '@/features/cwh/services/cwh.service';
import {
  // additionalTasks,
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
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import ReportFormHeader from './components/ReportFormHeader';
import SectionInputs, { SectionInputsProps } from './components/SectionInputs';

const STORAGE_KEY = 'eod-report-draft';

export default function CreateEodReportForm() {
  const { notifySuccess, notifyError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);
  const stepTopRef = useRef<HTMLDivElement | null>(null);
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
  const sectionSteps: { step: { number: number; to: SectionInputsProps } }[] = [
    {
      step: {
        number: 2,
        to: {
          fieldArray: stockUpdate,
          register: register,
          title: 'Stock Update',
          errors: errors,
          optional: true,
        },
      },
    },
    {
      step: {
        number: 3,
        to: {
          fieldArray: nightTasks,
          register: register,
          title: 'Night Tasks (Fill & Face)',
          description: 'Off Locations',
          errors: errors,
        },
      },
    },
    {
      step: {
        number: 4,
        to: {
          fieldArray: ailesFacing,
          register: register,
          title: 'Night Tasks (Fill & Face)',
          description: 'Aisles Facing',
          errors: errors,
        },
      },
    },
    {
      step: {
        number: 5,
        to: {
          fieldArray: cleaning,
          register: register,
          title: 'Cleaning',
          description: 'Cleaning Tasks and Areas',
          errors: errors,
        },
      },
    },
    {
      step: {
        number: 6,
        to: {
          fieldArray: generalCheck,
          register: register,
          title: 'General Check',
          errors: errors,
        },
      },
    },
  ];

  const router = useRouter();

  const stepForward = () => {
    // Only allow going forward if current step is less than target step (prevents skipping steps)
    setStepNumber(prev => prev + 1);
  };

  const stepBack = () => {
    // Only allow going back if current step is greater than target step (prevents skipping steps)
    setStepNumber(prev => prev - 1);
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);

        reset({
          ...parsedDraft,
          DeliveryScreenShots: [], // file inputs should not be restored (recommended)
        });
      } catch (error) {
        console.error('Failed to parse saved draft', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [reset]);

  useEffect(() => {
    const unsubscribe = subscribe({
      // start the listener only for form values changes (not errors, touched, etc.)
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { DeliveryScreenShots, ...rest } = values;

        // Persist form data as a string in localStorage (auto-save draft)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      },
    });
    // Cleanup: stop listening when component unmounts
    return unsubscribe;
  }, [subscribe]);

  useLayoutEffect(() => {
    const el = stepTopRef.current;
    if (!el) return;

    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY,
      behavior: 'auto',
    });
  }, [stepNumber]);

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
>>>>>>> origin/newfeatures

  return (
    <div className="flex flex-col gap-5" ref={stepTopRef}>
      <ReportFormHeader stepNumber={stepNumber} totalStep={sectionSteps.length + 1} />
      <div className="sm:p-3 flex justify-center pb-28" ref={stepTopRef}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl flex flex-col gap-2">
          {/* <div ref={stepTopRef}> */}
          {/* Content */}
          {/* <div
          className="flex py-1 hover:cursor-pointer text-sm font-medium"
          onClick={() => router.replace('/dashboard')}
        >
          ← Back
        </div> */}

          {stepNumber === 1 && (
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
                  onClick={() => stepForward()}
                  type="button"
                  className="flex-1 flex items-center justify-center rounded-2xl text-sm font-medium text-white transition"
                  // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                >
                  <span className="font-semibold">Next</span>
                </GradientButton>
              </div>
            </>
          )}

          {sectionSteps.map(
            (it, i) =>
              stepNumber === it.step.number && (
                <div
                  key={i}
                  className={`flex flex-col gap-2 ${isLoading ? ' blur-xs pointer-events-none select-none' : ''}`}
                >
                  <SectionInputs
                    fieldArray={it.step.to.fieldArray}
                    register={it.step.to.register}
                    title={it.step.to.title}
                    errors={it.step.to.errors}
                    description={it.step.to.description}
                    optional={it.step.to.optional}
                  />
                  {it.step.number !== sectionSteps.length + 1 && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => stepBack()}
                        type="button"
                        variant={'outline'}
                        className="flex-1 py-5 rounded-xl text-sm transition active:scale-[0.99] border-gray-400"
                        // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                      >
                        <span className="font-semibold">Back</span>
                      </Button>
                      <GradientButton
                        onClick={() => stepForward()}
                        type="button"
                        className="flex-1 flex items-center justify-center rounded-2xl text-sm font-medium text-white transition"
                        // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
                      >
                        <span className="font-semibold">Next</span>
                      </GradientButton>
                    </div>
                  )}
                </div>
              ),
          )}

          {stepNumber === sectionSteps.length + 1 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col gap-5">
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => stepBack()}
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

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  You will receive the report summary via Telegram (@JenianBot). Make sure your Telegram account is
                  linked in the dashboard.
                </p>
              </div>
            </div>
          )}
          {/* </div> */}
        </form>
      </div>
    </div>
  );
}
