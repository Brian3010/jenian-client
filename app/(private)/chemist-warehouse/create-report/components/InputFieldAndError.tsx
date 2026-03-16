import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { getByPath } from '@/lib/utils';
import { ReportValuesInput, StockUpdateField } from '@/zodSchema/schemas';
import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

export default function InputFieldAndError({
  fieldArray,
  register,
  errors,
}: {
  fieldArray: StockUpdateField[];
  register: UseFormRegister<ReportValuesInput>;
  errors: FieldErrors<ReportValuesInput>;
}) {
  return fieldArray.map(item => {
    const fieldError = getByPath(errors, item.registerName)?.message as string | undefined;

    return (
      <Field key={item.registerName} className="flex-col items-center gap-2 text-base">
        <FieldLabel className="text-gray-700 w-44 sm:w-52">{item.itemName}</FieldLabel>
        <InputGroup>
          <InputGroupInput {...register(item.registerName)} type={item.inputType} placeholder={item.helpText} />
        </InputGroup>
        {fieldError && <p className="text-sm text-destructive mt-1">{fieldError}</p>}
      </Field>
    );
  });
}
