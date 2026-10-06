import { describe, expect, it } from "vitest";

import {
  buildAssociationReport,
  isBathroomAdverse,
} from "./association.engine";
import type { BathroomObservation, FoodExposure } from "./association.types";

function exposure(
  foodId: string,
  foodName: string,
  date: string,
): FoodExposure {
  return {
    entryId: `${foodId}-${date}`,

    foodId,
    foodName,
    eatenAt: date,
  };
}

function bathroom(
  id: string,
  date: string,
  bristolType: number,
  urgency = 0,
  painLevel = 0,
): BathroomObservation {
  return {
    id,
    occurredAt: date,
    bristolType,
    urgency,
    painLevel,
  };
}

describe("association engine", () => {
  it("detects adverse bathroom observations", () => {
    expect(isBathroomAdverse(bathroom("1", "2026-10-01T10:00:00Z", 7))).toBe(
      true,
    );

    expect(
      isBathroomAdverse(bathroom("2", "2026-10-01T10:00:00Z", 4, 0, 0)),
    ).toBe(false);

    expect(
      isBathroomAdverse(bathroom("3", "2026-10-01T10:00:00Z", 4, 3, 0)),
    ).toBe(true);
  });

  it("ranks a repeatedly associated food above a neutral food", () => {
    const exposures = [
      exposure("coffee", "Café", "2026-10-01T08:00:00Z"),
      exposure("rice", "Arroz", "2026-10-02T08:00:00Z"),
      exposure("coffee", "Café", "2026-10-03T08:00:00Z"),
      exposure("rice", "Arroz", "2026-10-04T08:00:00Z"),
      exposure("coffee", "Café", "2026-10-05T08:00:00Z"),
      exposure("rice", "Arroz", "2026-10-06T08:00:00Z"),
      exposure("coffee", "Café", "2026-10-07T08:00:00Z"),
      exposure("rice", "Arroz", "2026-10-08T08:00:00Z"),
    ];

    const bathrooms = [
      bathroom("b1", "2026-10-01T12:00:00Z", 7, 3, 1),
      bathroom("b2", "2026-10-02T12:00:00Z", 4),
      bathroom("b3", "2026-10-03T12:00:00Z", 6, 2, 0),
      bathroom("b4", "2026-10-04T12:00:00Z", 4),
      bathroom("b5", "2026-10-05T12:00:00Z", 7, 2, 2),
      bathroom("b6", "2026-10-06T12:00:00Z", 4),
      bathroom("b7", "2026-10-07T12:00:00Z", 6, 2, 1),
      bathroom("b8", "2026-10-08T12:00:00Z", 4),
    ];

    const report = buildAssociationReport({
      days: 90,
      totalFoodEntries: 8,
      exposures,
      bathrooms,
      medicines: [],
    });

    expect(report.associations[0]?.foodName).toBe("Café");

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    const rice = report.associations.find((item) => item.foodId === "rice");

    expect(coffee?.adverseExposures).toBe(4);

    expect(rice?.adverseExposures).toBe(0);

    expect(coffee?.signal).toBe("medium");

    expect(rice?.signal).toBe("low");
  });

  it("marks foods without enough evaluable exposures as insufficient", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 1,

      exposures: [exposure("milk", "Leche", "2026-10-01T08:00:00Z")],

      bathrooms: [],

      medicines: [],
    });

    expect(report.associations[0]?.signal).toBe("insufficient");
  });

  it("tracks medicine overlap without claiming causality", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 1,

      exposures: [exposure("coffee", "Café", "2026-10-01T08:00:00Z")],

      bathrooms: [bathroom("b1", "2026-10-01T12:00:00Z", 7)],

      medicines: [
        {
          id: "m1",
          occurredAt: "2026-10-01T09:00:00Z",
        },
      ],
    });

    expect(report.associations[0]?.medicineOverlapExposures).toBe(1);
  });
});
