'use client';

import { useNotifications } from '@/components/providers/NotificationContext';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import ReportFormHeader from '@/features/cwh/components/ReportFormHeader';
import SectionInputs, { SectionInputsProps } from '@/features/cwh/components/SectionInputs';
import { ailesFacing, cleaning, generalCheck, nightTasks, stockUpdate } from '@/features/cwh/constants';
import { reportSchema } from '@/features/cwh/schemas';
import { handleReport } from '@/features/cwh/services/cwh.client';
import { ReportValuesInput, ReportValuesOutput } from '@/features/cwh/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FieldErrors, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';

const STORAGE_KEY = 'eod-report-draft';

type ReportForm = UseFormReturn<ReportValuesInput, unknown, ReportValuesOutput>;

type ReportSectionStep = Pick<SectionInputsProps, 'fieldArray' | 'title' | 'description' | 'optional'> & {
  number: number;
};

const SECTION_STEPS: ReportSectionStep[] = [
  {
    number: 2,
    fieldArray: stockUpdate,
    title: 'Stock Update',
    optional: true,
  },
  {
    number: 3,
    fieldArray: nightTasks,
    title: 'Night Tasks (Fill & Face)',
    description: 'Off Locations',
  },
  {
    number: 4,
    fieldArray: ailesFacing,
    title: 'Night Tasks (Fill & Face)',
    description: 'Aisles Facing',
  },
  {
    number: 5,
    fieldArray: cleaning,
    title: 'Cleaning',
    description: 'Cleaning Tasks and Areas',
  },
  {
    number: 6,
    fieldArray: generalCheck,
    title: 'General Check',
  },
];

const DELIVERY_METHODS = ['upload', 'manual'] as const;
type DeliveryMethod = (typeof DELIVERY_METHODS)[number];

export default function CreateEodReportForm() {
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);

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

  const totalSteps = SECTION_STEPS.length + 1;
  const currentSection = SECTION_STEPS.find(section => section.number === stepNumber);
  const isLastStep = stepNumber === totalSteps;
  const stepTopRef = useStepScroll(stepNumber);

  useReportDraft({ reset, subscribe });

  const goNext = () => {
    setStepNumber(prev => Math.min(prev + 1, totalSteps));
  };

  const goBack = () => {
    setStepNumber(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (reportValues: ReportValuesOutput) => {
    console.log('🚀 ~ onSubmit ~ reportValues:', reportValues);

    try {
      setIsLoading(true);
      const data = await handleReport(reportValues); // client function called
      console.log('🚀 ~ onSubmit ~ data:', data);
      localStorage.removeItem(STORAGE_KEY);
      notifySuccess('Report submitted successfully!');

      return router.push('/dashboard');
    } catch (error) {
      console.error(error);
      notifyError('Failed to submit report. Please try again.');
      // alert(error instanceof Error ? error + '|' + error.message : 'An unknown error occurred');
      setIsLoading(false);
      return router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ReportFormHeader stepNumber={stepNumber} totalStep={totalSteps} />
      <div className="flex flex-col gap-5 p-2">
        <div className="flex justify-center pb-28" ref={stepTopRef}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl flex flex-col gap-5">
            {stepNumber === 1 && <DeliveryStep register={register} errors={errors} onNext={goNext} />}

            {/**
             * on first render, currentSection is undefined because stepNumber is 1, so the ReportSectionStep component will not be rendered.
             * When the user clicks "Next", stepNumber will increment to 2, and currentSection will be defined as the first section in SECTION_STEPS,
             * causing ReportSectionStep to render with the appropriate props.
             */}
            {currentSection && (
              <ReportSectionStep
                section={currentSection}
                register={register}
                errors={errors}
                isLoading={isLoading}
                isLastStep={isLastStep}
                onBack={goBack}
                onNext={goNext}
              />
            )}
          </form>
        </div>
      </div>
    </>
  );
}

function useReportDraft({ reset, subscribe }: Pick<ReportForm, 'reset' | 'subscribe'>) {
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (!savedDraft) return;

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
  }, [reset]);

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        const { DeliveryScreenShots: _deliveryScreenshots, ...rest } = values;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      },
    });

    return unsubscribe;
  }, [subscribe]);
}

function useStepScroll(stepNumber: number) {
  const stepTopRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = stepTopRef.current;
    if (!el) return;

    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 200,
      behavior: 'auto',
    });
  }, [stepNumber]);

  return stepTopRef;
}

