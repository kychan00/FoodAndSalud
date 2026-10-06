export interface MealWindowBoundary {
  entryId: string;

  eatenAt: string;

  nextMealAt: string | null;
}

const HOUR_MS = 60 * 60 * 1000;

export function buildMealWindowBoundaries(
  exposures: Array<{
    entryId: string;
    eatenAt: string;
  }>,
): MealWindowBoundary[] {
  const byEntry = new Map<string, string>();

  for (const exposure of exposures) {
    const current = byEntry.get(exposure.entryId);

    if (
      !current ||
      new Date(exposure.eatenAt).getTime() < new Date(current).getTime()
    ) {
      byEntry.set(exposure.entryId, exposure.eatenAt);
    }
  }

  const meals = [...byEntry.entries()]
    .map(([entryId, eatenAt]) => ({
      entryId,
      eatenAt,
    }))
    .sort(
      (left, right) =>
        new Date(left.eatenAt).getTime() - new Date(right.eatenAt).getTime(),
    );

  return meals.map((meal, index) => {
    const start = new Date(meal.eatenAt).getTime();

    const nextMeal = meals
      .slice(index + 1)
      .find((candidate) => new Date(candidate.eatenAt).getTime() > start);

    return {
      entryId: meal.entryId,

      eatenAt: meal.eatenAt,

      nextMealAt: nextMeal?.eatenAt ?? null,
    };
  });
}

export function getMealWindowEnd(boundary: MealWindowBoundary, hours: number) {
  const start = new Date(boundary.eatenAt).getTime();

  const nominalEnd = start + hours * HOUR_MS;

  if (boundary.nextMealAt) {
    const nextMeal = new Date(boundary.nextMealAt).getTime();

    if (nextMeal > start && nextMeal <= nominalEnd) {
      return {
        end: nextMeal,

        truncated: true,
      };
    }
  }

  return {
    end: nominalEnd,

    truncated: false,
  };
}

export function isMealWindowTruncated(
  boundary: MealWindowBoundary,
  hours: number,
) {
  return getMealWindowEnd(boundary, hours).truncated;
}

export function getEffectiveMealWindowHours(
  boundary: MealWindowBoundary,
  hours: number,
) {
  const start = new Date(boundary.eatenAt).getTime();

  const { end } = getMealWindowEnd(boundary, hours);

  return (end - start) / HOUR_MS;
}

export function isEventInsideMealWindow(
  boundary: MealWindowBoundary,
  eventAt: string,
  hours: number,
) {
  const start = new Date(boundary.eatenAt).getTime();

  const event = new Date(eventAt).getTime();

  const { end, truncated } = getMealWindowEnd(boundary, hours);

  if (event <= start) {
    return false;
  }

  /*
   * Cuando otra comida interrumpe la ventana,
   * un evento exactamente a la hora de esa comida
   * ya no pertenece a la comida anterior.
   */
  if (truncated) {
    return event < end;
  }

  return event <= end;
}
