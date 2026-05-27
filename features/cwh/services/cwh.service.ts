import { ReportValuesOutput } from '@/features/cwh/types';

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
    const compressedFile = await compressImage(file, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.75,
      outputType: 'image/jpeg',
    });

    console.log(
      `compressed: ${file.name} ${Math.round(file.size / 1024)}KB -> ${Math.round(compressedFile.size / 1024)}KB`,
    );

    formData.append('DeliveryScreenShots', compressedFile);
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
  const res = await fetch('/api/private/cwh/CWH/eod-report', {
    method: 'POST',
    body: formData,
  });

  const contentType = res.headers.get('content-type') || '';
  const raw = await res.text();

  console.log('status =', res.status);
  console.log('content-type =', contentType);
  console.log('raw response =', raw);

  let message: unknown = raw;

  if (contentType.includes('application/json')) {
    try {
      message = JSON.parse(raw);
    } catch (e) {
      console.error('JSON parse failed:', e);
    }
  }

  return {
    message: typeof message === 'string' ? message : JSON.stringify(message),
    status: res.status,
  };
}

async function compressImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    outputType?: 'image/jpeg' | 'image/webp';
  },
): Promise<File> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.75, outputType = 'image/jpeg' } = options || {};

  if (!file.type.startsWith('image/')) {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(imageUrl);

    const { width, height } = getScaledDimensions(
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      maxWidth,
      maxHeight,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, outputType, quality);
    const ext = outputType === 'image/webp' ? 'webp' : 'jpg';
    const outputName = replaceFileExtension(file.name, ext);

    return new File([blob], outputName, {
      type: outputType,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Failed to compress image'));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function getScaledDimensions(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number) {
  const width = originalWidth;
  const height = originalHeight;

  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function replaceFileExtension(filename: string, newExt: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return `${filename}.${newExt}`;
  }
  return `${filename.slice(0, lastDot)}.${newExt}`;
}
