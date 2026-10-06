import { describe, expect, it } from "vitest";

import { buildFoodDetailReport } from "./foodDetail.engine";

describe("Patterns v1 FoodDetail contract", () => {
  it("keeps first bathroom and first marked bathroom as separate concepts", () => {
    const detail = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "coffee-1",

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
          id: "marked-second",

          occurredAt: "2026-10-01T18:00:00Z",

          bristolType: 7,

          urgency: 2,

          painLevel: 1,
        },

        {
          id: "marked-third",

          occurredAt: "2026-10-01T20:00:00Z",

          bristolType: 6,

          urgency: 2,

          painLevel: 0,
        },
      ],

      medicines: [],
    });

    const item = detail.history[0];

    expect(item?.bathroomCount).toBe(3);

    expect(item?.firstBathroom?.id).toBe("normal-first");

    expect(item?.firstBathroom?.elapsedHours).toBe(4);

    expect(item?.firstAdverseBathroom?.id).toBe("marked-second");

    expect(item?.firstAdverseBathroom?.elapsedHours).toBe(10);

    expect(item?.windowAdverse).toBe(true);
  });
});
