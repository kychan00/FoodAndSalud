import { describe, expect, it } from "vitest";

import { buildFoodCombinationReport } from "../combination.engine";

import {
  combinationDiscriminationScenario,
  delayedCombinationScenario,
} from "./combinationScenario";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

function getComparison(scenario: typeof combinationDiscriminationScenario) {
  const detail = buildQaFoodDetailReport(scenario, "coffee");

  expect(detail).not.toBeNull();

  if (!detail) {
    throw new Error("Missing QA food detail.");
  }

  const report = buildFoodCombinationReport(detail);

  const milk = report.comparisons.find((item) => item.coFoodId === "milk");

  expect(milk).toBeDefined();

  if (!milk) {
    throw new Error("Missing milk comparison.");
  }

  return milk;
}

describe("combination QA scenarios", () => {
  it("shows Café + Leche stronger than Café without Leche from 6h onward", () => {
    const milk = getComparison(combinationDiscriminationScenario);

    for (const hours of [6, 12, 24] as const) {
      const window = milk.windows.find((item) => item.hours === hours);

      expect(window?.together.adverseRate).toBe(1);

      expect(window?.without.adverseRate).toBe(0);

      expect(window?.status).toBe("higher_with");
    }
  });

  it("shows delayed divergence only after the 6h window", () => {
    const milk = getComparison(delayedCombinationScenario);

    const h6 = milk.windows.find((item) => item.hours === 6);

    const h12 = milk.windows.find((item) => item.hours === 12);

    const h24 = milk.windows.find((item) => item.hours === 24);

    expect(h6?.together.adverseRate).toBe(0);

    expect(h6?.without.adverseRate).toBe(0);

    expect(h6?.status).toBe("similar");

    expect(h12?.together.adverseRate).toBe(1);

    expect(h12?.without.adverseRate).toBe(0);

    expect(h12?.status).toBe("higher_with");

    expect(h24?.status).toBe("higher_with");
  });

  it("shows Café as inseparable when viewing Leche in the discrimination scenario", () => {
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

    expect(
      coffee?.windows.every((window) => window.status === "inseparable"),
    ).toBe(true);
  });
});
