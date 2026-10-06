import { describe, expect, it } from "vitest";

import { buildAssociationReport } from "./association.engine";

import type { BathroomObservation, FoodExposure } from "./association.types";

function exposure(
  entryId: string,
  foodId: string,
  foodName: string,
  eatenAt: string,
): FoodExposure {
  return {
    entryId,
    foodId,
    foodName,
    eatenAt,
  };
}

function bathroom(
  id: string,
  occurredAt: string,
  bristolType: number,
): BathroomObservation {
  return {
    id,
    occurredAt,
    bristolType,
    urgency: 0,
    painLevel: 0,
  };
}

describe("association comparable baseline", () => {
  it("uses meal windows instead of bathroom events for the global baseline", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 2,

      exposures: [
        exposure("meal-1", "coffee", "Café", "2026-10-01T08:00:00Z"),

        exposure("meal-2", "rice", "Arroz", "2026-10-02T08:00:00Z"),
      ],

      bathrooms: [
        /*
         * Meal 1:
         * adverse.
         */
        bathroom("b1", "2026-10-01T12:00:00Z", 7),

        /*
         * Meal 2:
         * two normal bathroom events.
         *
         * These are TWO bathroom events,
         * but still ONE meal window.
         */
        bathroom("b2", "2026-10-02T12:00:00Z", 4),

        bathroom("b3", "2026-10-02T14:00:00Z", 4),
      ],

      medicines: [],
    });

    /*
     * Event-level:
     *
     * 1 adverse / 3 bathroom events.
     */
    expect(report.bathroomEventAdverseRate).toBeCloseTo(1 / 3);

    /*
     * Meal-window-level:
     *
     * 1 adverse meal / 2 evaluable meals.
     */
    expect(report.baselineAdverseRate).toBe(0.5);

    expect(report.totalEvaluableMealWindows).toBe(2);

    expect(report.totalAdverseMealWindows).toBe(1);
  });

  it("uses meals without the food as the primary comparator", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 8,

      exposures: [
        exposure("c1", "coffee", "Café", "2026-10-01T08:00:00Z"),
        exposure("r1", "rice", "Arroz", "2026-10-02T08:00:00Z"),
        exposure("c2", "coffee", "Café", "2026-10-03T08:00:00Z"),
        exposure("r2", "rice", "Arroz", "2026-10-04T08:00:00Z"),
        exposure("c3", "coffee", "Café", "2026-10-05T08:00:00Z"),
        exposure("r3", "rice", "Arroz", "2026-10-06T08:00:00Z"),
        exposure("c4", "coffee", "Café", "2026-10-07T08:00:00Z"),
        exposure("r4", "rice", "Arroz", "2026-10-08T08:00:00Z"),
      ],

      bathrooms: [
        bathroom("b1", "2026-10-01T12:00:00Z", 7),
        bathroom("b2", "2026-10-02T12:00:00Z", 4),
        bathroom("b3", "2026-10-03T12:00:00Z", 7),
        bathroom("b4", "2026-10-04T12:00:00Z", 4),
        bathroom("b5", "2026-10-05T12:00:00Z", 7),
        bathroom("b6", "2026-10-06T12:00:00Z", 4),
        bathroom("b7", "2026-10-07T12:00:00Z", 7),
        bathroom("b8", "2026-10-08T12:00:00Z", 4),
      ],

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    expect(coffee?.comparisonSource).toBe("food_absent");

    expect(coffee?.controlEvaluableExposures).toBe(4);

    expect(coffee?.baselineAdverseRate).toBe(0);

    expect(coffee?.signal).toBe("medium");
  });

  it("falls back to the global meal baseline when the food appears in every meal", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 4,

      exposures: [
        exposure("1", "coffee", "Café", "2026-10-01T08:00:00Z"),
        exposure("2", "coffee", "Café", "2026-10-02T08:00:00Z"),
        exposure("3", "coffee", "Café", "2026-10-03T08:00:00Z"),
        exposure("4", "coffee", "Café", "2026-10-04T08:00:00Z"),
      ],

      bathrooms: [
        bathroom("b1", "2026-10-01T12:00:00Z", 7),
        bathroom("b2", "2026-10-02T12:00:00Z", 7),
        bathroom("b3", "2026-10-03T12:00:00Z", 4),
        bathroom("b4", "2026-10-04T12:00:00Z", 4),
      ],

      medicines: [],
    });

    const coffee = report.associations[0];

    expect(coffee?.comparisonSource).toBe("all_meals");

    expect(coffee?.controlEvaluableExposures).toBe(0);

    expect(coffee?.baselineAdverseRate).toBe(report.baselineAdverseRate);

    /*
     * El alimento está presente siempre.
     *
     * No existe contraste interno que permita
     * elevarlo artificialmente.
     */
    expect(coffee?.signal).toBe("low");
  });

  it("counts the same food only once per meal", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 2,

      exposures: [
        exposure("meal-1", "coffee", "Café", "2026-10-01T08:00:00Z"),

        /*
         * Duplicado accidental del mismo alimento
         * dentro del mismo food_entry.
         */
        exposure("meal-1", "coffee", "Café", "2026-10-01T08:00:00Z"),

        exposure("meal-2", "rice", "Arroz", "2026-10-02T08:00:00Z"),
      ],

      bathrooms: [
        bathroom("b1", "2026-10-01T12:00:00Z", 7),

        bathroom("b2", "2026-10-02T12:00:00Z", 4),
      ],

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    expect(coffee?.totalExposures).toBe(1);

    expect(report.totalFoodExposures).toBe(2);
  });
});
