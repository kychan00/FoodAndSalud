export type TemporalPersistenceStatus =
  "insufficient" | "persistent" | "recent" | "weakened" | "stable" | "variable";

export interface TemporalPeriodStats {
  id: "older" | "recent";

  label: string;

  startAt: string | null;

  endAt: string | null;

  totalMealWindows: number;

  foodTotalWindows: number;

  foodEvaluableExposures: number;

  foodAdverseExposures: number;

  foodAdverseRate: number;

  comparisonTotalWindows: number;

  comparisonEvaluableExposures: number;

  comparisonAdverseExposures: number;

  comparisonAdverseRate: number;

  absoluteRiskDifference: number | null;
}

export interface TemporalPersistenceReport {
  status: TemporalPersistenceStatus;

  older: TemporalPeriodStats;

  recent: TemporalPeriodStats;

  differenceChange: number | null;

  minimumEvaluablePerGroup: number;
}
