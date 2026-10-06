import { describe, expect, it } from "vitest";

import { buildFoodDetailReport } from "./foodDetail.engine";

import { buildMedicineTimingReport } from "./medicineTiming.engine";

describe("Patterns v1 Medicine timing contract", () => {
  it("keeps a Medicine present before and after in the both group only", () => {
    const detail = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "coffee-1",

          eatenAt: "2026-10-01T12:00:00Z",

          mealType: "lunch",

          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "bath-1",

          occurredAt: "2026-10-01T16:00:00Z",

          bristolType: 7,

          urgency: 2,

          painLevel: 1,
        },
      ],

      medicines: [
        {
          id: "ome-before",

          medicineId: "omeprazole",

          medicineName: "Omeprazol",

          occurredAt: "2026-10-01T10:00:00Z",

          dose: 20,

          unit: "mg",
        },

        {
          id: "ome-after",

          medicineId: "omeprazole",

          medicineName: "Omeprazol",

          occurredAt: "2026-10-01T13:00:00Z",

          dose: 20,

          unit: "mg",
        },
      ],
    });

    const timing = buildMedicineTimingReport(detail);

    const factor = timing.factors[0];

    expect(factor?.both.totalExposures).toBe(1);

    expect(factor?.beforeOnly.totalExposures).toBe(0);

    expect(factor?.afterOnly.totalExposures).toBe(0);

    expect(factor?.none.totalExposures).toBe(0);

    expect(factor?.beforeIntakeCount).toBe(1);

    expect(factor?.afterIntakeCount).toBe(1);

    expect(factor?.medianBeforeHours).toBe(2);

    expect(factor?.medianAfterHours).toBe(1);
  });
});
