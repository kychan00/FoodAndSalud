export type CombinationStatus =
  "inseparable" | "insufficient" | "higher_with" | "similar" | "lower_with";

export type CombinationWindowHours = 6 | 12 | 24;

export interface CombinationStats {
  totalExposures: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
}

export interface CombinationWindowComparison {
  hours: CombinationWindowHours;

  together: CombinationStats;

  without: CombinationStats;

  difference: number | null;

  status: CombinationStatus;
}

export interface FoodCombinationComparison {
  coFoodId: string;

  coFoodName: string;

  share: number;

  /*
   * Estos cuatro campos representan la ventana principal de 24 h.
   * Se conservan para compatibilidad con la UI y pruebas existentes.
   */
  together: CombinationStats;

  without: CombinationStats;

  difference: number | null;

  status: CombinationStatus;

  windows: CombinationWindowComparison[];
}

export interface ExactSoloWindow {
  hours: CombinationWindowHours;

  stats: CombinationStats;
}

export interface FoodCombinationReport {
  foodId: string;

  foodName: string;

  totalExposures: number;

  exactSolo: CombinationStats;

  exactSoloWindows: ExactSoloWindow[];

  comparisons: FoodCombinationComparison[];
}
