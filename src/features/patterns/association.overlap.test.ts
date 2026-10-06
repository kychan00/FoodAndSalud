import { describe, expect, it } from "vitest";

import { buildAssociationReport } from "./association.engine";

describe("overlapping meal windows", () => {
  it("does not attribute an outcome after the next meal to the previous meal", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 2,

      exposures: [
        {
          entryId: "breakfast",

          foodId: "coffee",

          foodName: "Café",

          eatenAt: "2026-10-01T08:00:00Z",
        },

        {
          entryId: "lunch",

          foodId: "rice",

          foodName: "Arroz",

          eatenAt: "2026-10-01T13:00:00Z",
        },
      ],

      bathrooms: [
        {
          id: "bath-1",

          occurredAt: "2026-10-01T15:00:00Z",

          bristolType: 7,

          urgency: 2,

          painLevel: 0,
        },
      ],

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    const rice = report.associations.find((item) => item.foodId === "rice");

    expect(coffee?.evaluableExposures).toBe(0);

    expect(coffee?.truncatedExposures).toBe(1);

    expect(rice?.evaluableExposures).toBe(1);

    expect(rice?.adverseExposures).toBe(1);

    expect(report.totalTruncatedMealWindows).toBe(1);
  });

  it("still attributes an outcome before the next meal", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 2,

      exposures: [
        {
          entryId: "breakfast",

          foodId: "coffee",

          foodName: "Café",

          eatenAt: "2026-10-01T08:00:00Z",
        },

        {
          entryId: "lunch",

          foodId: "rice",

          foodName: "Arroz",

          eatenAt: "2026-10-01T13:00:00Z",
        },
      ],

      bathrooms: [
        {
          id: "bath-1",

          occurredAt: "2026-10-01T12:00:00Z",

          bristolType: 7,

          urgency: 2,

          painLevel: 0,
        },
      ],

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    expect(coffee?.evaluableExposures).toBe(1);

    expect(coffee?.adverseExposures).toBe(1);
  });
});
