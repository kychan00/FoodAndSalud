import { describe, expect, it } from "vitest";

import { patternQaScenarios } from "./association.fixtures";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

function getScenario(id: string) {
  const scenario = patternQaScenarios.find((item) => item.id === id);

  if (!scenario) {
    throw new Error(`Scenario ${id} not found`);
  }

  return scenario;
}

describe("QA food detail adapter", () => {
  it("builds the coffee-high detail", () => {
    const report = buildQaFoodDetailReport(
      getScenario("coffee-high"),
      "coffee",
    );

    expect(report).not.toBeNull();

    expect(report?.totalExposures).toBe(8);

    expect(report?.association?.signal).toBe("high");
  });

  it("builds a neutral rice detail", () => {
    const report = buildQaFoodDetailReport(getScenario("coffee-high"), "rice");

    expect(report?.totalExposures).toBe(8);

    expect(report?.association?.signal).toBe("low");
  });

  it("detects Leche as a 100 percent co-occurrence with Café", () => {
    const report = buildQaFoodDetailReport(
      getScenario("mixed-ambiguity"),
      "coffee",
    );

    const milk = report?.coOccurrences.find((item) => item.foodId === "milk");

    expect(milk?.count).toBe(4);

    expect(milk?.share).toBe(1);
  });

  it("preserves Medicine overlap", () => {
    const report = buildQaFoodDetailReport(
      getScenario("medicine-overlap"),
      "coffee",
    );

    expect(report?.association?.medicineOverlapExposures).toBe(6);

    expect(report?.history.every((item) => item.medicineOverlap)).toBe(true);
  });

  it("returns null for a food absent from the scenario", () => {
    const report = buildQaFoodDetailReport(
      getScenario("coffee-high"),
      "not-real",
    );

    expect(report).toBeNull();
  });
});
