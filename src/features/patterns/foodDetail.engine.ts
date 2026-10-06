import {
  buildAssociationReport,
  isBathroomAdverse,
} from "./association.engine";

import type {
  BathroomObservation,
  FoodExposure,
  MedicineObservation,
} from "./association.types";

import type {
  FoodDetailExposureInput,
  FoodDetailReport,
  FoodDetailWindow,
} from "./foodDetail.types";

import {
  buildMealWindowBoundaries,
  getEffectiveMealWindowHours,
  isEventInsideMealWindow,
  isMealWindowTruncated,
  type MealWindowBoundary,
} from "./mealWindow";

const HOURS = [6, 12, 24] as const;

function hoursBetween(start: string, end: string) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 3_600_000;
}

function getBoundary(
  exposure: FoodDetailExposureInput,
  boundaryByEntry: Map<string, MealWindowBoundary>,
) {
  return (
    boundaryByEntry.get(exposure.entryId) ?? {
      entryId: exposure.entryId,

      eatenAt: exposure.eatenAt,

      nextMealAt: null,
    }
  );
}

function getBathroomsAfter(
  exposure: FoodDetailExposureInput,
  bathrooms: BathroomObservation[],
  hours: number,
  boundaryByEntry: Map<string, MealWindowBoundary>,
) {
  const boundary = getBoundary(exposure, boundaryByEntry);

  return bathrooms
    .filter((bathroom) =>
      isEventInsideMealWindow(boundary, bathroom.occurredAt, hours),
    )
    .sort(
      (left, right) =>
        new Date(left.occurredAt).getTime() -
        new Date(right.occurredAt).getTime(),
    );
}

function buildWindow(
  hours: 6 | 12 | 24,
  exposures: FoodDetailExposureInput[],
  bathrooms: BathroomObservation[],
  boundaryByEntry: Map<string, MealWindowBoundary>,
): FoodDetailWindow {
  let evaluableExposures = 0;

  let adverseExposures = 0;

  let truncatedExposures = 0;

  for (const exposure of exposures) {
    const boundary = getBoundary(exposure, boundaryByEntry);

    if (isMealWindowTruncated(boundary, hours)) {
      truncatedExposures += 1;
    }

    const linked = getBathroomsAfter(
      exposure,
      bathrooms,
      hours,
      boundaryByEntry,
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
    hours,

    totalExposures: exposures.length,

    evaluableExposures,

    adverseExposures,

    adverseRate:
      evaluableExposures > 0 ? adverseExposures / evaluableExposures : 0,

    truncatedExposures,
  };
}

export function buildFoodDetailReport({
  foodId,
  foodName,
  days,
  exposures,
  bathrooms,
  medicines,
  comparisonExposures,
}: {
  foodId: string;

  foodName: string;

  days: number;

  exposures: FoodDetailExposureInput[];

  bathrooms: BathroomObservation[];

  medicines: MedicineObservation[];

  comparisonExposures?: FoodExposure[];
}): FoodDetailReport {
  const associationExposures: FoodExposure[] = exposures.map((exposure) => ({
    entryId: exposure.entryId,

    foodId,

    foodName,

    eatenAt: exposure.eatenAt,
  }));

  const analysisExposures = comparisonExposures ?? associationExposures;

  const comparisonEntryCount = new Set(
    analysisExposures.map((item) => item.entryId),
  ).size;

  const mealContext = buildMealWindowBoundaries(analysisExposures);

  const boundaryByEntry = new Map(
    mealContext.map((boundary) => [boundary.entryId, boundary]),
  );

  const associationReport = buildAssociationReport({
    days,

    totalFoodEntries: comparisonEntryCount,

    exposures: analysisExposures,

    bathrooms,

    medicines,
  });

  const association =
    associationReport.associations.find((item) => item.foodId === foodId) ??
    null;

  const windows = HOURS.map((hours) =>
    buildWindow(hours, exposures, bathrooms, boundaryByEntry),
  );

  const coFoodCounter = new Map<
    string,
    {
      foodId: string;

      foodName: string;

      count: number;
    }
  >();

  for (const exposure of exposures) {
    const seen = new Set<string>();

    for (const coFood of exposure.coFoods) {
      if (seen.has(coFood.foodId)) {
        continue;
      }

      seen.add(coFood.foodId);

      const current = coFoodCounter.get(coFood.foodId);

      if (current) {
        current.count += 1;
      } else {
        coFoodCounter.set(coFood.foodId, {
          ...coFood,

          count: 1,
        });
      }
    }
  }

  const coOccurrences = [...coFoodCounter.values()]
    .map((item) => ({
      ...item,

      share: exposures.length > 0 ? item.count / exposures.length : 0,
    }))
    .sort((left, right) => right.count - left.count);

  const history = [...exposures]
    .sort(
      (left, right) =>
        new Date(right.eatenAt).getTime() - new Date(left.eatenAt).getTime(),
    )
    .map((exposure) => {
      const boundary = getBoundary(exposure, boundaryByEntry);

      const linkedBathrooms = getBathroomsAfter(
        exposure,
        bathrooms,
        24,
        boundaryByEntry,
      );

      const first = linkedBathrooms[0] ?? null;

      const medicineOverlap = medicines.some((medicine) =>
        isEventInsideMealWindow(boundary, medicine.occurredAt, 24),
      );

      return {
        entryId: exposure.entryId,

        eatenAt: exposure.eatenAt,

        mealType: exposure.mealType,

        coFoods: exposure.coFoods,

        firstBathroom: first
          ? {
              id: first.id,

              occurredAt: first.occurredAt,

              bristolType: first.bristolType,

              urgency: first.urgency,

              painLevel: first.painLevel,

              adverse: isBathroomAdverse(first),

              elapsedHours: hoursBetween(exposure.eatenAt, first.occurredAt),
            }
          : null,

        medicineOverlap,

        windowTruncated: isMealWindowTruncated(boundary, 24),

        effectiveWindowHours: getEffectiveMealWindowHours(boundary, 24),
      };
    });

  return {
    foodId,

    foodName,

    days,

    totalExposures: exposures.length,

    association,

    windows,

    coOccurrences,

    history,

    mealContext,

    bathrooms,

    medicines,
  };
}