function DeliveryStep({
  register,
  errors,
  onNext,
}: {
  register: UseFormRegister<ReportValuesInput>;
  errors: FieldErrors<ReportValuesInput>;
  onNext: () => void;
}) {
  return (
    <>
      <DeliveryInputs register={register} errors={errors} />
      <StepActions nextLabel="Next" onNext={onNext} />
    </>
  );
}

function DeliveryInputs({
  register,
  errors,
}: {
  register: UseFormRegister<ReportValuesInput>;
  errors: FieldErrors<ReportValuesInput>;
}) {
  const [method, setMethod] = useState<DeliveryMethod>('upload');

  return (
    <section className="border rounded-2xl text-gray-800 border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="px-5 py-3">
        <h2 className="text-black font-medium text-md">
          Deliveries <span className="text-gray-500 text-sm">(Optional)</span>
        </h2>

        <p className="text-gray-600 text-sm">Upload delivery screenshots or enter delivery details manually.</p>
      </div>

      <div className="px-5 py-2">
        <div className="p-1 mt-2 rounded-lg border border-gray-200 bg-gray-100 w-full grid grid-cols-2 gap-6">
          {DELIVERY_METHODS.map(item => {
            const active = method === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setMethod(item)}
                className={`border h-9 rounded-lg cursor-pointer transition-all ${
                  active ? 'bg-white' : 'border-none bg-transparent'
                }`}
              >
                <span className="text-sm font-medium">
                  {item === 'upload' ? 'Upload screenshots' : 'Enter manually'}
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
            <div className="flex flex-col gap-4 items-center">
              <Textarea
                placeholder="Example: Sigma - 12 @ 10:30am, Warehouse - 5 @ 11:00am, etc."
                className="resize-none rounded-md border border-gray-300 p-2 w-full min-h-30"
                {...register('StockUpdate.AdditionalNote')}
              />
            </div>
          </Field>
        )}
      </div>
    </section>
  );
}

function ReportSectionStep({
  section,
  register,
  errors,
  isLoading,
  isLastStep,
  onBack,
  onNext,
}: {
  section: ReportSectionStep;
  register: UseFormRegister<ReportValuesInput>;
  errors: FieldErrors<ReportValuesInput>;
  isLoading: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className={`flex flex-col gap-2 ${isLoading ? 'blur-xs pointer-events-none select-none' : ''}`}>
      <SectionInputs
        fieldArray={section.fieldArray}
        register={register}
        title={section.title}
        errors={errors}
        description={section.description}
        optional={section.optional}
      />

      {isLastStep ? (
        <SubmitStepActions isLoading={isLoading} onBack={onBack} />
      ) : (
        <StepActions backLabel="Previous" nextLabel="Next" onBack={onBack} onNext={onNext} />
      )}
    </div>
  );
}

function StepActions({
  backLabel,
  nextLabel,
  onBack,
  onNext,
}: {
  backLabel?: string;
  nextLabel: string;
  onBack?: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex gap-3">
      {onBack && (
        <Button
          onClick={onBack}
          type="button"
          variant="outline"
          className="flex-1 text-sm transition active:scale-[0.99] border-gray-400"
        >
          <span className="font-semibold">{backLabel}</span>
        </Button>
      )}

      <Button
        onClick={onNext}
        type="button"
        variant="primary"
        className="flex-1 flex items-center justify-center font-medium text-white transition"
      >
        <span className="font-semibold">{nextLabel}</span>
      </Button>
    </div>
  );
}

function SubmitStepActions({ isLoading, onBack }: { isLoading: boolean; onBack: () => void }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col gap-5">
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={onBack}
          type="button"
          disabled={isLoading}
          variant="outline"
          className="flex-1 text-sm transition active:scale-[0.99] border-gray-400"
        >
          <span className="font-semibold">Back</span>
        </Button>
        <Button
          variant="primary"
          disabled={isLoading}
          type="submit"
          className="flex-1 flex items-center justify-center font-medium text-white transition"
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
          You will receive the report summary via Telegram (@JenianBot). Make sure your Telegram account is linked in
          the dashboard.
        </p>
        <p className="text-sm text-gray-600 pt-2">
          Demo accounts do not send reports to Telegram. To test the live Telegram integration, please contact me. You
          will be redirected to the dashboard after submission.
        </p>
      </div>
    </div>
  );
}
