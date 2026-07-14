import { parseClientApiResponse } from '@/lib/api/client-api';
import { ShiftFormValues } from '../schemas';
import { ShiftSummaryResult } from '../types';

export async function handleShiftSubmit(shifts: ShiftFormValues[]): Promise<ShiftSummaryResult> {
  const res = await fetch('/api/private/shift/bulks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shifts),
  });

  return await parseClientApiResponse<ShiftSummaryResult>(res, 'Failed to submit shifts');
}

// await handleShiftSubmit(....) - use trycatch block, catch error, and check if error is instance of AppError,
//  then use error.message (can be validation errors from backend) to display the error message to the user.
