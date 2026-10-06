import type {
  FoodDetailMedicineContext,
  FoodDetailReport,
  FoodExposureHistoryItem,
} from "./foodDetail.types";

import { MEDICINE_PRE_WINDOW_HOURS } from "./medicineTiming.constants";

import type {
  MedicineTimingComparisonStatus,
  MedicineTimingReport,
  MedicineTimingStats,
} from "./medicineTiming.types";

function getStats(history: FoodExposureHistoryItem[]): MedicineTimingStats {
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

function classify(
  context: MedicineTimingStats,
  none: MedicineTimingStats,
): {
  status: MedicineTimingComparisonStatus;

  difference: number | null;
} {
  if (context.totalExposures === 0) {
    return {
      status: "no_exposure",

      difference: null,
    };
  }

  if (none.totalExposures === 0) {
    return {
      status: "inseparable",

      difference: null,
    };
  }

  if (context.evaluableExposures < 2 || none.evaluableExposures < 2) {
    return {
      status: "insufficient",

      difference: null,
    };
  }

  const difference = context.adverseRate - none.adverseRate;

  if (difference >= 0.25) {
    return {
      status: "higher",

      difference,
    };
  }

  if (difference <= -0.25) {
    return {
      status: "lower",

      difference,
    };
  }

  return {
    status: "similar",

    difference,
  };
}

function matchingBefore(item: FoodExposureHistoryItem, medicineId: string) {
  return item.medicinesBefore.filter(
    (medicine) => medicine.medicineId === medicineId,
  );
}

function matchingAfter(item: FoodExposureHistoryItem, medicineId: string) {
  return item.medicines.filter(
    (medicine) => medicine.medicineId === medicineId,
  );
}

function hasNamedMedicine(
  medicine: FoodDetailMedicineContext,
): medicine is FoodDetailMedicineContext & {
  medicineId: string;

  medicineName: string;
} {
  return Boolean(medicine.medicineId && medicine.medicineName);
}

export function buildMedicineTimingReport(
  report: FoodDetailReport,
): MedicineTimingReport {
  const medicineNames = new Map<string, string>();

  for (const item of report.history) {
    for (const medicine of [...item.medicinesBefore, ...item.medicines]) {
      if (!hasNamedMedicine(medicine)) {
        continue;
      }

      medicineNames.set(medicine.medicineId, medicine.medicineName);
    }
  }

  const factors = [...medicineNames.entries()].map(
    ([medicineId, medicineName]) => {
      const beforeOnlyHistory: FoodExposureHistoryItem[] = [];

      const afterOnlyHistory: FoodExposureHistoryItem[] = [];

      const bothHistory: FoodExposureHistoryItem[] = [];

      const noneHistory: FoodExposureHistoryItem[] = [];

      const beforeIntakes: FoodDetailMedicineContext[] = [];

      const afterIntakes: FoodDetailMedicineContext[] = [];

      for (const item of report.history) {
        const before = matchingBefore(item, medicineId);

        const after = matchingAfter(item, medicineId);

        beforeIntakes.push(...before);

        afterIntakes.push(...after);

        const hasBefore = before.length > 0;

        const hasAfter = after.length > 0;

        if (hasBefore && hasAfter) {
          bothHistory.push(item);

          continue;
        }

        if (hasBefore) {
          beforeOnlyHistory.push(item);

          continue;
        }

        if (hasAfter) {
          afterOnlyHistory.push(item);

          continue;
        }

        noneHistory.push(item);
      }

      const beforeOnly = getStats(beforeOnlyHistory);

      const afterOnly = getStats(afterOnlyHistory);

      const both = getStats(bothHistory);

      const none = getStats(noneHistory);

      const beforeComparison = classify(beforeOnly, none);

      const afterComparison = classify(afterOnly, none);

      return {
        medicineId,

        medicineName,

        beforeOnly,

        afterOnly,

        both,

        none,

        beforeDifference: beforeComparison.difference,

        afterDifference: afterComparison.difference,

        beforeStatus: beforeComparison.status,

        afterStatus: afterComparison.status,

        beforeIntakeCount: beforeIntakes.length,

        afterIntakeCount: afterIntakes.length,

        medianBeforeHours: median(
          beforeIntakes.map((medicine) => Math.abs(medicine.elapsedHours)),
        ),

        medianAfterHours: median(
          afterIntakes.map((medicine) => medicine.elapsedHours),
        ),
      };
    },
  );

  factors.sort((left, right) => {
    const leftCount =
      left.beforeOnly.totalExposures +
      left.afterOnly.totalExposures +
      left.both.totalExposures;

    const rightCount =
      right.beforeOnly.totalExposures +
      right.afterOnly.totalExposures +
      right.both.totalExposures;

    if (rightCount !== leftCount) {
      return rightCount - leftCount;
    }

    return left.medicineName.localeCompare(right.medicineName, "es");
  });

  return {
    preWindowHours: MEDICINE_PRE_WINDOW_HOURS,

    totalExposures: report.history.length,

    factors,
  };
}
