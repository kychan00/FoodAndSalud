import { describe, expect, it } from "vitest";

import { buildFoodDetailReport } from "./foodDetail.engine";

import { buildFoodCombinationReport } from "./combination.engine";

function buildReport({
  exposures,
  bathrooms,
}: {
  exposures: Array<{
    entryId: string;
    eatenAt: string;
    coFoods: Array<{
      foodId: string;
      foodName: string;
    }>;
  }>;

  bathrooms: Array<{
    id: string;
    occurredAt: string;
    bristolType: number;
  }>;
}) {
  return buildFoodDetailReport({
    foodId: "coffee",

    foodName: "Café",

    days: 90,

    exposures: exposures.map((item) => ({
      ...item,
      mealType: "breakfast",
    })),

    bathrooms: bathrooms.map((item) => ({
      ...item,
      urgency: 0,
      painLevel: 0,
    })),

    medicines: [],
  });
}

describe("food combination engine", () => {
  it("marks foods that always occur together as inseparable", () => {
    const detail = buildReport({
      exposures: [
        {
          entryId: "1",

          eatenAt: "2026-09-01T08:00:00Z",

          coFoods: [
            {
              foodId: "milk",

              foodName: "Leche",
            },
          ],
        },

        {
          entryId: "2",

          eatenAt: "2026-09-02T08:00:00Z",

          coFoods: [
            {
              foodId: "milk",

              foodName: "Leche",
            },
          ],
        },
      ],

      bathrooms: [
        {
          id: "b1",
          occurredAt: "2026-09-01T12:00:00Z",
          bristolType: 7,
        },
        {
          id: "b2",
          occurredAt: "2026-09-02T12:00:00Z",
          bristolType: 7,
        },
      ],
    });

    const report = buildFoodCombinationReport(detail);

    expect(report.comparisons[0]?.status).toBe("inseparable");
  });

  it("detects a higher coincidence with a combination", () => {
    const detail = buildReport({
      exposures: [
        {
          entryId: "1",
          eatenAt: "2026-09-01T08:00:00Z",
          coFoods: [
            {
              foodId: "milk",
              foodName: "Leche",
            },
          ],
        },
        {
          entryId: "2",
          eatenAt: "2026-09-02T08:00:00Z",
          coFoods: [
            {
              foodId: "milk",
              foodName: "Leche",
            },
          ],
        },
        {
          entryId: "3",
          eatenAt: "2026-09-03T08:00:00Z",
          coFoods: [],
        },
        {
          entryId: "4",
          eatenAt: "2026-09-04T08:00:00Z",
          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "b1",
          occurredAt: "2026-09-01T12:00:00Z",
          bristolType: 7,
        },
        {
          id: "b2",
          occurredAt: "2026-09-02T12:00:00Z",
          bristolType: 6,
        },
        {
          id: "b3",
          occurredAt: "2026-09-03T12:00:00Z",
          bristolType: 4,
        },
        {
          id: "b4",
          occurredAt: "2026-09-04T12:00:00Z",
          bristolType: 4,
        },
      ],
    });

    const report = buildFoodCombinationReport(detail);

    const milk = report.comparisons[0];

    expect(milk?.together.adverseRate).toBe(1);

    expect(milk?.without.adverseRate).toBe(0);

    expect(milk?.status).toBe("higher_with");
  });

  it("detects a lower coincidence with a combination", () => {
    const detail = buildReport({
      exposures: [
        {
          entryId: "1",
          eatenAt: "2026-09-01T08:00:00Z",
          coFoods: [
            {
              foodId: "milk",
              foodName: "Leche",
            },
          ],
        },
        {
          entryId: "2",
          eatenAt: "2026-09-02T08:00:00Z",
          coFoods: [
            {
              foodId: "milk",
              foodName: "Leche",
            },
          ],
        },
        {
          entryId: "3",
          eatenAt: "2026-09-03T08:00:00Z",
          coFoods: [],
        },
        {
          entryId: "4",
          eatenAt: "2026-09-04T08:00:00Z",
          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "b1",
          occurredAt: "2026-09-01T12:00:00Z",
          bristolType: 4,
        },
        {
          id: "b2",
          occurredAt: "2026-09-02T12:00:00Z",
          bristolType: 4,
        },
        {
          id: "b3",
          occurredAt: "2026-09-03T12:00:00Z",
          bristolType: 7,
        },
        {
          id: "b4",
          occurredAt: "2026-09-04T12:00:00Z",
          bristolType: 6,
        },
      ],
    });

    const report = buildFoodCombinationReport(detail);

    expect(report.comparisons[0]?.status).toBe("lower_with");
  });

  it("marks similar rates as similar", () => {
    const detail = buildReport({
      exposures: [
        {
          entryId: "1",
          eatenAt: "2026-09-01T08:00:00Z",
          coFoods: [
            {
              foodId: "milk",
              foodName: "Leche",
            },
          ],
        },
        {
          entryId: "2",
          eatenAt: "2026-09-02T08:00:00Z",
          coFoods: [
            {
              foodId: "milk",
              foodName: "Leche",
            },
          ],
        },
        {
          entryId: "3",
          eatenAt: "2026-09-03T08:00:00Z",
          coFoods: [],
        },
        {
          entryId: "4",
          eatenAt: "2026-09-04T08:00:00Z",
          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "b1",
          occurredAt: "2026-09-01T12:00:00Z",
          bristolType: 7,
        },
        {
          id: "b2",
          occurredAt: "2026-09-02T12:00:00Z",
          bristolType: 4,
        },
        {
          id: "b3",
          occurredAt: "2026-09-03T12:00:00Z",
          bristolType: 7,
        },
        {
          id: "b4",
          occurredAt: "2026-09-04T12:00:00Z",
          bristolType: 4,
        },
      ],
    });

    const report = buildFoodCombinationReport(detail);

    expect(report.comparisons[0]?.status).toBe("similar");
  });

  it("keeps missing bathroom observations non evaluable", () => {
    const detail = buildReport({
      exposures: [
        {
          entryId: "1",
          eatenAt: "2026-09-01T08:00:00Z",
          coFoods: [],
        },
      ],

      bathrooms: [],
    });

    const report = buildFoodCombinationReport(detail);

    expect(report.exactSolo.evaluableExposures).toBe(0);
  });
});
