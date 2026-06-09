export enum PayCycle {
  Weekly = 1,
  Fortnightly = 2,
  Monthly = 3,
}

export type PayCycleResponse = {
  hasPayCycleSettings: boolean;
  anchorStartDate: string;
  payCycle: PayCycle;
  payCycleStartDate: string;
  payCycleEndDate: string;
  shiftCountInCycle: number;
  estimatedGrossPay: number;
};

export type UserShiftsResponse = {
  shifts: {
    id: string | null;
    startAt: string;
    endAt: string;
    timeZoneId: string;
    unpaidBreakMinutes: number;
    paidBreakMinutes: number;
    entryType: string;
    employmentType: string;
    source: string;
  }[];
  dailySummaries: {
    workDate: string;
    totalPayableMinutes: number;
    totalPaidBreakMinutes: number;
    totalUnpaidBreakMinutes: number;
    totalEveningPenaltyMinutes: number;
    totalOvertimeMinutes: number;
    baseRateUsed: number;
    grossPay: number;
  }[];
};
