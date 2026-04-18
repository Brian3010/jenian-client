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
    .max(10, 'Max 10 photos')
    .refine(files => files.every(f => f.size > 0), 'Empty file')
    .refine(files => files.every(f => isAllowed(f)), 'Invalid file type')
    .refine(files => files.every(f => f.size <= MAX_SIZE), 'Max 10MB per file'),
);

export const reportSchema = z.object({
  DeliveryScreenShots: deliveryScreenshotsSchema,
  StockUpdate: z
    .object({
      // TrolleyOfStock: z.coerce.number().max(100, { message: 'Too many trolleys' }).optional(),
      // StockNote: z.string().max(1000),

      // TrolleyOfCosmetics: z.coerce.number().max(100, { message: 'Too many trolleys' }).optional(),
      // CosmeticNote: z.string().max(1000),

      // TrolleyofFragrances: z.coerce.number().max(100, { message: 'Too many trolleys' }).optional(),
      // FragranceNote: z.string().max(1000).optional(),

      AdditionalStock: z.string().max(1000).optional(),
      // AdditionalNote: z.string().max(1000),
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
    FreeTrolleys: z.coerce.number().max(50, { message: 'Seems lots of trolleys here!' }),
    FreeCages: z.coerce.number().max(50, { message: 'Seems lots of cages here!' }),
    // freeCagesNote: z.string().max(1000).optional(),
    NumOfClickCollect: z.coerce.number().optional(),
    NumOfCataBundle: z.coerce.number().optional(),
    NumOfMagaBundle: z.coerce.number().optional(),
    NumOfMyPals: z.coerce.number().max(50, { message: 'Seems lots of MyPals here!' }),
    NumOfFragKeys: z.coerce.number().max(50, { message: 'Seems lots of keys here!' }),
    NumOfLiftPasses: z.coerce.number().max(50, { message: 'Seems lots of lift keys here!' }),
    NumOfAugmodos: z.coerce.number().max(50, { message: 'Seems lots of Augmodos here!' }),
  }),
  AdditionalTasks: z.string().max(5000).optional(),
});

export type ReportValuesInput = z.input<typeof reportSchema>;
export type ReportValuesOutput = z.output<typeof reportSchema>;
export type StockUpdateField = {
  itemName: string;
  registerName: FieldPath<ReportValuesInput>;
  inputType: 'number' | 'text';
  helpText?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
};

export const additionalTasks = [
  {
    itemName: '',
    registerName: 'AdditionalTasks',
    inputType: 'text',
    helpText: 'E.g. Capping, stocktake, staff training, etc.',
  },
] satisfies StockUpdateField[];

export const stockUpdate = [
  // {
  //   itemName: 'Trolley of stock',
  //   registerName: 'StockUpdate.TrolleyOfStock',
  //   inputType: 'number',
  //   inputMode: 'numeric',
  // },
  // { itemName: 'Stock note', registerName: 'StockUpdate.StockNote', inputType: 'text' },
  // {
  //   itemName: 'Trolley of cosmetic',
  //   registerName: 'StockUpdate.TrolleyOfCosmetics',
  //   inputType: 'number',
  //   inputMode: 'numeric',
  // },
  // { itemName: 'Cosmetic note', registerName: 'StockUpdate.CosmeticNote', inputType: 'text' },
  // {
  //   itemName: 'Trolley of fragrance',
  //   registerName: 'StockUpdate.TrolleyofFragrances',
  //   inputType: 'number',
  //   inputMode: 'numeric',
  // },
  // { itemName: 'Fragrance note', registerName: 'StockUpdate.FragranceNote', inputType: 'text' },
  {
    // itemName: 'Additional stock',
    itemName: '',
    registerName: 'StockUpdate.AdditionalStock',
    inputType: 'text',
    helpText: 'E.g. Stock finished, 2 trolleys of fragrance, 2 trolleys of cosmetics',
  },
  // {
  //   itemName: 'Additional note',
  //   registerName: 'StockUpdate.AdditionalNote',
  //   inputType: 'text',
  //   helpText: 'e.g. Stock finished...',
  // },
] satisfies StockUpdateField[];

