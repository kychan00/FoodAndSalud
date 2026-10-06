import { isBathroomAdverse } from "./association.engine";

import type { BathroomObservation } from "./association.types";

import type {
  CombinationStats,
  CombinationStatus,
  CombinationWindowComparison,
  CombinationWindowHours,
  FoodCombinationReport,
} from "./combination.types";

import type {
  FoodDetailExposureInput,
  FoodDetailReport,
} from "./foodDetail.types";

import { isEventInsideMealWindow, type MealWindowBoundary } from "./mealWindow";

const WINDOWS: CombinationWindowHours[] = [6, 12, 24];

function getStats(
  exposures: FoodDetailExposureInput[],
  bathrooms: BathroomObservation[],
  hours: CombinationWindowHours,
  boundaryByEntry: Map<string, MealWindowBoundary>,
): CombinationStats {
  let evaluableExposures = 0;

  let adverseExposures = 0;

  for (const exposure of exposures) {
    const boundary = boundaryByEntry.get(exposure.entryId) ?? {
      entryId: exposure.entryId,

      eatenAt: exposure.eatenAt,

      nextMealAt: null,
    };

    const linked = bathrooms.filter((bathroom) =>
      isEventInsideMealWindow(boundary, bathroom.occurredAt, hours),
    );

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

function buildWindowComparison({
  hours,
  togetherExposures,
  withoutExposures,
  bathrooms,
  allExposureCount,
  boundaryByEntry,
}: {
  hours: CombinationWindowHours;

  togetherExposures: FoodDetailExposureInput[];

  withoutExposures: FoodDetailExposureInput[];

  bathrooms: BathroomObservation[];

  allExposureCount: number;

  boundaryByEntry: Map<string, MealWindowBoundary>;
}): CombinationWindowComparison {
  const together = getStats(
    togetherExposures,
    bathrooms,
    hours,
    boundaryByEntry,
  );

  const without = getStats(withoutExposures, bathrooms, hours, boundaryByEntry);

  const status = getStatus(together, without, allExposureCount);

  const difference =
    together.evaluableExposures > 0 && without.evaluableExposures > 0
      ? together.adverseRate - without.adverseRate
      : null;

  return {
    hours,
    together,
    without,
    difference,
    status,
  };
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

  const boundaryByEntry = new Map<string, MealWindowBoundary>(
    report.mealContext.map((boundary) => [boundary.entryId, boundary]),
  );

  const exactSoloExposures = exposures.filter(
    (exposure) => exposure.coFoods.length === 0,
  );

  const exactSoloWindows = WINDOWS.map((hours) => ({
    hours,

    stats: getStats(
      exactSoloExposures,
      report.bathrooms,
      hours,
      boundaryByEntry,
    ),
  }));

  const exactSolo = exactSoloWindows.find((item) => item.hours === 24)
    ?.stats ?? {
    totalExposures: 0,

    evaluableExposures: 0,

    adverseExposures: 0,

    adverseRate: 0,
  };

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

      const windows = WINDOWS.map((hours) =>
        buildWindowComparison({
          hours,

          togetherExposures,

          withoutExposures,

          bathrooms: report.bathrooms,

          allExposureCount: exposures.length,

          boundaryByEntry,
        }),
      );

      const primary = windows.find((item) => item.hours === 24);

      if (!primary) {
        throw new Error("Missing 24 hour combination window.");
      }

      return {
        coFoodId,

        coFoodName,

        share:
          exposures.length > 0
            ? togetherExposures.length / exposures.length
            : 0,

        together: primary.together,

        without: primary.without,

        difference: primary.difference,

        status: primary.status,

        windows,
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

    exactSoloWindows,

    comparisons,
  };
}
