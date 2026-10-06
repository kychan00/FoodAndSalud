import type {
  AssociationConfidence,
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

export function buildAssociationReport({
  days,
  totalFoodEntries,
  exposures,
  bathrooms,
  medicines,
}: BuildAssociationReportInput): AssociationReport {
  const adverseBathrooms = bathrooms.filter(isBathroomAdverse);

  const baselineAdverseRate =
    bathrooms.length > 0 ? adverseBathrooms.length / bathrooms.length : 0;

  const exposuresByFood = new Map<string, FoodExposure[]>();

  for (const exposure of exposures) {
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
    totalFoodExposures: exposures.length,

    totalBathroomEntries: bathrooms.length,

    baselineAdverseRate,

    associations,
  };
}
