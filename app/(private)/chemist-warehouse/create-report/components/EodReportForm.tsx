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
import { NotebookIcon, Upload } from 'lucide-react';
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
    watch,
  } = useForm<ReportValuesInput, unknown, ReportValuesOutput>({
    resolver: zodResolver(reportSchema),
    mode: 'onSubmit',
    defaultValues: {
      DeliveryScreenShots: [],
    },
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
    <div className="w-full min-h-screen pb-36 sm:p-3 flex justify-center ">
      <form onSubmit={handleSubmit(onSubmit)} className="w-4xl mx-auto ">
        {/* Content */}
        <div
          className="flex py-1 hover:cursor-pointer text-sm font-medium"
          onClick={() => router.replace('/dashboard')}
        >
          ← Back
        </div>
        <div className="sm:p-6 space-y-6 pt-5 flex flex-col gap-2">
          <div className={`${isLoading ? 'blur-xs pointer-events-none select-none' : ''}`}>
            {/* Deliveries */}
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

                  <Input type="file" {...register('DeliveryScreenShots')} multiple />
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Delivery result is AI-extracted and may contain errors. Review the final report on Telegram.
                  </div>
                </Field>
              </div>
            </section>

            {/* Stock Updates */}
            {/* <p className="text-sm text-destructive">{errors.stockUpdate?.trolleyOfStock?.message}</p> */}
            <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="border-b px-5 py-3">
                <h2 className="text-black font-medium text-md">Stock Updates</h2>
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
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col gap-5">
            <GradientButton
              disabled={isLoading}
              type="submit"
              className="flex items-center justify-center w-full rounded-2xl text-sm font-medium text-white transition active:scale-[0.99]"
              // className="w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-medium text-white transition active:scale-[0.99]"
            >
              {isLoading ? <Spinner data-icon="inline-start" /> : <span className="font-semibold">Submit</span>}
            </GradientButton>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                You will receive the report summary via Telegram (@JenianBot). Make sure your Telegram account is linked
                in the dashboard.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
