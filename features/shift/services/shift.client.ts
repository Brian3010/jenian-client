import { parseClientApiResponse } from '@/lib/api/client-api';
import { ShiftFormValues } from '../schemas';
import { ShiftSummaryResult } from '../types';

//TODO: will need to format cycleStartDate and cycleEndDate to yyyy-MM-dd format before sending to backend
//TODO: review the shift startTime and endTime to ensure they are in the correct format and timezone before sending to backend

//TODO: convert time format to UTC ISO string before sending to backend, and convert back to local time when receiving from backend
export async function handleShiftSubmit(
  cycleStartDate: string,
  cycleEndDate: string,
  shifts: ShiftFormValues[],
  deletedShiftIds: string[],
): Promise<ShiftSummaryResult> {
  const res = await fetch(`/api/private/shift/bulks?cycleStartDate=${cycleStartDate}&cycleEndDate=${cycleEndDate}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shifts, deletedShiftIds }),
  });

  return await parseClientApiResponse<ShiftSummaryResult>(res, 'Failed to submit shifts');
}

// await handleShiftSubmit(....) - use trycatch block, catch error, and check if error is instance of AppError,
//  then use error.message (can be validation errors from backend) to display the error message to the user.
