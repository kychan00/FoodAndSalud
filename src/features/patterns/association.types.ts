export type AssociationSignal = "insufficient" | "low" | "medium" | "high";

export type AssociationConfidence = "low" | "medium" | "high";

export type AssociationComparisonSource = "food_absent" | "all_meals";

export type AssociationStability = "insufficient" | "low" | "medium" | "high";

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

  adjustedAdverseRate: number;

  baselineAdverseRate: number;

  excessRate: number;

  /*
   * Diferencia OBSERVADA sin suavizado:
   *
   * tasa del alimento
   * -
   * tasa del comparador.
   */
  absoluteRiskDifference: number;

  /*
   * Razón descriptiva:
   *
   * tasa alimento / tasa comparador.
   *
   * Sólo se calcula cuando existe un grupo separado
   * de comidas sin el alimento y su tasa es > 0.
   */
  relativeRisk: number | null;

  controlEvaluableExposures: number;

  controlAdverseExposures: number;

  /*
   * Muestra utilizada realmente como referencia.
   *
   * Puede ser:
   *
   * - comidas sin alimento;
   * - baseline global de comidas.
   */
  comparisonEvaluableExposures: number;

  comparisonAdverseExposures: number;

  comparisonSource: AssociationComparisonSource;

  averageSeverity: number;

  medicineOverlapExposures: number;

  truncatedExposures: number;

  /*
   * Estabilidad leave-one-out.
   *
   * Se retira una exposición evaluable a la vez y se
   * comprueba si cambia la categoría de señal.
   *
   * Sólo se calcula cuando existe control separado.
   */
  stability: AssociationStability;

  stabilityScore: number | null;

  stableLeaveOneOutExposures: number;

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

  baselineAdverseRate: number;

  totalMealWindows: number;

  totalEvaluableMealWindows: number;

  totalAdverseMealWindows: number;

  totalTruncatedMealWindows: number;

  bathroomEventAdverseRate: number;

  associations: FoodAssociation[];
}
