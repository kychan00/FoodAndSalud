import { buildFoodCombinationReport } from "./combination.engine";

import type {
  ConcurrentContextReport,
  ConcurrentMedicineStatus,
  ConcurrentStats,
} from "./concurrent.types";

import type {
  FoodDetailReport,
  FoodExposureHistoryItem,
} from "./foodDetail.types";

function getHistoryStats(history: FoodExposureHistoryItem[]): ConcurrentStats {
  const evaluable = history.filter((item) => item.bathroomCount > 0);

  const adverse = evaluable.filter((item) => item.windowAdverse);

  return {
    totalExposures: history.length,

    evaluableExposures: evaluable.length,

    adverseExposures: adverse.length,

    adverseRate: evaluable.length > 0 ? adverse.length / evaluable.length : 0,
  };
}

function classifyMedicine({
  totalExposures,
  withMedicine,
  withoutMedicine,
}: {
  totalExposures: number;

  withMedicine: ConcurrentStats;

  withoutMedicine: ConcurrentStats;
}): {
  status: ConcurrentMedicineStatus;

  difference: number | null;
} {
  if (withMedicine.totalExposures === 0) {
    return {
      status: "none",

      difference: null,
    };
  }

  if (totalExposures > 0 && withMedicine.totalExposures === totalExposures) {
    return {
      status: "inseparable",

      difference: null,
    };
  }

  if (
    withMedicine.evaluableExposures < 2 ||
    withoutMedicine.evaluableExposures < 2
  ) {
    return {
      status: "insufficient",

      difference: null,
    };
  }

  const difference = withMedicine.adverseRate - withoutMedicine.adverseRate;

  if (difference >= 0.25) {
    return {
      status: "higher_with",

      difference,
    };
  }

  if (difference <= -0.25) {
    return {
      status: "lower_with",

      difference,
    };
  }

  return {
    status: "similar",

    difference,
  };
}

export function buildConcurrentContextReport(
  report: FoodDetailReport,
): ConcurrentContextReport {
  const withMedicineHistory = report.history.filter(
    (item) => item.medicineOverlap,
  );

  const withoutMedicineHistory = report.history.filter(
    (item) => !item.medicineOverlap,
  );

  const withMedicine = getHistoryStats(withMedicineHistory);

  const withoutMedicine = getHistoryStats(withoutMedicineHistory);

  const medicineClassification = classifyMedicine({
    totalExposures: report.history.length,

    withMedicine,

    withoutMedicine,
  });

  const combinations = buildFoodCombinationReport(report);

  return {
    medicine: {
      status: medicineClassification.status,

      overlapExposures: withMedicine.totalExposures,

      overlapShare:
        report.history.length > 0
          ? withMedicine.totalExposures / report.history.length
          : 0,

      withMedicine,

      withoutMedicine,

      difference: medicineClassification.difference,
    },

    exactSolo: {
      totalExposures: combinations.exactSolo.totalExposures,

      evaluableExposures: combinations.exactSolo.evaluableExposures,

      adverseExposures: combinations.exactSolo.adverseExposures,

      adverseRate: combinations.exactSolo.adverseRate,
    },

    foodFactors: combinations.comparisons.map((comparison) => ({
      foodId: comparison.coFoodId,

      foodName: comparison.coFoodName,

      share: comparison.share,

      status: comparison.status,

      difference: comparison.difference,

      togetherEvaluable: comparison.together.evaluableExposures,

      withoutEvaluable: comparison.without.evaluableExposures,
    })),
  };
}
