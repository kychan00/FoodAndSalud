import type {
  FoodDetailMedicineContext,
  FoodDetailReport,
  FoodExposureHistoryItem,
} from "./foodDetail.types";

import type {
  SpecificMedicineFactor,
  SpecificMedicineReport,
  SpecificMedicineStats,
  SpecificMedicineStatus,
} from "./medicineSpecific.types";

function getStats(history: FoodExposureHistoryItem[]): SpecificMedicineStats {
  const evaluable = history.filter((item) => item.bathroomCount > 0);

  const adverse = evaluable.filter((item) => item.windowAdverse);

  return {
    totalExposures: history.length,

    evaluableExposures: evaluable.length,

    adverseExposures: adverse.length,

    adverseRate: evaluable.length > 0 ? adverse.length / evaluable.length : 0,
  };
}

function median(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? null;
  }

  const left = sorted[middle - 1];

  const right = sorted[middle];

  if (left === undefined || right === undefined) {
    return null;
  }

  return (left + right) / 2;
}

function getStatus({
  totalExposures,
  withMedicine,
  withoutMedicine,
}: {
  totalExposures: number;

  withMedicine: SpecificMedicineStats;

  withoutMedicine: SpecificMedicineStats;
}): SpecificMedicineStatus {
  if (totalExposures > 0 && withMedicine.totalExposures === totalExposures) {
    return "inseparable";
  }

  if (
    withMedicine.evaluableExposures < 2 ||
    withoutMedicine.evaluableExposures < 2
  ) {
    return "insufficient";
  }

  const difference = withMedicine.adverseRate - withoutMedicine.adverseRate;

  if (difference >= 0.25) {
    return "higher_with";
  }

  if (difference <= -0.25) {
    return "lower_with";
  }

  return "similar";
}

function getDoseLabel(medicine: FoodDetailMedicineContext) {
  if (medicine.dose === null) {
    return null;
  }

  return medicine.unit
    ? `${medicine.dose} ${medicine.unit}`
    : `${medicine.dose}`;
}

export function buildSpecificMedicineReport(
  report: FoodDetailReport,
): SpecificMedicineReport {
  const medicineNames = new Map<string, string>();

  for (const item of report.history) {
    for (const medicine of item.medicines) {
      if (!medicine.medicineId || !medicine.medicineName) {
        continue;
      }

      medicineNames.set(medicine.medicineId, medicine.medicineName);
    }
  }

  const factors: SpecificMedicineFactor[] = [...medicineNames.entries()].map(
    ([medicineId, medicineName]) => {
      const withHistory = report.history.filter((item) =>
        item.medicines.some((medicine) => medicine.medicineId === medicineId),
      );

      const withoutHistory = report.history.filter(
        (item) =>
          !item.medicines.some(
            (medicine) => medicine.medicineId === medicineId,
          ),
      );

      const withMedicine = getStats(withHistory);

      const withoutMedicine = getStats(withoutHistory);

      const matchingIntakes = report.history.flatMap((item) =>
        item.medicines.filter((medicine) => medicine.medicineId === medicineId),
      );

      const doseLabels = [
        ...new Set(
          matchingIntakes
            .map(getDoseLabel)
            .filter((value): value is string => value !== null),
        ),
      ].slice(0, 3);

      const difference =
        withMedicine.evaluableExposures > 0 &&
        withoutMedicine.evaluableExposures > 0
          ? withMedicine.adverseRate - withoutMedicine.adverseRate
          : null;

      return {
        medicineId,

        medicineName,

        exposureCount: withMedicine.totalExposures,

        exposureShare:
          report.history.length > 0
            ? withMedicine.totalExposures / report.history.length
            : 0,

        intakeCount: matchingIntakes.length,

        medianTimingHours: median(
          matchingIntakes.map((medicine) => medicine.elapsedHours),
        ),

        doseLabels,

        withMedicine,

        withoutMedicine,

        difference,

        status: getStatus({
          totalExposures: report.history.length,

          withMedicine,

          withoutMedicine,
        }),
      };
    },
  );

  factors.sort((left, right) => {
    if (right.exposureShare !== left.exposureShare) {
      return right.exposureShare - left.exposureShare;
    }

    return left.medicineName.localeCompare(right.medicineName, "es");
  });

  return {
    totalExposures: report.history.length,

    factors,
  };
}