export const nightTasks = [
  { itemName: 'Disp ledge/Pods/Mesh', registerName: 'NightTasks.DispLedge', inputType: 'text' },
  { itemName: 'Gondolas', registerName: 'NightTasks.Gondolas', inputType: 'text' },
  { itemName: 'Mesh', registerName: 'NightTasks.Mesh', inputType: 'text' },
  { itemName: 'Tills', registerName: 'NightTasks.Tills', inputType: 'text' },
  { itemName: 'Clip strip', registerName: 'NightTasks.ClipStrips', inputType: 'text' },
  { itemName: 'Podiums', registerName: 'NightTasks.Podiums', inputType: 'text' },
  { itemName: 'Low level', registerName: 'NightTasks.LowLevel', inputType: 'text' },
  { itemName: 'Floor stack', registerName: 'NightTasks.FloorStack', inputType: 'text' },
  { itemName: 'Top sellers', registerName: 'NightTasks.TopSellers', inputType: 'text' },
  { itemName: 'Batwings', registerName: 'NightTasks.BatWings', inputType: 'text' },
  { itemName: 'Sunglasses', registerName: 'NightTasks.Sunglasses', inputType: 'text' },
  { itemName: 'Catalogue', registerName: 'NightTasks.Catalogue', inputType: 'text' },
] satisfies StockUpdateField[];

export const ailesFacing = [
  { itemName: 'Front counter', registerName: 'AislesFacing.FrontCounter', inputType: 'text' },
  { itemName: 'Fem hyg, house, summer', registerName: 'AislesFacing.FemHygSummer', inputType: 'text' },
  { itemName: 'Haircare', registerName: 'AislesFacing.Haircare', inputType: 'text' },
  { itemName: 'Skincare', registerName: 'AislesFacing.Skincare', inputType: 'text' },
  { itemName: 'Vitamins', registerName: 'AislesFacing.Vitamins', inputType: 'text' },
  { itemName: 'PSA', registerName: 'AislesFacing.PSA', inputType: 'text' },
  { itemName: 'Backwall', registerName: 'AislesFacing.Backwall', inputType: 'text' },
  { itemName: 'Sports nutrition', registerName: 'AislesFacing.SportNutritions', inputType: 'text' },
  { itemName: 'Baby/First aid', registerName: 'AislesFacing.BabyFirstAid', inputType: 'text' },
  { itemName: 'Cosmetics', registerName: 'AislesFacing.Cosmetics', inputType: 'text' },
  { itemName: 'Fragrances', registerName: 'AislesFacing.Fragrances', inputType: 'text' },
] satisfies StockUpdateField[];

export const cleaning = [
  { itemName: 'Bin run', registerName: 'Cleaning.BinRun', inputType: 'text' },
  { itemName: 'Sweeping', registerName: 'Cleaning.Sweeping', inputType: 'text' },
  { itemName: 'Tea room', registerName: 'Cleaning.TeaRoom', inputType: 'text' },
  { itemName: 'Consulting room', registerName: 'Cleaning.ConsultingRoom', inputType: 'text' },
] satisfies StockUpdateField[];

export const generalCheck = [
  {
    itemName: 'Free trolleys *',
    registerName: 'GeneralCheck.FreeTrolleys',
    inputType: 'number',
    helpText: '/14',
    inputMode: 'numeric',
  },
  {
    itemName: 'Free cages *',
    registerName: 'GeneralCheck.FreeCages',
    inputType: 'number',
    helpText: '/9',
    inputMode: 'numeric',
  },
  {
    itemName: '# of outstanding Click & Collect',
    registerName: 'GeneralCheck.NumOfClickCollect',
    inputType: 'number',
    inputMode: 'numeric',
  },
  {
    itemName: '# of catalogue bundles',
    registerName: 'GeneralCheck.NumOfCataBundle',
    inputType: 'number',
    inputMode: 'numeric',
  },
  {
    itemName: '# of magazine bundles',
    registerName: 'GeneralCheck.NumOfMagaBundle',
    inputType: 'number',
    inputMode: 'numeric',
  },
  {
    itemName: 'My Pals on charge',
    registerName: 'GeneralCheck.NumOfMyPals',
    inputType: 'number',
    helpText: '/5',
    inputMode: 'numeric',
  },
  {
    itemName: 'Fragrance keys on security desk *',
    registerName: 'GeneralCheck.NumOfFragKeys',
    inputType: 'number',
    helpText: '/3',
    inputMode: 'numeric',
  },
  {
    itemName: 'Lift passes in dispensary *',
    registerName: 'GeneralCheck.NumOfLiftPasses',
    inputType: 'number',
    helpText: '/2',
    inputMode: 'numeric',
  },
  {
    itemName: 'Augmodo in store room *',
    registerName: 'GeneralCheck.NumOfAugmodos',
    inputType: 'number',
    helpText: '/4',
    inputMode: 'numeric',
  },
] satisfies StockUpdateField[];
