export type SpecificMedicineStatus =
  "inseparable" | "insufficient" | "higher_with" | "similar" | "lower_with";

export interface SpecificMedicineStats {
  totalExposures: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
}

export interface SpecificMedicineFactor {
  medicineId: string;

  medicineName: string;

  exposureCount: number;

  exposureShare: number;

  intakeCount: number;

  medianTimingHours: number | null;

  doseLabels: string[];

  withMedicine: SpecificMedicineStats;

  withoutMedicine: SpecificMedicineStats;

  difference: number | null;

  status: SpecificMedicineStatus;
}

export interface SpecificMedicineReport {
  totalExposures: number;

  factors: SpecificMedicineFactor[];
}
