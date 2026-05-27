import { StockUpdateField } from './types';

export const stockUpdate = [
  {
    itemName: 'Trolley of stock',
    registerName: 'StockUpdate.TrolleyOfStock',
    inputType: 'number',
    inputMode: 'numeric',
  },
  { itemName: 'Stock note', registerName: 'StockUpdate.StockNote', inputType: 'text' },
  {
    itemName: 'Trolley of cosmetic',
    registerName: 'StockUpdate.TrolleyOfCosmetics',
    inputType: 'number',
    inputMode: 'numeric',
  },
  { itemName: 'Cosmetic note', registerName: 'StockUpdate.CosmeticNote', inputType: 'text' },
  {
    itemName: 'Trolley of fragrance',
    registerName: 'StockUpdate.TrolleyofFragrances',
    inputType: 'number',
    inputMode: 'numeric',
  },
  { itemName: 'Fragrance note', registerName: 'StockUpdate.FragranceNote', inputType: 'text' },
  {
    itemName: 'Additional stock',
    registerName: 'StockUpdate.AdditionalStock',
    inputType: 'text',
    helpText: 'Other stocks',
  },
  {
    itemName: 'Additional note',
    registerName: 'StockUpdate.AdditionalNote',
    inputType: 'text',
    helpText: 'e.g. Stock finished...',
  },
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
