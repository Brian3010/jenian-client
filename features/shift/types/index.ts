export enum PayCycleType {
  Weekly = 1,
  Fortnightly = 2,
  Monthly = 3,
}

export type PayCycleName = 'Weekly' | 'Fortnightly' | 'Monthly';

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

export type ShiftSummaryResult<TShift = UserShift> = {
  shifts: TShift[];
  dailySummaries: UserDailyPaySummary[];
};

export type CurrentPayCycleData =
  | {
      hasPayCycleSettings: false;
      payCycle: null;
      startDate: null;
      endDate: null;
      shifts: UserShift[];
      dailySummaries: UserDailyPaySummary[];
    }
  | {
      hasPayCycleSettings: true;
      payCycle: PayCycleName;
      startDate: string;
      endDate: string;
      shifts: UserShift[];
      dailySummaries: UserDailyPaySummary[];
    };

export type CurrentPayCycleSummary =
  | {
      hasPayCycleSettings: false;
      payCycle: null;
      startDate: null;
      endDate: null;
      shiftCount: number;
      estimatedGrossPay: number;
    }
  | {
      hasPayCycleSettings: true;
      payCycle: PayCycleName;
      startDate: string;
      endDate: string;
      shiftCount: number;
      estimatedGrossPay: number;
    };
