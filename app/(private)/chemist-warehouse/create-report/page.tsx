'use client';

import { useNotifications } from '@/components/providers/NotificationContext';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ailesFacing, cleaning, generalCheck, nightTasks, stockUpdate } from '@/features/cwh/constants';
import { reportSchema } from '@/features/cwh/schemas';
import { handleReport } from '@/features/cwh/services/cwh.service';
import { ReportValuesInput, ReportValuesOutput } from '@/features/cwh/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';

import { Textarea } from '@/components/ui/textarea';
import ReportFormHeader from '@/features/cwh/components/ReportFormHeader';
import SectionInputs, { SectionInputsProps } from '@/features/cwh/components/SectionInputs';

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
    setStepNumber(prev => prev + 1);
  };

  const stepBack = () => {
    setStepNumber(prev => prev - 1);
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);

        reset({
          ...parsedDraft,
          DeliveryScreenShots: [],
        });
      } catch (error) {
        console.error('Failed to parse saved draft', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [reset]);

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { DeliveryScreenShots, ...rest } = values;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      },
    });
    return unsubscribe;
  }, [subscribe]);

  useLayoutEffect(() => {
    const el = stepTopRef.current;
    if (!el) return;

    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY + -200,
      behavior: 'auto',
    });
  }, [stepNumber]);

  const onSubmit = async (signInData: ReportValuesOutput) => {
    console.log('🚀 ~ onSubmit ~ signInData:', signInData);
    try {
      setIsLoading(true);
      const data = await handleReport(signInData);
      console.log('🚀 ~ onSubmit ~ data:', data);
      localStorage.removeItem(STORAGE_KEY);
      notifySuccess('Report submitted successfully!');

      //TODO: log data for now, can add data to /dashboard to show the submitted report in a summary card or something later
      return router.push('/dashboard');
    } catch (error) {
      console.error(error);
      notifyError('Failed to submit report. Please try again.');
      alert(error instanceof Error ? error + '|' + error.message : 'An unknown error occurred');
      setIsLoading(false);
      return router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ReportFormHeader stepNumber={stepNumber} totalStep={sectionSteps.length + 1} />
      <div className="flex flex-col gap-5 p-2" ref={stepTopRef}>
        <div className="flex justify-center pb-28 " ref={stepTopRef}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl flex flex-col gap-5">
            {stepNumber === 1 && (
              <>
                <StepDeliveries register={register} errors={errors} />
                <div className="flex gap-3">
                  <Button
                    onClick={() => stepForward()}
                    variant="primary"
                    className="flex-1 flex items-center justify-center  font-medium text-white transition"
                  >
                    <span className="font-semibold">Next</span>
                  </Button>
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
                          className="flex-1 text-sm transition active:scale-[0.99] border-gray-400"
                        >
                          <span className="font-semibold">Previous</span>
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => stepForward()}
                          type="button"
                          className="flex-1 flex items-center justify-center  font-medium text-white transition"
                        >
                          <span className="font-semibold">Next</span>
                        </Button>
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
                    className="flex-1 text-sm transition active:scale-[0.99] border-gray-400"
                  >
                    <span className="font-semibold">Back</span>
                  </Button>
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    type="submit"
                    className="flex-1 flex items-center justify-center  font-medium text-white transition"
                  >
                    {isLoading ? (
                      <Spinner className="size-6" data-icon="inline-start" />
                    ) : (
                      <span className="font-semibold">Submit</span>
                    )}
                  </Button>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    You will receive the report summary via Telegram (@JenianBot). Make sure your Telegram account is
                    linked in the dashboard.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

function StepDeliveries({
  register,
  errors,
}: {
  register: UseFormRegister<ReportValuesInput>;
  errors: FieldErrors<ReportValuesInput>;
}) {
  const [method, setMethod] = useState<'upload' | 'manual'>('upload');

  return (
    <>
      <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="px-5 py-3">
          <h2 className="text-black font-medium text-md">
            Deliveries <span className="text-gray-500 text-sm">(Optional)</span>
          </h2>

          <p className="text-gray-600 text-sm">Upload delivery screenshots or enter delivery details manually.</p>
        </div>
        <div className="px-5 py-2">
          <div className="p-1 mt-2 rounded-lg border border-gray-200 bg-gray-100 w-full grid grid-cols-2 gap-6">
            {['upload', 'manual'].map(m => {
              const active = method === m;
              return (
                <button
                  key={m}
                  onClick={() => setMethod(m as 'upload' | 'manual')}
                  className={`border h-9 rounded-lg cursor-pointer transition-all  ${active ? 'bg-white' : 'border-none bg-transparent'}`}
                >
                  <span className="text-sm font-medium">
                    {m === 'upload' ? 'Upload screenshots' : 'Enter manually'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-5 py-2">
          {method === 'upload' && (
            <Field>
              {errors.DeliveryScreenShots && (
                <p className="text-sm text-destructive mt-1">{errors.DeliveryScreenShots.message}</p>
              )}
              <div className="flex gap-4 items-center">
                <Input type="file" {...register('DeliveryScreenShots')} multiple />
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Delivery result is AI-extracted and may contain errors. Review the final report on Telegram.
              </div>
            </Field>
          )}

          {method === 'manual' && (
            <Field>
              {/* {errors.DeliveryScreenShots && (
            <p className="text-sm text-destructive mt-1">{errors.DeliveryScreenShots.message}</p>
          )} */}
              <div className="flex flex-col gap-4 items-center">
                <Textarea
                  placeholder="Example: Sigma - 12 @ 10:30am, Warehouse - 5 @ 11:00am, etc."
                  className="resize-none rounded-md border border-gray-300 p-2 w-full min-h-[120px]"
                  {...register('StockUpdate.AdditionalNote')}
                />
              </div>
            </Field>
          )}
        </div>
      </section>
    </>
  );
}
