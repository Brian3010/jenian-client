import { FieldPath } from 'react-hook-form';
import { z } from 'zod';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);

const ext = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

const PhotoFile = z
  .instanceof(File)
  .refine(f => f.size > 0, { message: 'Empty file' })
  .refine(f => ALLOWED_MIME.has(f.type) || ALLOWED_EXT.has(ext(f.name)), {
    message: 'Invalid file type',
  })
  .refine(f => f.size <= 10 * 1024 * 1024, { message: 'Max 10MB per file' });

export const reportSchema = z.object({
  deliverySceenShots: z.array(PhotoFile).min(1, 'Select at least 1 photo').max(10, 'Max 10 photos').optional(),
  stockUpdate: z.object({
    trolleyOfStock: z.coerce.number().max(100, { message: 'Too many trolleys' }),
    stockNote: z.string().max(1000),

    trolleyOfCostmetic: z.coerce.number().max(100, { message: 'Too many trolleys' }),
    cosmeticNote: z.string().max(1000),

    trolleyOffragrance: z.coerce.number().max(100, { message: 'Too many trolleys' }),
    fragranceNote: z.string().max(1000),

    additonalStock: z.string().max(1000),
    // addtionalNote: z.string().max(1000),
  }),
  nightTasks: z.object({
    OffLocations: z.object({
      dispLedge: z.string().max(1000),
      gondolas: z.string().max(1000),
      mesh: z.string().max(1000),
      tills: z.string().max(1000),
      clipStrip: z.string().max(1000),
      podiums: z.string().max(1000),
      lowLevel: z.string().max(1000),
      floorStack: z.string().max(1000),
      topSellers: z.string().max(1000),
      batwings: z.string().max(1000),
      sunglasses: z.string().max(1000),
      catalogue: z.string().max(1000),
    }),

    ailesFacing: z.object({
      frontCounter: z.string().max(1000),
      femHyg: z.string().max(1000),
      haircare: z.string().max(1000),
      skincare: z.string().max(1000),
      vitamins: z.string().max(1000),
      psa: z.string().max(1000),
      backwall: z.string().max(1000),
      sportsNutrition: z.string().max(1000),
      babyFirstAid: z.string().max(1000),
      cosmetics: z.string().max(1000),
      fragrances: z.string().max(1000),
    }),
  }),
});

export type ReportValuesInput = z.input<typeof reportSchema>;
export type ReportValuesOutput = z.output<typeof reportSchema>;
export type StockUpdateField = {
  itemName: string;
  registerName: FieldPath<ReportValuesInput>;
  inputType: 'number' | 'text';
};

export const stockUpdate = [
  { itemName: 'Trolley of stock', registerName: 'stockUpdate.trolleyOfStock', inputType: 'number' },
  { itemName: 'Stock note', registerName: 'stockUpdate.stockNote', inputType: 'text' },
  { itemName: 'Trolley of cosmetic', registerName: 'stockUpdate.trolleyOfCostmetic', inputType: 'number' },
  { itemName: 'Cosmetic note', registerName: 'stockUpdate.cosmeticNote', inputType: 'text' },
  { itemName: 'Trolley of fragrance', registerName: 'stockUpdate.trolleyOffragrance', inputType: 'number' },
  { itemName: 'Fragrance note', registerName: 'stockUpdate.fragranceNote', inputType: 'text' },
  { itemName: 'Additional Stock', registerName: 'stockUpdate.additonalStock', inputType: 'text' },
] satisfies StockUpdateField[];
