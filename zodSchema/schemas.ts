import { FieldPath } from 'react-hook-form';
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
    .min(1, 'Select at least 1 photo')
    .max(10, 'Max 10 photos')
    .refine(files => files.every(f => f.size > 0), 'Empty file')
    .refine(files => files.every(f => isAllowed(f)), 'Invalid file type')
    .refine(files => files.every(f => f.size <= MAX_SIZE), 'Max 10MB per file'),
);

export const reportSchema = z.object({
  deliverySceenShots: deliveryScreenshotsSchema,
  stockUpdate: z
    .object({
      trolleyOfStock: z.coerce.number().max(100, { message: 'Too many trolleys' }).optional(),
      stockNote: z.string().max(1000),

      trolleyOfCostmetic: z.coerce.number().max(100, { message: 'Too many trolleys' }).optional(),
      cosmeticNote: z.string().max(1000),

      trolleyOffragrance: z.coerce.number().max(100, { message: 'Too many trolleys' }).optional(),
      fragranceNote: z.string().max(1000).optional(),

      additonalStock: z.string().max(1000).optional(),
      // addtionalNote: z.string().max(1000),
    })
    .optional(),
  nightTasks: z
    .object({
      dispLedge: z.string().max(1000).optional(),
      gondolas: z.string().max(1000).optional(),
      mesh: z.string().max(1000).optional(),
      tills: z.string().max(1000).optional(),
      clipStrip: z.string().max(1000).optional(),
      podiums: z.string().max(1000).optional(),
      lowLevel: z.string().max(1000).optional(),
      floorStack: z.string().max(1000).optional(),
      topSellers: z.string().max(1000).optional(),
      batwings: z.string().max(1000).optional(),
      sunglasses: z.string().max(1000).optional(),
      catalogue: z.string().max(1000).optional(),
    })
    .optional(),

  ailesFacing: z
    .object({
      frontCounter: z.string().max(1000).optional(),
      femHyg: z.string().max(1000).optional(),
      haircare: z.string().max(1000).optional(),
      skincare: z.string().max(1000).optional(),
      vitamins: z.string().max(1000).optional(),
      psa: z.string().max(1000).optional(),
      backwall: z.string().max(1000).optional(),
      sportsNutrition: z.string().max(1000).optional(),
      babyFirstAid: z.string().max(1000).optional(),
      cosmetics: z.string().max(1000).optional(),
      fragrances: z.string().max(1000).optional(),
    })
    .optional(),

  cleaning: z
    .object({
      binRun: z.string().max(1000).optional(),
      sweeping: z.string().max(1000).optional(),
      teaRoom: z.string().max(1000).optional(),
      consultingRoom: z.string().max(1000).optional(),
    })
    .optional(),

  generalCheck: z
    .object({
      freeTrolleys: z.string().max(1000).optional(),
      freeCages: z.string().max(1000).optional(),
      freeCagesNote: z.string().max(1000).optional(),
      clickCollect: z.string().max(1000).optional(),
      catalogueBundles: z.string().max(1000).optional(),
      magazineBundles: z.string().max(1000).optional(),
      myPals: z.string().max(1000).optional(),
      fragranceKeys: z.string().max(1000).optional(),
      liftPasses: z.string().max(1000).optional(),
      augmodo: z.string().max(1000).optional(),
    })
    .optional(),

  additionalTasks: z.string().max(5000).optional(),
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

export const nightTasks = [
  { itemName: 'Disp ledge/Pods/Mesh', registerName: 'nightTasks.dispLedge', inputType: 'text' },
  { itemName: 'Gondolas', registerName: 'nightTasks.gondolas', inputType: 'text' },
  { itemName: 'Mesh', registerName: 'nightTasks.mesh', inputType: 'text' },
  { itemName: 'Tills', registerName: 'nightTasks.tills', inputType: 'text' },
  { itemName: 'Clip Strip', registerName: 'nightTasks.clipStrip', inputType: 'text' },
  { itemName: 'Podiums', registerName: 'nightTasks.podiums', inputType: 'text' },
  { itemName: 'Low level', registerName: 'nightTasks.lowLevel', inputType: 'text' },
  { itemName: 'Floor Stack', registerName: 'nightTasks.floorStack', inputType: 'text' },
  { itemName: 'Top Sellers', registerName: 'nightTasks.topSellers', inputType: 'text' },
  { itemName: 'Batwings', registerName: 'nightTasks.batwings', inputType: 'text' },
  { itemName: 'Sunglasses', registerName: 'nightTasks.sunglasses', inputType: 'text' },
  { itemName: 'Catalogue', registerName: 'nightTasks.catalogue', inputType: 'text' },
] satisfies StockUpdateField[];

export const ailesFacing = [
  { itemName: 'Front Counter', registerName: 'ailesFacing.frontCounter', inputType: 'text' },
  { itemName: 'Fem Hyg, House, Summer', registerName: 'ailesFacing.femHyg', inputType: 'text' },
  { itemName: 'Haircare', registerName: 'ailesFacing.haircare', inputType: 'text' },
  { itemName: 'Skincare', registerName: 'ailesFacing.skincare', inputType: 'text' },
  { itemName: 'Vitamins', registerName: 'ailesFacing.vitamins', inputType: 'text' },
  { itemName: 'PSA', registerName: 'ailesFacing.psa', inputType: 'text' },
  { itemName: 'Backwall', registerName: 'ailesFacing.backwall', inputType: 'text' },
  { itemName: 'Sports Nutrition', registerName: 'ailesFacing.sportsNutrition', inputType: 'text' },
  { itemName: 'Baby/First Aid', registerName: 'ailesFacing.babyFirstAid', inputType: 'text' },
  { itemName: 'Cosmetics', registerName: 'ailesFacing.cosmetics', inputType: 'text' },
  { itemName: 'Fragrances', registerName: 'ailesFacing.fragrances', inputType: 'text' },
] satisfies StockUpdateField[];

export const cleaning = [
  { itemName: 'Bin Run', registerName: 'cleaning.binRun', inputType: 'text' },
  { itemName: 'Sweeping', registerName: 'cleaning.sweeping', inputType: 'text' },
  { itemName: 'Tea Room', registerName: 'cleaning.teaRoom', inputType: 'text' },
  { itemName: 'Consulting room', registerName: 'cleaning.consultingRoom', inputType: 'text' },
] satisfies StockUpdateField[];

export const generalCheck = [
  { itemName: 'Free Trolleys', registerName: 'generalCheck.freeTrolleys', inputType: 'text' },
  { itemName: 'Free Cages', registerName: 'generalCheck.freeCages', inputType: 'text' },
  { itemName: '# of Outstanding Click & Collect', registerName: 'generalCheck.clickCollect', inputType: 'text' },
  { itemName: '# of Catalogue Bundles', registerName: 'generalCheck.catalogueBundles', inputType: 'text' },
  { itemName: '# of Magazine Bundles', registerName: 'generalCheck.magazineBundles', inputType: 'text' },
  { itemName: 'My Pals on charge', registerName: 'generalCheck.myPals', inputType: 'text' },
  { itemName: 'Fragrance keys on security desk', registerName: 'generalCheck.fragranceKeys', inputType: 'text' },
  { itemName: 'Lift Passes in dispensary', registerName: 'generalCheck.liftPasses', inputType: 'text' },
  { itemName: 'Augmodo in store room', registerName: 'generalCheck.augmodo', inputType: 'text' },
] satisfies StockUpdateField[];
