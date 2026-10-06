import { isBathroomAdverse } from "./association.engine";

import type { BathroomObservation } from "./association.types";

import type {
  FoodDetailExposureInput,
  FoodDetailReport,
} from "./foodDetail.types";

import type {
  CombinationStats,
  CombinationStatus,
  FoodCombinationReport,
} from "./combination.types";

const WINDOW_HOURS = 24;

function elapsedHours(start: string, end: string) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000;
}

function getStats(
  exposures: FoodDetailExposureInput[],
  bathrooms: BathroomObservation[],
): CombinationStats {
  let evaluableExposures = 0;

  let adverseExposures = 0;

  for (const exposure of exposures) {
    const linked = bathrooms.filter((bathroom) => {
      const elapsed = elapsedHours(exposure.eatenAt, bathroom.occurredAt);

      return elapsed > 0 && elapsed <= WINDOW_HOURS;
    });

    if (linked.length === 0) {
      continue;
    }

    evaluableExposures += 1;

    if (linked.some(isBathroomAdverse)) {
      adverseExposures += 1;
    }
  }

  return {
    totalExposures: exposures.length,

    evaluableExposures,

    adverseExposures,

    adverseRate:
      evaluableExposures > 0 ? adverseExposures / evaluableExposures : 0,
  };
}

function getStatus(
  together: CombinationStats,
  without: CombinationStats,
  allExposureCount: number,
): CombinationStatus {
  if (together.totalExposures === allExposureCount) {
    return "inseparable";
  }

  if (together.evaluableExposures < 2 || without.evaluableExposures < 2) {
    return "insufficient";
  }

  const difference = together.adverseRate - without.adverseRate;

  if (difference >= 0.25) {
    return "higher_with";
  }

  if (difference <= -0.25) {
    return "lower_with";
  }

  return "similar";
}

export function buildFoodCombinationReport(
  report: FoodDetailReport,
): FoodCombinationReport {
  const exposures: FoodDetailExposureInput[] = report.history.map((item) => ({
    entryId: item.entryId,

    eatenAt: item.eatenAt,

    mealType: item.mealType,

    coFoods: item.coFoods,
  }));

  const exactSoloExposures = exposures.filter(
    (exposure) => exposure.coFoods.length === 0,
  );

  const exactSolo = getStats(exactSoloExposures, report.bathrooms);

  const coFoodMap = new Map<string, string>();

  for (const exposure of exposures) {
    for (const coFood of exposure.coFoods) {
      coFoodMap.set(coFood.foodId, coFood.foodName);
    }
  }

  const comparisons = [...coFoodMap.entries()]
    .map(([coFoodId, coFoodName]) => {
      const togetherExposures = exposures.filter((exposure) =>
        exposure.coFoods.some((item) => item.foodId === coFoodId),
      );

      const withoutExposures = exposures.filter(
        (exposure) =>
          !exposure.coFoods.some((item) => item.foodId === coFoodId),
      );

      const together = getStats(togetherExposures, report.bathrooms);

      const without = getStats(withoutExposures, report.bathrooms);

      const status = getStatus(together, without, exposures.length);

      const difference =
        together.evaluableExposures > 0 && without.evaluableExposures > 0
          ? together.adverseRate - without.adverseRate
          : null;

      return {
        coFoodId,
        coFoodName,

        share:
          exposures.length > 0 ? together.totalExposures / exposures.length : 0,

        together,
        without,
        difference,

        status,
      };
    })
    .sort((left, right) => {
      if (right.share !== left.share) {
        return right.share - left.share;
      }

      return left.coFoodName.localeCompare(right.coFoodName, "es");
    });

  return {
    foodId: report.foodId,

    foodName: report.foodName,

    totalExposures: report.totalExposures,

    exactSolo,

    comparisons,
  };
}
