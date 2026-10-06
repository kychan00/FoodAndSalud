import type {
  BathroomObservation,
  FoodAssociation,
  MedicineObservation,
} from "./association.types";

export interface CoFood {
  foodId: string;

  foodName: string;
}

export interface FoodDetailExposureInput {
  entryId: string;

  eatenAt: string;

  mealType: string;

  coFoods: CoFood[];
}

export interface FoodDetailWindow {
  hours: 6 | 12 | 24;

  totalExposures: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;

  truncatedExposures: number;
}

export interface FoodCoOccurrence {
  foodId: string;

  foodName: string;

  count: number;

  share: number;
}

export interface FoodDetailBathroomOutcome {
  id: string;

  occurredAt: string;

  bristolType: number;

  urgency: number | null;

  painLevel: number | null;

  adverse: boolean;

  elapsedHours: number;
}

export interface FoodDetailMedicineContext {
  id: string;

  medicineId: string | null;

  medicineName: string | null;

  occurredAt: string;

  /*
   * Positivo:
   * después de la comida.
   *
   * Negativo:
   * antes de la comida.
   */
  elapsedHours: number;

  dose: number | null;

  unit: string | null;
}

export interface FoodExposureHistoryItem {
  entryId: string;

  eatenAt: string;

  mealType: string;

  coFoods: CoFood[];

  bathroomCount: number;

  windowAdverse: boolean;

  firstBathroom: FoodDetailBathroomOutcome | null;

  firstAdverseBathroom: FoodDetailBathroomOutcome | null;

  /*
   * Compatibilidad con Fases 3.9 / 3.10:
   *
   * medicineOverlap y medicines continúan significando
   * Medicina DESPUÉS de la comida dentro de la ventana
   * efectiva.
   */
  medicineOverlap: boolean;

  medicines: FoodDetailMedicineContext[];

  /*
   * Fase 3.11:
   *
   * Medicina registrada en las 6 horas previas.
   */
  medicineBeforeOverlap: boolean;

  medicinesBefore: FoodDetailMedicineContext[];

  windowTruncated: boolean;

  effectiveWindowHours: number;
}

export interface FoodDetailMealContext {
  entryId: string;

  eatenAt: string;

  nextMealAt: string | null;
}

export interface FoodDetailReport {
  foodId: string;

  foodName: string;

  days: number;

  totalExposures: number;

  association: FoodAssociation | null;

  windows: FoodDetailWindow[];

  coOccurrences: FoodCoOccurrence[];

  history: FoodExposureHistoryItem[];

  mealContext: FoodDetailMealContext[];

  bathrooms: BathroomObservation[];

  medicines: MedicineObservation[];
}
