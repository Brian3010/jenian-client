import { stockUpdate } from '@/features/cwh/constants';
import React from 'react';
import InputFieldAndError, { InputFieldAndErrorProps } from './InputFieldAndError';

export type SectionInputsProps = InputFieldAndErrorProps & { title?: string; description?: string; optional?: boolean };

export default function SectionInputs({
  fieldArray,
  register,
  errors,
  title,
  description,
  optional = false,
}: SectionInputsProps) {
  return (
    <section className="border rounded-2xl text-gray-800  border-gray-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className={`border-b px-5 py-3 ${optional ? 'flex justify-between items-center' : 'pb-3'}`}>
        {title && <h2 className="text-black font-medium text-md">{title}</h2>}
        {optional && <p className="text-muted-foreground text-sm">Optional</p>}
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      <div className={`px-5 py-3 grid ${fieldArray === stockUpdate ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-4`}>
        <InputFieldAndError fieldArray={fieldArray} register={register} errors={errors} />
      </div>
    </section>
  );
}
