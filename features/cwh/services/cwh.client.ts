import { EodReportResponse, ReportValuesOutput } from '@/features/cwh/types';
import { parseClientApiResponse } from '@/lib/api/client-api';

type FormReportT = ReportValuesOutput;

/**
 * Builds and submits the end-of-day report payload.
 *
 * Image uploads are compressed before being added to the request. Selected
 * nested report sections are flattened into dot-notated FormData keys before
 * the payload is posted to the CWH end-of-day report endpoint.
 */
export async function handleReport(formReport: FormReportT) {
  const sections: Array<keyof FormReportT> = ['GeneralCheck', 'AislesFacing', 'StockUpdate', 'NightTasks', 'Cleaning'];

  const formData = new FormData();

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

  if (formReport.AdditionalTasks) {
    formData.append('AdditionalTasks', formReport.AdditionalTasks);
  }

  for (const key of sections) {
    const value = formReport[key];
    if (value && typeof value === 'object') {
      flattenAppend(formData, key, value as Record<string, unknown>);
    }
  }

  const res = await fetch('/api/private/cwh/eod-report', {
    method: 'POST',
    body: formData,
  });

  return parseClientApiResponse<EodReportResponse>(res, 'Failed to submit report');
}

/**
 * Appends an object's values to FormData using dot notation for nested keys.
 *
 * Null and undefined values are ignored. Nested non-array objects are flattened
 * recursively. All final values are converted to strings before being appended.
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

/**
 * Compresses an image file by resizing it to fit within the configured maximum
 * dimensions and encoding it as the requested output type.
 *
 * Non-image files are returned unchanged.
 */
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

/**
 * Loads an image from a URL and resolves once the browser has decoded enough
 * of the image to expose its dimensions.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Converts a canvas into a Blob using the requested MIME type and quality.
 *
 * Rejects if the browser fails to produce a Blob.
 */
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

/**
 * Calculates dimensions that fit within the provided bounds while preserving
 * the original aspect ratio.
 *
 * Images already within the bounds keep their original dimensions.
 */
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

/**
 * Replaces a filename's extension, or appends one when the filename has no
 * extension.
 */
function replaceFileExtension(filename: string, newExt: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return `${filename}.${newExt}`;
  }
  return `${filename.slice(0, lastDot)}.${newExt}`;
}
