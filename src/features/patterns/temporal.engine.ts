import { isBathroomAdverse } from "./association.engine";

import type { BathroomObservation } from "./association.types";

import type {
  FoodDetailReport,
  FoodDetailMealContext,
} from "./foodDetail.types";

import { isEventInsideMealWindow } from "./mealWindow";

import type {
  TemporalPeriodStats,
  TemporalPersistenceReport,
  TemporalPersistenceStatus,
} from "./temporal.types";

const WINDOW_HOURS = 24;

const MIN_EVALUABLE_PER_GROUP = 2;

const ELEVATED_DIFFERENCE = 0.25;

const LOW_DIFFERENCE = 0.12;

interface WindowStats {
  totalWindows: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
}

function evaluateWindows(
  windows: FoodDetailMealContext[],
  bathrooms: BathroomObservation[],
): WindowStats {
  let evaluableExposures = 0;

  let adverseExposures = 0;

  for (const window of windows) {
    const linked = bathrooms.filter((bathroom) =>
      isEventInsideMealWindow(window, bathroom.occurredAt, WINDOW_HOURS),
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
    totalWindows: windows.length,

    evaluableExposures,

    adverseExposures,

    adverseRate:
      evaluableExposures > 0 ? adverseExposures / evaluableExposures : 0,
  };
}

function buildPeriod({
  id,
  label,
  windows,
  targetEntryIds,
  bathrooms,
}: {
  id: "older" | "recent";

  label: string;

  windows: FoodDetailMealContext[];

  targetEntryIds: Set<string>;

  bathrooms: BathroomObservation[];
}): TemporalPeriodStats {
  const foodWindows = windows.filter((window) =>
    targetEntryIds.has(window.entryId),
  );

  const comparisonWindows = windows.filter(
    (window) => !targetEntryIds.has(window.entryId),
  );

  const foodStats = evaluateWindows(foodWindows, bathrooms);

  const comparisonStats = evaluateWindows(comparisonWindows, bathrooms);

  const absoluteRiskDifference =
    foodStats.evaluableExposures > 0 && comparisonStats.evaluableExposures > 0
      ? foodStats.adverseRate - comparisonStats.adverseRate
      : null;

  return {
    id,

    label,

    startAt: windows[0]?.eatenAt ?? null,

    endAt: windows[windows.length - 1]?.eatenAt ?? null,

    totalMealWindows: windows.length,

    foodTotalWindows: foodStats.totalWindows,

    foodEvaluableExposures: foodStats.evaluableExposures,

    foodAdverseExposures: foodStats.adverseExposures,

    foodAdverseRate: foodStats.adverseRate,

    comparisonTotalWindows: comparisonStats.totalWindows,

    comparisonEvaluableExposures: comparisonStats.evaluableExposures,

    comparisonAdverseExposures: comparisonStats.adverseExposures,

    comparisonAdverseRate: comparisonStats.adverseRate,

    absoluteRiskDifference,
  };
}

function hasEnoughData(period: TemporalPeriodStats) {
  return (
    period.foodEvaluableExposures >= MIN_EVALUABLE_PER_GROUP &&
    period.comparisonEvaluableExposures >= MIN_EVALUABLE_PER_GROUP &&
    period.absoluteRiskDifference !== null
  );
}

function classifyStatus(
  older: TemporalPeriodStats,
  recent: TemporalPeriodStats,
): TemporalPersistenceStatus {
  if (!hasEnoughData(older) || !hasEnoughData(recent)) {
    return "insufficient";
  }

  const olderDifference = older.absoluteRiskDifference ?? 0;

  const recentDifference = recent.absoluteRiskDifference ?? 0;

  const olderElevated = olderDifference >= ELEVATED_DIFFERENCE;

  const recentElevated = recentDifference >= ELEVATED_DIFFERENCE;

  const olderLow = olderDifference <= LOW_DIFFERENCE;

  const recentLow = recentDifference <= LOW_DIFFERENCE;

  if (olderElevated && recentElevated) {
    return "persistent";
  }

  if (olderLow && recentElevated) {
    return "recent";
  }

  if (olderElevated && recentLow) {
    return "weakened";
  }

  if (Math.abs(recentDifference - olderDifference) <= LOW_DIFFERENCE) {
    return "stable";
  }

  return "variable";
}

export function buildTemporalPersistenceReport(
  report: FoodDetailReport,
): TemporalPersistenceReport {
  const chronological = [...report.mealContext].sort(
    (left, right) =>
      new Date(left.eatenAt).getTime() - new Date(right.eatenAt).getTime(),
  );

  const midpoint = Math.floor(chronological.length / 2);

  const olderWindows = chronological.slice(0, midpoint);

  const recentWindows = chronological.slice(midpoint);

  const targetEntryIds = new Set(report.history.map((item) => item.entryId));

  const older = buildPeriod({
    id: "older",

    label: "Periodo anterior",

    windows: olderWindows,

    targetEntryIds,

    bathrooms: report.bathrooms,
  });

  const recent = buildPeriod({
    id: "recent",

    label: "Periodo reciente",

    windows: recentWindows,

    targetEntryIds,

    bathrooms: report.bathrooms,
  });

  const status = classifyStatus(older, recent);

  const differenceChange =
    older.absoluteRiskDifference !== null &&
    recent.absoluteRiskDifference !== null
      ? recent.absoluteRiskDifference - older.absoluteRiskDifference
      : null;

  return {
    status,

    older,

    recent,

    differenceChange,

    minimumEvaluablePerGroup: MIN_EVALUABLE_PER_GROUP,
  };
}
