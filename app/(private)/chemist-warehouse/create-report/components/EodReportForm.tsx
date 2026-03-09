'use client';

import { useNotifications } from '@/components/notifications/NotificationContext';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputFieldAndError from './InputFieldAndError';

export default function EodReportForm() {
  const { notifySuccess, notifyError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportValuesInput, unknown, ReportValuesOutput>({
    resolver: zodResolver(reportSchema),
    mode: 'onSubmit',
  });

  const router = useRouter();

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
        notifySuccess('Report submitted successfully!');
        return router.push('/chemist-warehouse');
      }
      // proxy will return message = Unauthorized when refreshtoken not detected
      if (data.message === 'Unauthorized' || data.status === 401) return router.push('/sign-in');
    } catch (error) {
      console.error(error);
      notifyError('Failed to submit report. Please try again.');
      alert(error instanceof Error ? error + '|' + error.message : 'An unknown error occurred');
      setIsLoading(false);
      return router.push('/chemist-warehouse');
    }
  };

  return (
    <div className="min-h-screen pb-36 sm:p-3 flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-4xl mx-auto">
        {/* Content */}
        <div className="flex justify-end py-1 px-3 underline" onClick={() => router.replace('/chemist-warehouse')}>
          go back
        </div>
        <div className="p-2 sm:p-6 space-y-6 text-sm flex flex-col gap-2">
          <section>
            <h2 className="text-gray-700 font-medium text-lg border-b border-black">Deliveries</h2>
            <div className="pt-4">
              <Field>
                {errors.DeliveryScreenShots && (
                  <p className="text-sm text-destructive mt-1">{errors.DeliveryScreenShots.message}</p>
                )}

                <FieldLabel></FieldLabel>
                <Input type="file" {...register('DeliveryScreenShots')} multiple />
                <FieldDescription>Upload your delivery screenshot, I&apos;ll take care of the rest 🤓</FieldDescription>
                <FieldDescription className="italic">
                  * Delivery result is AI-extracted and may contain errors. Review the final report on Telegram.
                </FieldDescription>
              </Field>
            </div>
          </section>
          {/* Stock Updates */}
          {/* <p className="text-sm text-destructive">{errors.stockUpdate?.trolleyOfStock?.message}</p> */}

          <section>
            <h2 className="text-gray-700 font-medium text-lg border-b border-black">Stock Updates</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                <InputFieldAndError fieldArray={stockUpdate} register={register} errors={errors} />
              </div>
            </div>
          </section>
          {/*Night Task*/}
          <section>
            <h2 className="text-gray-700 font-medium text-lg border-b border-black">Night Tasks</h2>

            {/* Off Locations */}
            <div className="py-4">
              <h3 className="text-gray-700 font-bold pb-4">Off Locations (Fill & Face) @ 8.00pm</h3>
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

            {/* Off Aisles (Fill & Face) */}
            <div className="py-4">
              <h3 className="text-gray-700 font-bold pb-4">Aisles (Fill & Face) @ 8.00pm</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <InputFieldAndError fieldArray={ailesFacing} register={register} errors={errors} />
                </div>
              </div>
            </div>
          </section>

          {/*Cleaning*/}
          <section>
            <h2 className="text-gray-700 font-medium text-lg border-b border-black">Cleaning</h2>
            <div className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InputFieldAndError fieldArray={cleaning} register={register} errors={errors} />
              </div>
            </div>
          </section>
          {/*General check*/}
          <section>
            <h2 className="text-gray-700 font-medium text-lg border-b border-black">General checks</h2>
            <div className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InputFieldAndError fieldArray={generalCheck} register={register} errors={errors} />
              </div>
            </div>
          </section>
          <div>
            <Button disabled={isLoading} type="submit" className="w-25">
              {isLoading && <Spinner data-icon="inline-start" />}
              Submit
            </Button>

            <p className="text-sm italic pt-3">
              You will receive the report summary via Telegram (@JenianBot), make sure you have linked your Telegram
              account in the Chemist Warehouse dashboard to receive it. If you have any issues, please contact support.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
