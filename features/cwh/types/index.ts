import { FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { reportSchema } from '../schemas';

export type ReportValuesInput = z.input<typeof reportSchema>;
export type ReportValuesOutput = z.output<typeof reportSchema>;

export type StockUpdateField = {
  itemName: string;
  registerName: FieldPath<ReportValuesInput>;
  inputType: 'number' | 'text';
  helpText?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
};

/**
 * server response types
 */
export type EodReportResponse = {
  reportId: string;
};
