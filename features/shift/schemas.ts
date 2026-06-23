import z from 'zod';
import { EmploymentType, ShiftEntryType } from './types';

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const shiftFormSchema = z
  .object({
    id: z.string().optional(),
    workDate: z.iso.date('Please select a valid date'),
    startTime: z.string().regex(timeRegex, 'Please enter a valid start time'),
    endTime: z.string().regex(timeRegex, 'Please enter a valid end time'),
    paidBreak: z.number().min(0, 'Paid break cannot be negative').max(60, 'Paid break cannot exceed 60 minutes'),
    unpaidBreak: z.number().min(0, 'Unpaid break cannot be negative').max(60, 'Unpaid break cannot exceed 60 minutes'),
    entryType: z.enum(ShiftEntryType, {
      message: 'Please select a pay cycle',
    }),
    employmentType: z.enum(EmploymentType, {
      message: 'Please select an employment type',
    }),
  })
  .refine(values => values.endTime > values.startTime, {
    error: 'End time must be after start time',
    path: ['endTime'],
  });

export const EntryTypeOptions: Record<ShiftEntryType, string> = {
  [ShiftEntryType.Worked]: 'Worked',
  [ShiftEntryType.PaidNonWorked]: 'Paid Non-Worked',
  [ShiftEntryType.Leave]: 'Leave',
};

export const EmploymentTypeOptions: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: 'Full-time',
  [EmploymentType.PartTime]: 'Part-time',
  [EmploymentType.Casual]: 'Casual',
};

export type ShiftFormValues = z.infer<typeof shiftFormSchema>;
