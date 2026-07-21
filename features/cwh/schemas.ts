import { z } from 'zod';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);

const ext = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

const isAllowed = (file: File) => ALLOWED_MIME.has(file.type) || ALLOWED_EXT.has(ext(file.name));

const MAX_SIZE = 10 * 1024 * 1024;

const deliveryScreenshotsSchema = z.preprocess(
  val => (val instanceof FileList ? Array.from(val) : val),
  z
    .array(z.instanceof(File))
    .max(10, 'Max 10 photos')
    .refine(files => files.every(f => f.size > 0), 'Empty file')
    .refine(files => files.every(f => isAllowed(f)), 'Invalid file type')
    .refine(files => files.every(f => f.size <= MAX_SIZE), 'Max 10MB per file'),
);

const countOutOfTotalTextSchema = z
  .string()
  .regex(/^\d+\s*\/\s*\d+(?:\s+.+)?$/, 'Use format like 12/14 or 12/14 notes')
  .refine(value => {
    const match = value.match(/^(\d+)\s*\/\s*(\d+)/);

    if (!match) {
      return false;
    }

    const current = Number(match[1]);
    const total = Number(match[2]);

    return current <= total;
  }, 'The first number cannot be greater than the second number');

export const reportSchema = z.object({
  DeliveryScreenShots: deliveryScreenshotsSchema,
  StockUpdate: z
    .object({
      AdditionalStock: z.string().max(1000).optional(),
      AdditionalNote: z.string().max(1000).optional(),
    })
    .optional(),
  NightTasks: z
    .object({
      DispLedge: z.string().max(1000).optional(),
      Gondolas: z.string().max(1000).optional(),
      Mesh: z.string().max(1000).optional(),
      Tills: z.string().max(1000).optional(),
      ClipStrips: z.string().max(1000).optional(),
      Podiums: z.string().max(1000).optional(),
      LowLevel: z.string().max(1000).optional(),
      FloorStack: z.string().max(1000).optional(),
      TopSellers: z.string().max(1000).optional(),
      BatWings: z.string().max(1000).optional(),
      Sunglasses: z.string().max(1000).optional(),
      Catalogue: z.string().max(1000).optional(),
    })
    .optional(),

  AislesFacing: z
    .object({
      FrontCounter: z.string().max(1000).optional(),
      FemHygSummer: z.string().max(1000).optional(),
      Haircare: z.string().max(1000).optional(),
      Skincare: z.string().max(1000).optional(),
      Vitamins: z.string().max(1000).optional(),
      PSA: z.string().max(1000).optional(),
      Backwall: z.string().max(1000).optional(),
      SportNutritions: z.string().max(1000).optional(),
      BabyFirstAid: z.string().max(1000).optional(),
      Cosmetics: z.string().max(1000).optional(),
      Fragrances: z.string().max(1000).optional(),
    })
    .optional(),

  Cleaning: z
    .object({
      BinRun: z.string().max(1000).optional(),
      Sweeping: z.string().max(1000).optional(),
      TeaRoom: z.string().max(1000).optional(),
      ConsultingRoom: z.string().max(1000).optional(),
    })
    .optional(),

  // preprocess empty string to '0' for these fields, because the input type is text, but we want to store it as number in the backend, and the backend will treat empty string as 0
  GeneralCheck: z.object({
    FreeTrolleys: countOutOfTotalTextSchema,
    FreeCages: countOutOfTotalTextSchema,
    // freeCagesNote: z.string().max(1000).optional(),
    NumOfClickCollect: z.coerce.number().optional(),
    NumOfCataBundle: z.coerce.number().optional(),
    NumOfMagaBundle: z.coerce.number().optional(),
    NumOfMyPals: countOutOfTotalTextSchema,
    NumOfFragKeys: countOutOfTotalTextSchema,
    NumOfLiftPasses: countOutOfTotalTextSchema,
    NumOfAugmodos: countOutOfTotalTextSchema,
  }),
  AdditionalTasks: z.string().max(5000).optional(),
});
