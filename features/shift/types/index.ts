export type PayCycleResponse = {
  hasPayCycleSettings: boolean;
  anchorStartDate: string;
  payCycle: number;
  payCycleStartDate: string;
  payCycleEndDate: string;
  shiftCountInCycle: number;
  estimatedGrossPay: number;
};
