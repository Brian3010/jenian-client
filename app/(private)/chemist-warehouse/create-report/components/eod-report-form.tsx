'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
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
    trolleyOfStock: z
      .string()
      .max(1000)
      .regex(/^\s*(\d+)\s*-\s*(.+?)\s*$/, 'Must match "number - text" (e.g. "12 - hello")'),
    trolleyOfCostmetic: z.string().max(1000),
    trolleyOffragrance: z.string().max(1000),
    additonalStock: z.string().max(1000),
    addtionalNote: z.string().max(1000),
  }),
});

type ReportValues = z.infer<typeof reportSchema>;

type StockUpdateField = {
  itemName: string;
  registerName: FieldPath<ReportValues>;
};

const stockUpdate = [
  { itemName: 'Trolley of stock', registerName: 'stockUpdate.trolleyOfStock' },
  { itemName: 'Trolley of cosmetic', registerName: 'stockUpdate.trolleyOfCostmetic' },
  { itemName: 'Trolley of fragrance', registerName: 'stockUpdate.trolleyOffragrance' },
  { itemName: 'Additional Stock', registerName: 'stockUpdate.additonalStock' },
  { itemName: 'Additional Note', registerName: 'stockUpdate.addtionalNote' },
] satisfies StockUpdateField[];

export default function EodReportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportValues>({
    resolver: zodResolver(reportSchema),
    // defaultValues: {
    //   stockUpdate: {
    //     trolleyOfStock: "hello"
    //   },
    // },
    mode: 'onSubmit',
  });

  const onSubmit = (signInData: ReportValues) => {
    console.log('clicked clicked');
    console.log('🚀 ~ onSubmit ~ signInData:', signInData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm">
        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 text-sm">
          {/* Stock Updates */}
          <p>{errors.stockUpdate?.trolleyOfStock?.message}</p>
          <section>
            <h2 className="font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Stock Updates</h2>
            <div className="space-y-3">
              {stockUpdate.map((item, k) => (
                <Field key={k} className="max-w-sm">
                  <FieldLabel>{item.itemName}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...register(item.registerName)} placeholder="number - note if you have" />
                  </InputGroup>
                </Field>
              ))}
              {/* <Field className="max-w-sm">
                <FieldLabel>Trolley of stock</FieldLabel>
                <InputGroup>
                  <InputGroupInput {...register('stockUpdate.trolleyOfStock')} />
                </InputGroup>
              </Field>
              <Field className="max-w-sm">
                <FieldLabel>Trolley of cosmetic</FieldLabel>
                <InputGroup>
                  <InputGroupInput {...register('stockUpdate.trolleyOfCostmetic')} />
                </InputGroup>
              </Field> */}
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
