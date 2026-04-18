import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { getByPath } from '@/lib/utils';
import { ReportValuesInput, StockUpdateField } from '@/zodSchema/schemas';
import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

export type InputFieldAndErrorProps = {
  fieldArray: StockUpdateField[];
  register: UseFormRegister<ReportValuesInput>;
  errors: FieldErrors<ReportValuesInput>;
};

export default function InputFieldAndError({ fieldArray, register, errors }: InputFieldAndErrorProps) {
  return fieldArray.map(item => {
    const fieldError = getByPath(errors, item.registerName)?.message as string | undefined;
    // if (item.registerName === 'StockUpdate.AdditionalStock' || item.registerName === 'StockUpdate.AdditionalNote') {
    if (item.registerName === 'StockUpdate.AdditionalStock' || item.registerName === 'AdditionalTasks') {
      return (
        <Field key={item.registerName} className="flex-col items-center gap-1 text-base pb-4">
          <FieldLabel className="text-gray-700 w-44 sm:w-52">{item.itemName}</FieldLabel>
          <Textarea
            className="py-2 rounded-xl h-32 resize-none"
            {...register(item.registerName)}
            placeholder={item.helpText}
          />
          {fieldError && <p className="text-sm text-destructive mt-1">{fieldError}</p>}
        </Field>
      );
    }

    return (
      <Field key={item.registerName} className="flex-col items-center gap-1 text-base pb-4">
        <FieldLabel className="text-gray-700 w-44 sm:w-52">{item.itemName}</FieldLabel>
        <InputGroup className="py-5 rounded-xl">
          <InputGroupInput
            {...register(item.registerName)}
            type={item.inputType}
            placeholder={item.helpText}
            inputMode={item.inputMode}
          />
        </InputGroup>
        {fieldError && <p className="text-sm text-destructive mt-1">{fieldError}</p>}
      </Field>
    );
  });
}
