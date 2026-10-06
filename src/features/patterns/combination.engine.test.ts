import { describe, expect, it } from "vitest";

import { buildFoodCombinationReport } from "./combination.engine";

import { buildFoodDetailReport } from "./foodDetail.engine";

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

    urgency?: number;

    painLevel?: number;
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
      id: item.id,

      occurredAt: item.occurredAt,

      bristolType: item.bristolType,

      urgency: item.urgency ?? 0,

      painLevel: item.painLevel ?? 0,
    })),

    medicines: [],
  });
}

function getWindow(
  report: ReturnType<typeof buildFoodCombinationReport>,
  coFoodId: string,
  hours: 6 | 12 | 24,
) {
  const comparison = report.comparisons.find(
    (item) => item.coFoodId === coFoodId,
  );

  const window = comparison?.windows.find((item) => item.hours === hours);

  if (!window) {
    throw new Error(`Missing ${hours}h window for ${coFoodId}`);
  }

  return window;
}

describe("food combination engine", () => {
  it("marks foods that always occur together as inseparable across windows", () => {
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

    expect(getWindow(report, "milk", 6).status).toBe("inseparable");

    expect(getWindow(report, "milk", 12).status).toBe("inseparable");

    expect(getWindow(report, "milk", 24).status).toBe("inseparable");
  });

  it("detects a stronger combination at all windows when events happen early", () => {
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

    for (const hours of [6, 12, 24] as const) {
      const window = getWindow(report, "milk", hours);

      expect(window.together.adverseRate).toBe(1);

      expect(window.without.adverseRate).toBe(0);

      expect(window.status).toBe("higher_with");
    }
  });

  it("detects a delayed pattern that appears at 12h but not at 6h", () => {
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
        /*
         * Con Leche:
         * 4h -> normal
         * 10h -> marcado
         */
        {
          id: "b1-normal",
          occurredAt: "2026-09-01T12:00:00Z",
          bristolType: 4,
        },
        {
          id: "b1-late",
          occurredAt: "2026-09-01T18:00:00Z",
          bristolType: 7,
        },
        {
          id: "b2-normal",
          occurredAt: "2026-09-02T12:00:00Z",
          bristolType: 4,
        },
        {
          id: "b2-late",
          occurredAt: "2026-09-02T18:00:00Z",
          bristolType: 6,
        },

        /*
         * Sin Leche:
         * sólo respuesta normal a 4h.
         */
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

    const h6 = getWindow(report, "milk", 6);

    const h12 = getWindow(report, "milk", 12);

    const h24 = getWindow(report, "milk", 24);

    expect(h6.together.adverseRate).toBe(0);

    expect(h6.without.adverseRate).toBe(0);

    expect(h6.status).toBe("similar");

    expect(h12.together.adverseRate).toBe(1);

    expect(h12.without.adverseRate).toBe(0);

    expect(h12.status).toBe("higher_with");

    expect(h24.status).toBe("higher_with");
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

    expect(getWindow(report, "milk", 24).status).toBe("lower_with");
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

    expect(getWindow(report, "milk", 24).status).toBe("similar");
  });

  it("keeps missing observations non evaluable for every window", () => {
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

    for (const window of report.exactSoloWindows) {
      expect(window.stats.evaluableExposures).toBe(0);
    }
  });
});
