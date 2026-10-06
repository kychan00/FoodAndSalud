export type CombinationStatus =
  "inseparable" | "insufficient" | "higher_with" | "similar" | "lower_with";

export interface CombinationStats {
  totalExposures: number;
  evaluableExposures: number;
  adverseExposures: number;
  adverseRate: number;
}

export interface FoodCombinationComparison {
  coFoodId: string;
  coFoodName: string;

  share: number;

  together: CombinationStats;
  without: CombinationStats;

  difference: number | null;

  status: CombinationStatus;
}

export interface FoodCombinationReport {
  foodId: string;
  foodName: string;

  totalExposures: number;

  exactSolo: CombinationStats;

  comparisons: FoodCombinationComparison[];
}
