import type {
  AssociationConfidence,
  AssociationComparisonSource,
  AssociationReport,
  AssociationSignal,
  AssociationStability,
  BathroomObservation,
  FoodAssociation,
  FoodExposure,
  MedicineObservation,
} from "./association.types";

import {
  buildMealWindowBoundaries,
  isEventInsideMealWindow,
  isMealWindowTruncated,
  type MealWindowBoundary,
} from "./mealWindow";

const OUTCOME_WINDOW_HOURS = 24;

const PRIOR_WEIGHT = 4;

interface BuildAssociationReportInput {
  days: number;

  totalFoodEntries: number;

  exposures: FoodExposure[];

  bathrooms: BathroomObservation[];

  medicines: MedicineObservation[];
}

interface MealWindow extends MealWindowBoundary {
  foodIds: Set<string>;
}

interface MealWindowStats {
  totalWindows: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
}

interface StabilityResult {
  stability: AssociationStability;

  score: number | null;

  stableCount: number;
}

export function isBathroomAdverse(bathroom: BathroomObservation) {
  const bristolAdverse = bathroom.bristolType <= 2 || bathroom.bristolType >= 6;

  const urgencyAdverse = (bathroom.urgency ?? 0) >= 2;

  const painAdverse = (bathroom.painLevel ?? 0) >= 2;

  return bristolAdverse || urgencyAdverse || painAdverse;
}

function getBathroomSeverity(bathroom: BathroomObservation) {
  let bristolSeverity = 0;

  if (bathroom.bristolType === 1 || bathroom.bristolType === 7) {
    bristolSeverity = 1;
  } else if (bathroom.bristolType === 2 || bathroom.bristolType === 6) {
    bristolSeverity = 0.65;
  }

  const urgencySeverity = (bathroom.urgency ?? 0) / 4;

  const painSeverity = (bathroom.painLevel ?? 0) / 4;

  return Math.max(bristolSeverity, urgencySeverity, painSeverity);
}

function getConfidence(evaluableExposures: number): AssociationConfidence {
  if (evaluableExposures >= 8) {
    return "high";
  }

  if (evaluableExposures >= 4) {
    return "medium";
  }

  return "low";
}

function getSignal(
  evaluableExposures: number,
  adjustedAdverseRate: number,
  excessRate: number,
): AssociationSignal {
  if (evaluableExposures < 3) {
    return "insufficient";
  }

  if (excessRate >= 0.25 && adjustedAdverseRate >= 0.55) {
    return "high";
  }

  if (excessRate >= 0.12 && adjustedAdverseRate >= 0.4) {
    return "medium";
  }

  return "low";
}

function getAdjustedRate(
  adverseExposures: number,
  evaluableExposures: number,
  baselineAdverseRate: number,
) {
  if (evaluableExposures === 0) {
    return baselineAdverseRate;
  }

  return (
    (adverseExposures + baselineAdverseRate * PRIOR_WEIGHT) /
    (evaluableExposures + PRIOR_WEIGHT)
  );
}

