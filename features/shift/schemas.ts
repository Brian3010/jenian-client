import z from 'zod';

const timeRegex = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(am|pm)$/i;

export const shiftFormSchema = z
  .object({
    workDate: z.iso.date('Please select a valid date'),
    startTime: z.string().regex(timeRegex, 'Please enter a valid start time'),
    endTime: z.string().regex(timeRegex, 'Please enter a valid end time'),
    paidBreak: z.number().min(0, 'Paid break cannot be negative').max(60, 'Paid break cannot exceed 60 minutes'),
    unpaidBreak: z.number().min(0, 'Unpaid break cannot be negative').max(60, 'Unpaid break cannot exceed 60 minutes'),
    entryType: z.literal(['Worked', 'Paid Non-Worked', 'Leave']),
    employmentType: z.enum(['Full-Time', 'Part-Time', 'Casual']),
  })
  .refine(values => values.endTime > values.startTime, {
    error: 'End time must be after start time',
    path: ['endTime'],
  });

export type ShiftFormValues = z.infer<typeof shiftFormSchema>;
