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
  FoodDetailBathroomOutcome,
  FoodDetailExposureInput,
  FoodDetailMedicineContext,
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

function getMedicinesAfter(
  exposure: FoodDetailExposureInput,
  medicines: MedicineObservation[],
  hours: number,
  boundaryByEntry: Map<string, MealWindowBoundary>,
) {
  const boundary = getBoundary(exposure, boundaryByEntry);

  return medicines
    .filter((medicine) =>
      isEventInsideMealWindow(boundary, medicine.occurredAt, hours),
    )
    .sort(
      (left, right) =>
        new Date(left.occurredAt).getTime() -
        new Date(right.occurredAt).getTime(),
    );
}

function toOutcome(
  exposure: FoodDetailExposureInput,
  bathroom: BathroomObservation,
): FoodDetailBathroomOutcome {
  return {
    id: bathroom.id,

    occurredAt: bathroom.occurredAt,

    bristolType: bathroom.bristolType,

    urgency: bathroom.urgency,

    painLevel: bathroom.painLevel,

    adverse: isBathroomAdverse(bathroom),

    elapsedHours: hoursBetween(exposure.eatenAt, bathroom.occurredAt),
  };
}

function toMedicineContext(
  exposure: FoodDetailExposureInput,
  medicine: MedicineObservation,
): FoodDetailMedicineContext {
  return {
    id: medicine.id,

    medicineId: medicine.medicineId ?? null,

    medicineName: medicine.medicineName ?? null,

    occurredAt: medicine.occurredAt,

    elapsedHours: hoursBetween(exposure.eatenAt, medicine.occurredAt),

    dose: medicine.dose ?? null,

    unit: medicine.unit ?? null,
  };
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

      const linkedMedicines = getMedicinesAfter(
        exposure,
        medicines,
        24,
        boundaryByEntry,
      );

      const firstBathroom = linkedBathrooms[0] ?? null;

      const firstAdverseBathroom =
        linkedBathrooms.find(isBathroomAdverse) ?? null;

      const medicineContexts = linkedMedicines.map((medicine) =>
        toMedicineContext(exposure, medicine),
      );

      return {
        entryId: exposure.entryId,

        eatenAt: exposure.eatenAt,

        mealType: exposure.mealType,

        coFoods: exposure.coFoods,

        bathroomCount: linkedBathrooms.length,

        windowAdverse: firstAdverseBathroom !== null,

        firstBathroom: firstBathroom
          ? toOutcome(exposure, firstBathroom)
          : null,

        firstAdverseBathroom: firstAdverseBathroom
          ? toOutcome(exposure, firstAdverseBathroom)
          : null,

        medicineOverlap: medicineContexts.length > 0,

        medicines: medicineContexts,

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
