export type PayCycleResponse = {
  hasPayCycleSettings: boolean;
  anchorStartDate: string | null;
  payCycle: number | null;
  payCycleStartDate: string | null;
  payCycleEndDate: string | null;
  shiftCountInCycle: number | null;
  estimatedGrossPay: number | null;
};
