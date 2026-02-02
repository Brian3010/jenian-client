'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldPath, useForm } from 'react-hook-form';
import { z } from 'zod';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);

const ext = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

const PhotoFile = z
  .instanceof(File)
  .refine(f => f.size > 0, { message: 'Empty file' })
  .refine(f => ALLOWED_MIME.has(f.type) || ALLOWED_EXT.has(ext(f.name)), {
    message: 'Invalid file type',
  })
  .refine(f => f.size <= 10 * 1024 * 1024, { message: 'Max 10MB per file' });

const reportSchema = z.object({
  deliverySceenShots: z.array(PhotoFile).min(1, 'Select at least 1 photo').max(10, 'Max 10 photos').optional(),
  stockUpdate: z.object({
    trolleyOfStock: z.coerce.number().max(100, { message: 'Too many trolleys' }),
    stockNote: z.string().max(1000),

    trolleyOfCostmetic: z.coerce.number().max(100, { message: 'Too many trolleys' }),
    cosmeticNote: z.string().max(1000),

    trolleyOffragrance: z.coerce.number().max(100, { message: 'Too many trolleys' }),
    fragranceNote: z.string().max(1000),

    additonalStock: z.string().max(1000),
    // addtionalNote: z.string().max(1000),
  }),
});
/**
 * ✅ Why you got this TypeScript error
 *
 * React Hook Form has TWO “types” involved when you use a resolver:
 *
 * 1) Form INPUT values (what comes from the DOM while typing)
 *    - for <input type="number"> this is still typically a STRING (or "")
 *
 * 2) Resolver OUTPUT values (after Zod parses/coerces/transforms)
 *    - with z.coerce.number(), the OUTPUT becomes a real number
 *
 * When you used z.coerce.number(), Zod’s *input type* for that field is `unknown`
 * (because it can accept many input types), but your useForm generic was:
 *   useForm<ReportValues>(...)
 * where ReportValues = z.infer<typeof schema> (OUTPUT type)
 *
 * So TS sees:
 * - resolver works with input type `unknown` for those number fields
 * - but your form is typed as if those fields are `number` already
 *
 * ✅ Fix: type RHF with both:
 * - INPUT type: z.input<typeof schema>
 * - OUTPUT type: z.output<typeof schema>
 */
type ReportValuesInput = z.input<typeof reportSchema>;
type ReportValuesOutput = z.output<typeof reportSchema>;

type StockUpdateField = {
  itemName: string;
  registerName: FieldPath<ReportValuesInput>;
  inputType: 'number' | 'text';
};

const stockUpdate = [
  { itemName: 'Trolley of stock', registerName: 'stockUpdate.trolleyOfStock', inputType: 'number' },
  { itemName: 'Stock note', registerName: 'stockUpdate.stockNote', inputType: 'text' },
  { itemName: 'Trolley of cosmetic', registerName: 'stockUpdate.trolleyOfCostmetic', inputType: 'number' },
  { itemName: 'Cosmetic note', registerName: 'stockUpdate.cosmeticNote', inputType: 'text' },
  { itemName: 'Trolley of fragrance', registerName: 'stockUpdate.trolleyOffragrance', inputType: 'number' },
  { itemName: 'Fragrance note', registerName: 'stockUpdate.fragranceNote', inputType: 'text' },
  { itemName: 'Additional Stock', registerName: 'stockUpdate.additonalStock', inputType: 'text' },
] satisfies StockUpdateField[];

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
              {/* {errors.stockUpdate && <p className="text-sm text-destructive">{errors.root?.message}</p>} */}
            </div>
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
