export enum PayCycleType {
  Weekly = 1,
  Fortnightly = 2,
  Monthly = 3,
}

export enum EmploymentType {
  FullTime = 1,
  PartTime = 2,
  Casual = 3,
}

export enum ShiftEntryType {
  Worked = 1,
  PaidNonWorked = 2,
  Leave = 3,
}

// export type PayCycleResponse = {
//   hasPayCycleSettings: boolean;
//   anchorStartDate: string;
//   payCycle: PayCycleType;
//   payCycleStartDate: string;
//   payCycleEndDate: string;
//   shiftCountInCycle: number;
//   estimatedGrossPay: number;
// };

export type PayCycleSettings = {
  hasPayCycleSettings: boolean;
  anchorStartDate: string | null;
  payCycle: PayCycleType | null;
  payCycleStartDate: string | null;
  payCycleEndDate: string | null;
  shiftCountInCycle: number | null;
  estimatedGrossPay: number | null;
};

export type UserShift = {
  id?: string;
  startAt: string;
  endAt: string;
  timeZoneId: string;
  unpaidBreakMinutes: number;
  paidBreakMinutes: number;
  entryType: ShiftEntryType;
  employmentType: EmploymentType;
  // source: string;
};

export type UserDailyPaySummary = {
  workDate: string;
  totalPayableMinutes: number;
  totalPaidBreakMinutes: number;
  totalUnpaidBreakMinutes: number;
  totalEveningPenaltyMinutes: number;
  totalOvertimeMinutes: number;
  baseRateUsed: number;
  grossPay: number;
};

export type ShiftSummaryResult = {
  shifts: UserShift[];
  dailySummaries: UserDailyPaySummary[];
};
