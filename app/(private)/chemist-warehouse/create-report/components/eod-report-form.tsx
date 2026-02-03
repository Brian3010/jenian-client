'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { reportSchema, ReportValuesInput, ReportValuesOutput, stockUpdate } from '@/zodSchema/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// ✅ helper to read nested error using the same string path you use for register()
function getByPath<T>(obj: T, path: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj);
}

export default function EodReportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportValuesInput, unknown, ReportValuesOutput>({
    resolver: zodResolver(reportSchema),
    mode: 'onSubmit',
  });

  const onSubmit = (signInData: ReportValuesOutput) => {
    console.log('clicked clicked');
    console.log('🚀 ~ onSubmit ~ signInData:', signInData);
  };
  // console.log({ ...errors.stockUpdate });
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm">
        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 text-sm">
          {/* Stock Updates */}
          {/* <p className="text-sm text-destructive">{errors.stockUpdate?.trolleyOfStock?.message}</p> */}
          <section>
            <h2 className="font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Stock Updates</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stockUpdate.map(item => {
                  const fieldError = getByPath(errors, item.registerName)?.message as string | undefined;
                  console.log('🚀 ~ EodReportForm ~ fieldError:', fieldError);

                  return (
                    <Field key={item.registerName} className="max-w-sm">
                      <FieldLabel className="flex gap-5">{item.itemName}</FieldLabel>
                      <InputGroup>
                        <InputGroupInput {...register(item.registerName)} type={item.inputType} />
                      </InputGroup>
                      {fieldError && <p className="text-sm text-destructive mt-1">{fieldError}</p>}
                    </Field>
                  );
                })}
              </div>
            </div>
          </section>

          {/*Night Task*/}
          <section>
            <h2 className="font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Night Tasks</h2>

            {/* Off Locations */}
          </section>
          <div>
            <Button type="submit" className="w-25">
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
