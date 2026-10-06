import { describe, expect, it } from "vitest";

import { buildFoodCombinationReport } from "../combination.engine";

import { combinationDiscriminationScenario } from "./combinationScenario";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

describe("combination QA scenario", () => {
  it("shows a stronger pattern for Café + Leche than Café without Leche", () => {
    const detail = buildQaFoodDetailReport(
      combinationDiscriminationScenario,
      "coffee",
    );

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildFoodCombinationReport(detail);

    const milk = report.comparisons.find((item) => item.coFoodId === "milk");

    expect(milk?.together.adverseRate).toBe(1);

    expect(milk?.without.adverseRate).toBe(0);

    expect(milk?.status).toBe("higher_with");
  });

  it("shows Café as inseparable from Leche when viewing Leche", () => {
    const detail = buildQaFoodDetailReport(
      combinationDiscriminationScenario,
      "milk",
    );

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildFoodCombinationReport(detail);

    const coffee = report.comparisons.find(
      (item) => item.coFoodId === "coffee",
    );

    expect(coffee?.status).toBe("inseparable");
  });
});
