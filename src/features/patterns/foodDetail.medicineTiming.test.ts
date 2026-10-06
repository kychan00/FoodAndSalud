import { describe, expect, it } from "vitest";

import { buildFoodDetailReport } from "./foodDetail.engine";

describe("pre-meal Medicine window", () => {
  it("includes exactly six hours before and excludes older events", () => {
    const report = buildFoodDetailReport({
      foodId: "coffee",

      foodName: "Café",

      days: 90,

      exposures: [
        {
          entryId: "meal-1",

          eatenAt: "2026-10-01T12:00:00Z",

          mealType: "lunch",

          coFoods: [],
        },
      ],

      bathrooms: [
        {
          id: "bath-1",

          occurredAt: "2026-10-01T16:00:00Z",

          bristolType: 4,

          urgency: 0,

          painLevel: 0,
        },
      ],

      medicines: [
        {
          id: "exact-six",

          medicineId: "medicine-a",

          medicineName: "Medicamento A",

          occurredAt: "2026-10-01T06:00:00Z",
        },

        {
          id: "too-old",

          medicineId: "medicine-b",

          medicineName: "Medicamento B",

          occurredAt: "2026-10-01T05:59:00Z",
        },

        {
          id: "after",

          medicineId: "medicine-c",

          medicineName: "Medicamento C",

          occurredAt: "2026-10-01T13:00:00Z",
        },
      ],
    });

    const item = report.history[0];

    expect(item?.medicinesBefore.map((medicine) => medicine.id)).toEqual([
      "exact-six",
    ]);

    expect(item?.medicines.map((medicine) => medicine.id)).toEqual(["after"]);

    expect(item?.medicinesBefore[0]?.elapsedHours).toBe(-6);

    expect(item?.medicines[0]?.elapsedHours).toBe(1);
  });
});