function getStability({
  outcomes,
  baselineAdverseRate,
  comparisonSource,
  originalSignal,
}: {
  outcomes: boolean[];

  baselineAdverseRate: number;

  comparisonSource: AssociationComparisonSource;

  originalSignal: AssociationSignal;
}): StabilityResult {
  /*
   * Sin un control separado no declaramos estabilidad
   * estadística de la etiqueta.
   */
  if (
    comparisonSource !== "food_absent" ||
    originalSignal === "insufficient" ||
    outcomes.length < 4
  ) {
    return {
      stability: "insufficient",

      score: null,

      stableCount: 0,
    };
  }

  let stableCount = 0;

  const totalAdverse = outcomes.filter(Boolean).length;

  for (const outcome of outcomes) {
    const evaluable = outcomes.length - 1;

    const adverse = totalAdverse - (outcome ? 1 : 0);

    const adjusted = getAdjustedRate(adverse, evaluable, baselineAdverseRate);

    const excess = adjusted - baselineAdverseRate;

    const signal = getSignal(evaluable, adjusted, excess);

    if (signal === originalSignal) {
      stableCount += 1;
    }
  }

  const score = stableCount / outcomes.length;

  if (outcomes.length >= 8 && score >= 0.9) {
    return {
      stability: "high",

      score,

      stableCount,
    };
  }

  if (score >= 0.75) {
    return {
      stability: "medium",

      score,

      stableCount,
    };
  }

  return {
    stability: "low",

    score,

    stableCount,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function dedupeFoodExposures(exposures: FoodExposure[]) {
  const seen = new Set<string>();

  const deduped: FoodExposure[] = [];

  for (const exposure of exposures) {
    const key = `${exposure.foodId}::${exposure.entryId}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    deduped.push(exposure);
  }

  return deduped;
}

function buildMealWindows(exposures: FoodExposure[]): MealWindow[] {
  const boundaries = buildMealWindowBoundaries(exposures);

  const foodIdsByEntry = new Map<string, Set<string>>();

  for (const exposure of exposures) {
    const current = foodIdsByEntry.get(exposure.entryId) ?? new Set<string>();

    current.add(exposure.foodId);

    foodIdsByEntry.set(exposure.entryId, current);
  }

  return boundaries.map((boundary) => ({
    ...boundary,

    foodIds: foodIdsByEntry.get(boundary.entryId) ?? new Set<string>(),
  }));
}

function getLinkedBathrooms(
  window: MealWindowBoundary,
  bathrooms: BathroomObservation[],
) {
  return bathrooms.filter((bathroom) =>
    isEventInsideMealWindow(window, bathroom.occurredAt, OUTCOME_WINDOW_HOURS),
  );
}

function evaluateMealWindows(
  windows: MealWindow[],
  bathrooms: BathroomObservation[],
): MealWindowStats {
  let evaluableExposures = 0;

  let adverseExposures = 0;

  for (const window of windows) {
    const linkedBathrooms = getLinkedBathrooms(window, bathrooms);

    if (linkedBathrooms.length === 0) {
      continue;
    }

    evaluableExposures += 1;

    if (linkedBathrooms.some(isBathroomAdverse)) {
      adverseExposures += 1;
    }
  }

  return {
    totalWindows: windows.length,

    evaluableExposures,

    adverseExposures,

    adverseRate:
      evaluableExposures > 0 ? adverseExposures / evaluableExposures : 0,
  };
}

export function buildAssociationReport({
  days,
  totalFoodEntries,
  exposures,
  bathrooms,
  medicines,
}: BuildAssociationReportInput): AssociationReport {
  const adverseBathrooms = bathrooms.filter(isBathroomAdverse);

  const bathroomEventAdverseRate =
    bathrooms.length > 0 ? adverseBathrooms.length / bathrooms.length : 0;

  const uniqueExposures = dedupeFoodExposures(exposures);

  const mealWindows = buildMealWindows(uniqueExposures);

  const mealWindowByEntry = new Map(
    mealWindows.map((window) => [window.entryId, window]),
  );

  const globalMealStats = evaluateMealWindows(mealWindows, bathrooms);

  const totalTruncatedMealWindows = mealWindows.filter((window) =>
    isMealWindowTruncated(window, OUTCOME_WINDOW_HOURS),
  ).length;

  const exposuresByFood = new Map<string, FoodExposure[]>();

  for (const exposure of uniqueExposures) {
    const current = exposuresByFood.get(exposure.foodId) ?? [];

    current.push(exposure);

    exposuresByFood.set(exposure.foodId, current);
  }

  const associations: FoodAssociation[] = [];

  for (const [foodId, foodExposures] of exposuresByFood) {
    let evaluableExposures = 0;

    let adverseExposures = 0;

    let totalSeverity = 0;

    let medicineOverlapExposures = 0;

    let truncatedExposures = 0;

    const evaluableOutcomes: boolean[] = [];

    for (const exposure of foodExposures) {
      const window = mealWindowByEntry.get(exposure.entryId) ?? {
        entryId: exposure.entryId,

        eatenAt: exposure.eatenAt,

        nextMealAt: null,

        foodIds: new Set([exposure.foodId]),
      };

      if (isMealWindowTruncated(window, OUTCOME_WINDOW_HOURS)) {
        truncatedExposures += 1;
      }

      const linkedBathrooms = getLinkedBathrooms(window, bathrooms);

      if (linkedBathrooms.length > 0) {
        evaluableExposures += 1;

        const adverse = linkedBathrooms.some(isBathroomAdverse);

        evaluableOutcomes.push(adverse);

        if (adverse) {
          adverseExposures += 1;
        }

        const worstSeverity = Math.max(
          ...linkedBathrooms.map(getBathroomSeverity),
        );

        totalSeverity += worstSeverity;
      }

      const medicineOverlap = medicines.some((medicine) =>
        isEventInsideMealWindow(
          window,
          medicine.occurredAt,
          OUTCOME_WINDOW_HOURS,
        ),
      );

      if (medicineOverlap) {
        medicineOverlapExposures += 1;
      }
    }

    const controlWindows = mealWindows.filter(
      (window) => !window.foodIds.has(foodId),
    );

    const controlStats = evaluateMealWindows(controlWindows, bathrooms);

    const comparisonSource: AssociationComparisonSource =
      controlStats.evaluableExposures > 0 ? "food_absent" : "all_meals";

    const comparisonStats =
      comparisonSource === "food_absent" ? controlStats : globalMealStats;

    const baselineAdverseRate = comparisonStats.adverseRate;

    const adverseRate =
      evaluableExposures > 0 ? adverseExposures / evaluableExposures : 0;

    const adjustedAdverseRate = getAdjustedRate(
      adverseExposures,
      evaluableExposures,
      baselineAdverseRate,
    );

    const excessRate = adjustedAdverseRate - baselineAdverseRate;

    const absoluteRiskDifference = adverseRate - baselineAdverseRate;

    const relativeRisk =
      comparisonSource === "food_absent" &&
      evaluableExposures > 0 &&
      comparisonStats.evaluableExposures > 0 &&
      baselineAdverseRate > 0
        ? adverseRate / baselineAdverseRate
        : null;

    const averageSeverity =
      evaluableExposures > 0 ? totalSeverity / evaluableExposures : 0;

    const confidence = getConfidence(evaluableExposures);

    const signal = getSignal(
      evaluableExposures,
      adjustedAdverseRate,
      excessRate,
    );

    const stabilityResult = getStability({
      outcomes: evaluableOutcomes,

      baselineAdverseRate,

      comparisonSource,

      originalSignal: signal,
    });

    const evidenceFactor = clamp(evaluableExposures / 8, 0, 1);

    const positiveExcess = Math.max(0, excessRate);

    const rankScore =
      (positiveExcess * 0.65 +
        adjustedAdverseRate * 0.25 +
        averageSeverity * 0.1) *
      evidenceFactor;

    associations.push({
      foodId,

      foodName: foodExposures[0]?.foodName ?? "Alimento",

      totalExposures: foodExposures.length,

      evaluableExposures,

      adverseExposures,

      adverseRate,

      adjustedAdverseRate,

      baselineAdverseRate,

      excessRate,

      absoluteRiskDifference,

      relativeRisk,

      controlEvaluableExposures: controlStats.evaluableExposures,

      controlAdverseExposures: controlStats.adverseExposures,

      comparisonEvaluableExposures: comparisonStats.evaluableExposures,

      comparisonAdverseExposures: comparisonStats.adverseExposures,

      comparisonSource,

      averageSeverity,

      medicineOverlapExposures,

      truncatedExposures,

      stability: stabilityResult.stability,

      stabilityScore: stabilityResult.score,

      stableLeaveOneOutExposures: stabilityResult.stableCount,

      signal,

      confidence,

      rankScore,
    });
  }

  associations.sort((left, right) => {
    if (right.rankScore !== left.rankScore) {
      return right.rankScore - left.rankScore;
    }

    return right.evaluableExposures - left.evaluableExposures;
  });

  return {
    days,

    generatedAt: new Date().toISOString(),

    totalFoodEntries,

    totalFoodExposures: uniqueExposures.length,

    totalBathroomEntries: bathrooms.length,

    baselineAdverseRate: globalMealStats.adverseRate,

    totalMealWindows: globalMealStats.totalWindows,

    totalEvaluableMealWindows: globalMealStats.evaluableExposures,

    totalAdverseMealWindows: globalMealStats.adverseExposures,

    totalTruncatedMealWindows,

    bathroomEventAdverseRate,

    associations,
  };
}
