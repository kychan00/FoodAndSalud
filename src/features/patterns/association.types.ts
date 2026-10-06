export type AssociationSignal = "insufficient" | "low" | "medium" | "high";

export type AssociationConfidence = "low" | "medium" | "high";

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

  averageSeverity: number;

  medicineOverlapExposures: number;

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

  associations: FoodAssociation[];
}
