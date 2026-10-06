import type {
  AssociationConfidence,
  AssociationComparisonSource,
  AssociationReport,
  AssociationSignal,
  BathroomObservation,
  FoodAssociation,
  FoodExposure,
  MedicineObservation,
} from "./association.types";

const OUTCOME_WINDOW_HOURS = 24;

const OUTCOME_WINDOW_MS = OUTCOME_WINDOW_HOURS * 60 * 60 * 1000;

const PRIOR_WEIGHT = 4;

interface BuildAssociationReportInput {
  days: number;

  totalFoodEntries: number;

  exposures: FoodExposure[];

  bathrooms: BathroomObservation[];

  medicines: MedicineObservation[];
}

interface MealWindow {
  entryId: string;

  eatenAt: string;

  foodIds: Set<string>;
}

interface MealWindowStats {
  totalWindows: number;

  evaluableExposures: number;

  adverseExposures: number;

  adverseRate: number;
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isWithinOutcomeWindow(start: number, candidate: string) {
  const candidateTime = new Date(candidate).getTime();

  const difference = candidateTime - start;

  return difference > 0 && difference <= OUTCOME_WINDOW_MS;
}

function buildMealWindows(exposures: FoodExposure[]) {
  const windows = new Map<string, MealWindow>();

  for (const exposure of exposures) {
    const current = windows.get(exposure.entryId);

    if (current) {
      current.foodIds.add(exposure.foodId);

      continue;
    }

    windows.set(exposure.entryId, {
      entryId: exposure.entryId,

      eatenAt: exposure.eatenAt,

      foodIds: new Set([exposure.foodId]),
    });
  }

  return [...windows.values()];
}

function evaluateMealWindows(
  windows: MealWindow[],
  bathrooms: BathroomObservation[],
): MealWindowStats {
  let evaluableExposures = 0;

  let adverseExposures = 0;

  for (const window of windows) {
    const eatenAt = new Date(window.eatenAt).getTime();

    const linkedBathrooms = bathrooms.filter((bathroom) =>
      isWithinOutcomeWindow(eatenAt, bathroom.occurredAt),
    );

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

  /*
   * Una misma comida puede contener múltiples alimentos.
   *
   * Para la referencia global se cuenta UNA sola ventana
   * por food_entry.
   */
  const mealWindows = buildMealWindows(exposures);

  const globalMealStats = evaluateMealWindows(mealWindows, bathrooms);

  /*
   * Evita que el mismo alimento repetido accidentalmente
   * dentro de una misma comida infle sus exposiciones.
   */
  const uniqueExposures = dedupeFoodExposures(exposures);

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

    for (const exposure of foodExposures) {
      const eatenAt = new Date(exposure.eatenAt).getTime();

      const linkedBathrooms = bathrooms.filter((bathroom) =>
        isWithinOutcomeWindow(eatenAt, bathroom.occurredAt),
      );

      if (linkedBathrooms.length > 0) {
        evaluableExposures += 1;

        const adverse = linkedBathrooms.some(isBathroomAdverse);

        if (adverse) {
          adverseExposures += 1;
        }

        const worstSeverity = Math.max(
          ...linkedBathrooms.map(getBathroomSeverity),
        );

        totalSeverity += worstSeverity;
      }

      const medicineOverlap = medicines.some((medicine) =>
        isWithinOutcomeWindow(eatenAt, medicine.occurredAt),
      );

      if (medicineOverlap) {
        medicineOverlapExposures += 1;
      }
    }

    /*
     * CONTROL INTERNO:
     *
     * ventanas de comida donde el alimento objetivo
     * NO estuvo presente.
     */
    const controlWindows = mealWindows.filter(
      (window) => !window.foodIds.has(foodId),
    );

    const controlStats = evaluateMealWindows(controlWindows, bathrooms);

    const comparisonSource: AssociationComparisonSource =
      controlStats.evaluableExposures > 0 ? "food_absent" : "all_meals";

    /*
     * Si existen comidas evaluables sin el alimento,
     * son el comparador principal.
     *
     * Si el alimento aparece en todas las comidas,
     * usamos la referencia global de ventanas de comida.
     *
     * Esto es conservador: si el alimento está presente
     * siempre, la aplicación no inventa un control inexistente.
     */
    const baselineAdverseRate =
      comparisonSource === "food_absent"
        ? controlStats.adverseRate
        : globalMealStats.adverseRate;

    const adverseRate =
      evaluableExposures > 0 ? adverseExposures / evaluableExposures : 0;

    const adjustedAdverseRate =
      evaluableExposures > 0
        ? (adverseExposures + baselineAdverseRate * PRIOR_WEIGHT) /
          (evaluableExposures + PRIOR_WEIGHT)
        : baselineAdverseRate;

    const excessRate = adjustedAdverseRate - baselineAdverseRate;

    const averageSeverity =
      evaluableExposures > 0 ? totalSeverity / evaluableExposures : 0;

    const confidence = getConfidence(evaluableExposures);

    const signal = getSignal(
      evaluableExposures,
      adjustedAdverseRate,
      excessRate,
    );

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

      controlEvaluableExposures: controlStats.evaluableExposures,

      controlAdverseExposures: controlStats.adverseExposures,

      comparisonSource,

      averageSeverity,

      medicineOverlapExposures,

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

    bathroomEventAdverseRate,

    associations,
  };
}
