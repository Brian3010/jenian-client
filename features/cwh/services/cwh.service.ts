import { ReportValuesOutput } from '@/zodSchema/schemas';

type FormReportT = ReportValuesOutput;

/**
 * helper function to flatten the object and append to formData, for example: { GeneralCheck: { FreeTrolleys: 'string', NumOfClickCollect: 2 } }
 * will be flattened to GeneralCheck.FreeTrolleys: 'string', GeneralCheck.NumOfClickCollect: 2
 * the prefix is the parent key, for example: GeneralCheck, AislesFacing, StockUpdate etc.
 * if the value is an object, recursively call the function until the value is not an object, then append to formData
 * if the value is an array, append each item in the array with the same key, for example: DeliveryScreenShots: File[]
 * if the value is a file, append to formData directly
 * if the value is null or undefined, skip
 * if the value is a primitive type, append to formData directly
 * example input: { GeneralCheck: { FreeTrolleys: 'string', NumOfClickCollect: 2 }, AislesFacing: { FrontCounter: 'string' }, DeliveryScreenShots: File[] }
 * example output in formData: GeneralCheck.FreeTrolleys: 'string', GeneralCheck.NumOfClickCollect: 2, AislesFacing.FrontCounter: 'string', DeliveryScreenShots: File[]
 * after fd.append(`${prefix}.${k}`, String(v));` the loop will continue to the next iteration, so if the value is an object, it will be flattened and appended to formData
 * , then continue to the next key in the object
 *
 */
function flattenAppend(fd: FormData, prefix: string, obj: Record<string, unknown>) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;

    if (typeof v === 'object' && !(v instanceof Blob) && !Array.isArray(v)) {
      flattenAppend(fd, `${prefix}.${k}`, v as Record<string, unknown>);
      continue;
    }

    fd.append(`${prefix}.${k}`, String(v));
  }
}

/** handleReport is responsible for handling the report form submission, it will format the form data to match what BFF expects, then send a POST request to the BFF endpoint /api/private/cwh/CWH/eod-report
 * the form data will be formatted to match what BFF expects, for example: GeneralCheck.FreeTrolleys, GeneralCheck.NumOfClickCollect etc.
 * the form data will be sent as FormData, because it includes file uploads, and the BFF is expecting FormData
 * the function will return the response from the BFF, which includes the status and message, if the status is 401, it means the user is unauthorized, and should be redirected to the sign-in page
 */
export async function handleReport(formReport: FormReportT) {
  const sections: Array<keyof FormReportT> = ['GeneralCheck', 'AislesFacing', 'StockUpdate', 'NightTasks', 'Cleaning'];

  const formData = new FormData();

  // handle file uploads, the key is DeliveryScreenShots, the value is File[]
  const files = Array.from(formReport.DeliveryScreenShots ?? []);
  for (const file of files) {
    formData.append('DeliveryScreenShots', file);
  }

  // handle AdditionalTasks, if it exists, the key is AdditionalTasks, the value is string
  if (formReport.AdditionalTasks) {
    formData.append('AdditionalTasks', formReport.AdditionalTasks);
  }

  // loop through the sections, if the value is an object, flatten it and append to formData
  for (const key of sections) {
    const value = formReport[key];
    if (value && typeof value === 'object') {
      flattenAppend(formData, key, value as Record<string, unknown>);
    }
  }

  console.log('🚀 ~ handleReport ~ formData:', { ...formData });

  // send the formData to the BFF endpoint
  try {
    const res = await fetch('/api/private/cwh/CWH/eod-report', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return { message: data, status: res.status };
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}
