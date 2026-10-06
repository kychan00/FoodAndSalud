import { describe, expect, it } from "vitest";

import { buildAssociationReport } from "./association.engine";

import type { BathroomObservation, FoodExposure } from "./association.types";

function iso(day: number, hour = 8) {
  return `2026-10-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:00:00Z`;
}

function exposure(day: number, foodId: string, foodName: string): FoodExposure {
  return {
    entryId: `${foodId}-${day}`,

    foodId,

    foodName,

    eatenAt: iso(day, 8),
  };
}

function bathroom(day: number, adverse: boolean): BathroomObservation {
  return {
    id: `bath-${day}`,

    occurredAt: iso(day, 12),

    bristolType: adverse ? 7 : 4,

    urgency: adverse ? 2 : 0,

    painLevel: 0,
  };
}

describe("association effect metrics", () => {
  it("calculates absolute difference and finite relative risk", () => {
    const exposures: FoodExposure[] = [];

    const bathrooms: BathroomObservation[] = [];

    /*
     * Café:
     * 2/4 = 50%.
     *
     * Arroz control:
     * 1/4 = 25%.
     */
    const coffeeDays = [1, 3, 5, 7];

    const riceDays = [2, 4, 6, 8];

    for (const day of coffeeDays) {
      exposures.push(exposure(day, "coffee", "Café"));

      bathrooms.push(bathroom(day, day === 1 || day === 3));
    }

    for (const day of riceDays) {
      exposures.push(exposure(day, "rice", "Arroz"));

      bathrooms.push(bathroom(day, day === 2));
    }

    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 8,

      exposures,

      bathrooms,

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    expect(coffee?.adverseRate).toBe(0.5);

    expect(coffee?.baselineAdverseRate).toBe(0.25);

    expect(coffee?.absoluteRiskDifference).toBe(0.25);

    expect(coffee?.relativeRisk).toBe(2);

    expect(coffee?.comparisonEvaluableExposures).toBe(4);
  });

  it("does not manufacture an infinite relative risk when control rate is zero", () => {
    const exposures: FoodExposure[] = [];

    const bathrooms: BathroomObservation[] = [];

    for (let day = 1; day <= 16; day += 1) {
      const coffeeDay = day % 2 === 1;

      exposures.push(
        exposure(
          day,
          coffeeDay ? "coffee" : "rice",
          coffeeDay ? "Café" : "Arroz",
        ),
      );

      bathrooms.push(bathroom(day, coffeeDay));
    }

    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 16,

      exposures,

      bathrooms,

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    expect(coffee?.absoluteRiskDifference).toBe(1);

    expect(coffee?.relativeRisk).toBeNull();
  });

  it("classifies a strong eight-exposure pattern as highly stable", () => {
    const exposures: FoodExposure[] = [];

    const bathrooms: BathroomObservation[] = [];

    for (let day = 1; day <= 16; day += 1) {
      const coffeeDay = day % 2 === 1;

      exposures.push(
        exposure(
          day,
          coffeeDay ? "coffee" : "rice",
          coffeeDay ? "Café" : "Arroz",
        ),
      );

      bathrooms.push(bathroom(day, coffeeDay));
    }

    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 16,

      exposures,

      bathrooms,

      medicines: [],
    });

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    expect(coffee?.signal).toBe("high");

    expect(coffee?.stability).toBe("high");

    expect(coffee?.stabilityScore).toBe(1);

    expect(coffee?.stableLeaveOneOutExposures).toBe(8);
  });

  it("detects medium stability when one observation changes the signal category", () => {
    const exposures: FoodExposure[] = [];

    const bathrooms: BathroomObservation[] = [];

    /*
     * Leche:
     * 3/4 = 75%.
     *
     * Arroz:
     * 1/4 = 25%.
     *
     * Al retirar la única exposición normal de Leche,
     * la señal pasa de medium a high.
     *
     * 3 de 4 leave-one-out mantienen la categoría.
     */
    const milkDays = [1, 3, 5, 7];

    const riceDays = [2, 4, 6, 8];

    for (const day of milkDays) {
      exposures.push(exposure(day, "milk", "Leche"));

      bathrooms.push(bathroom(day, day !== 7));
    }

    for (const day of riceDays) {
      exposures.push(exposure(day, "rice", "Arroz"));

      bathrooms.push(bathroom(day, day === 2));
    }

    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 8,

      exposures,

      bathrooms,

      medicines: [],
    });

    const milk = report.associations.find((item) => item.foodId === "milk");

    expect(milk?.signal).toBe("medium");

    expect(milk?.absoluteRiskDifference).toBe(0.5);

    expect(milk?.relativeRisk).toBe(3);

    expect(milk?.stability).toBe("medium");

    expect(milk?.stabilityScore).toBe(0.75);
  });

  it("does not claim stability without an independent comparator", () => {
    const report = buildAssociationReport({
      days: 90,

      totalFoodEntries: 4,

      exposures: [
        exposure(1, "coffee", "Café"),
        exposure(2, "coffee", "Café"),
        exposure(3, "coffee", "Café"),
        exposure(4, "coffee", "Café"),
      ],

      bathrooms: [
        bathroom(1, true),
        bathroom(2, true),
        bathroom(3, false),
        bathroom(4, false),
      ],

      medicines: [],
    });

    const coffee = report.associations[0];

    expect(coffee?.comparisonSource).toBe("all_meals");

    expect(coffee?.relativeRisk).toBeNull();

    expect(coffee?.stability).toBe("insufficient");

    expect(coffee?.stabilityScore).toBeNull();
  });
});
