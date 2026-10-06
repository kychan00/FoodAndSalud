import type { CombinationStatus } from "./combination.types";

export type ConcurrentMedicineStatus =
  | "none"
  | "inseparable"
  | "insufficient"
  | "higher_with"
  | "similar"
  | "lower_with";

export interface ConcurrentStats {
  totalExposures: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
}

export interface MedicineConcurrentReport {
  status: ConcurrentMedicineStatus;

  overlapExposures: number;

  overlapShare: number;

  withMedicine: ConcurrentStats;

  withoutMedicine: ConcurrentStats;

  difference: number | null;
}

export interface FoodConcurrentFactor {
  foodId: string;

  foodName: string;

  share: number;

  status: CombinationStatus;

  difference: number | null;

  togetherEvaluable: number;

  withoutEvaluable: number;
}

export interface ConcurrentContextReport {
  medicine: MedicineConcurrentReport;

  exactSolo: ConcurrentStats;

  foodFactors: FoodConcurrentFactor[];
}
