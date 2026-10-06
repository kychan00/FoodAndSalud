import { buildFoodDetailReport } from "../foodDetail.engine";

import type { FoodDetailExposureInput } from "../foodDetail.types";

import type { PatternQaScenario } from "./association.fixtures";

export function buildQaFoodDetailReport(
  scenario: PatternQaScenario,
  foodId: string,
) {
  const foodExposures = scenario.input.exposures.filter(
    (exposure) => exposure.foodId === foodId,
  );

  const firstExposure = foodExposures[0];

  if (!firstExposure) {
    return null;
  }

  const exposuresByEntry = new Map<string, typeof scenario.input.exposures>();

  for (const exposure of scenario.input.exposures) {
    const current = exposuresByEntry.get(exposure.entryId) ?? [];

    current.push(exposure);

    exposuresByEntry.set(exposure.entryId, current);
  }

  const detailExposures: FoodDetailExposureInput[] = foodExposures.map(
    (exposure) => {
      const sameEntry = exposuresByEntry.get(exposure.entryId) ?? [];

      const seen = new Set<string>();

      const coFoods = sameEntry
        .filter((item) => item.foodId !== foodId)
        .filter((item) => {
          if (seen.has(item.foodId)) {
            return false;
          }

          seen.add(item.foodId);

          return true;
        })
        .map((item) => ({
          foodId: item.foodId,

          foodName: item.foodName,
        }));

      return {
        entryId: exposure.entryId,

        eatenAt: exposure.eatenAt,

        mealType: "other",

        coFoods,
      };
    },
  );

  return buildFoodDetailReport({
    foodId: firstExposure.foodId,

    foodName: firstExposure.foodName,

    days: scenario.input.days,

    exposures: detailExposures,

    bathrooms: scenario.input.bathrooms,

    medicines: scenario.input.medicines,

    comparisonExposures: scenario.input.exposures,
  });
}
