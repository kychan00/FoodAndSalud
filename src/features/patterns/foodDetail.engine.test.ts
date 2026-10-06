import { describe, expect, it } from "vitest";

import { buildFoodDetailReport } from "./foodDetail.engine";

describe("food detail engine", () => {
  it("distinguishes 6h, 12h and 24h windows", () => {
    const report = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "entry-1",

          eatenAt: "2026-10-01T08:00:00Z",

          mealType: "breakfast",

          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "bath-1",

          occurredAt: "2026-10-01T18:00:00Z",

          bristolType: 7,

          urgency: 3,
          painLevel: 1,
        },
      ],

      medicines: [],
    });

    const window6 = report.windows.find((item) => item.hours === 6);

    const window12 = report.windows.find((item) => item.hours === 12);

    const window24 = report.windows.find((item) => item.hours === 24);

    expect(window6?.evaluableExposures).toBe(0);

    expect(window12?.adverseExposures).toBe(1);

    expect(window24?.adverseExposures).toBe(1);
  });

  it("does not count missing bathroom data as a normal outcome", () => {
    const report = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "entry-1",

          eatenAt: "2026-10-01T08:00:00Z",

          mealType: "breakfast",

          coFoods: [],
        },
      ],

      bathrooms: [],
      medicines: [],
    });

    expect(
      report.windows.find((item) => item.hours === 24)?.evaluableExposures,
    ).toBe(0);

    expect(report.history[0]?.firstBathroom).toBeNull();
  });

  it("counts co-occurring foods once per exposure", () => {
    const report = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "entry-1",

          eatenAt: "2026-10-01T08:00:00Z",

          mealType: "breakfast",

          coFoods: [
            {
              foodId: "milk",

              foodName: "Leche",
            },
            {
              foodId: "bread",

              foodName: "Pan",
            },
          ],
        },

        {
          entryId: "entry-2",

          eatenAt: "2026-10-02T08:00:00Z",

          mealType: "breakfast",

          coFoods: [
            {
              foodId: "milk",

              foodName: "Leche",
            },
          ],
        },
      ],

      bathrooms: [],
      medicines: [],
    });

    expect(report.coOccurrences[0]?.foodName).toBe("Leche");

    expect(report.coOccurrences[0]?.count).toBe(2);

    expect(report.coOccurrences[0]?.share).toBe(1);
  });

  it("calculates elapsed hours to the first bathroom event", () => {
    const report = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "entry-1",

          eatenAt: "2026-10-01T08:00:00Z",

          mealType: "breakfast",

          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "bath-1",

          occurredAt: "2026-10-01T11:30:00Z",

          bristolType: 4,

          urgency: 0,
          painLevel: 0,
        },
      ],

      medicines: [],
    });

    expect(report.history[0]?.firstBathroom?.elapsedHours).toBe(3.5);
  });
});
