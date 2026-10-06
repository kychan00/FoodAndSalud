export type MedicineTimingComparisonStatus =
  | "no_exposure"
  | "inseparable"
  | "insufficient"
  | "higher"
  | "similar"
  | "lower";

export interface MedicineTimingStats {
  totalExposures: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
}

export interface MedicineTimingFactor {
  medicineId: string;

  medicineName: string;

  beforeOnly: MedicineTimingStats;

  afterOnly: MedicineTimingStats;

  both: MedicineTimingStats;

  none: MedicineTimingStats;

  beforeDifference: number | null;

  afterDifference: number | null;

  beforeStatus: MedicineTimingComparisonStatus;

  afterStatus: MedicineTimingComparisonStatus;

  beforeIntakeCount: number;

  afterIntakeCount: number;

  medianBeforeHours: number | null;

  medianAfterHours: number | null;
}

export interface MedicineTimingReport {
  preWindowHours: number;

  totalExposures: number;

  factors: MedicineTimingFactor[];
}
