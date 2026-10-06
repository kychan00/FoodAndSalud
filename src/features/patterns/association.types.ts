export type AssociationSignal = "insufficient" | "low" | "medium" | "high";

export type AssociationConfidence = "low" | "medium" | "high";

export type AssociationComparisonSource = "food_absent" | "all_meals";

export interface FoodExposure {
  entryId: string;
  foodId: string;
  foodName: string;
  eatenAt: string;
}

export interface BathroomObservation {
  id: string;
  occurredAt: string;
  bristolType: number;
  urgency: number | null;
  painLevel: number | null;
}

export interface MedicineObservation {
  id: string;
  occurredAt: string;
}

export interface FoodAssociation {
  foodId: string;
  foodName: string;

  totalExposures: number;
  evaluableExposures: number;
  adverseExposures: number;

  adverseRate: number;

  /*
   * Tasa suavizada del alimento utilizando como prior
   * una referencia con el mismo tipo de denominador:
   * ventanas de comida.
   */
  adjustedAdverseRate: number;

  /*
   * Referencia utilizada para ESTE alimento.
   *
   * Normalmente:
   * comidas evaluables donde el alimento no estuvo presente.
   *
   * Fallback:
   * todas las ventanas de comida evaluables.
   */
  baselineAdverseRate: number;

  excessRate: number;

  controlEvaluableExposures: number;
  controlAdverseExposures: number;

  comparisonSource: AssociationComparisonSource;

  averageSeverity: number;

  medicineOverlapExposures: number;

  /*
   * Exposiciones cuya ventana nominal de 24 h terminó
   * antes porque se registró otra comida.
   */
  truncatedExposures: number;

  signal: AssociationSignal;
  confidence: AssociationConfidence;

  rankScore: number;
}

export interface AssociationReport {
  days: number;
  generatedAt: string;

  totalFoodEntries: number;
  totalFoodExposures: number;
  totalBathroomEntries: number;

  /*
   * Baseline GLOBAL por ventanas de comida.
   */
  baselineAdverseRate: number;

  totalMealWindows: number;
  totalEvaluableMealWindows: number;
  totalAdverseMealWindows: number;

  totalTruncatedMealWindows: number;

  /*
   * Métrica descriptiva secundaria.
   *
   * No participa directamente como comparador estadístico
   * de los alimentos.
   */
  bathroomEventAdverseRate: number;

  associations: FoodAssociation[];
}
