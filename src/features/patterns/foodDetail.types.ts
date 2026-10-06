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
}

export interface FoodCoOccurrence {
  foodId: string;
  foodName: string;
  count: number;
  share: number;
}

export interface FoodExposureHistoryItem {
  entryId: string;
  eatenAt: string;
  mealType: string;

  coFoods: CoFood[];

  firstBathroom: {
    id: string;
    occurredAt: string;
    bristolType: number;
    urgency: number | null;
    painLevel: number | null;
    adverse: boolean;
    elapsedHours: number;
  } | null;

  medicineOverlap: boolean;
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

  bathrooms: BathroomObservation[];
  medicines: MedicineObservation[];
}
