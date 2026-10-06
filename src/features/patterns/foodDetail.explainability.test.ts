import { describe, expect, it } from "vitest";

import { buildFoodDetailReport } from "./foodDetail.engine";

describe("food detail explainability", () => {
  it("distinguishes first bathroom from a later adverse bathroom", () => {
    const report = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "meal-1",

          eatenAt: "2026-10-01T08:00:00Z",

          mealType: "breakfast",

          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "normal-first",

          occurredAt: "2026-10-01T12:00:00Z",

          bristolType: 4,

          urgency: 0,

          painLevel: 0,
        },

        {
          id: "adverse-later",

          occurredAt: "2026-10-01T18:00:00Z",

          bristolType: 7,

          urgency: 2,

          painLevel: 0,
        },
      ],

      medicines: [],
    });

    const item = report.history[0];

    expect(item?.bathroomCount).toBe(2);

    expect(item?.windowAdverse).toBe(true);

    expect(item?.firstBathroom?.bristolType).toBe(4);

    expect(item?.firstBathroom?.elapsedHours).toBe(4);

    expect(item?.firstAdverseBathroom?.bristolType).toBe(7);

    expect(item?.firstAdverseBathroom?.elapsedHours).toBe(10);
  });
});
