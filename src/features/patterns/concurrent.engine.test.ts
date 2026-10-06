import { describe, expect, it } from "vitest";

import { buildConcurrentContextReport } from "./concurrent.engine";

import { buildQaFoodDetailReport } from "./fixtures/qaFoodDetail";

import { concurrentMedicineScenario } from "./fixtures/concurrentScenario";

import { patternQaScenarios } from "./fixtures/association.fixtures";

function getScenario(id: string) {
  const scenario = patternQaScenarios.find((item) => item.id === id);

  if (!scenario) {
    throw new Error(`Missing scenario: ${id}`);
  }

  return scenario;
}

function getDetail(
  scenario: Parameters<typeof buildQaFoodDetailReport>[0],
  foodId: string,
) {
  const detail = buildQaFoodDetailReport(scenario, foodId);

  expect(detail).not.toBeNull();

  if (!detail) {
    throw new Error("Missing detail.");
  }

  return detail;
}

describe("concurrent context engine", () => {
  it("compares coffee with and without Medicine", () => {
    const detail = getDetail(concurrentMedicineScenario, "coffee");

    const report = buildConcurrentContextReport(detail);

    expect(report.medicine.status).toBe("higher_with");

    expect(report.medicine.overlapExposures).toBe(6);

    expect(report.medicine.withMedicine.evaluableExposures).toBe(6);

    expect(report.medicine.withMedicine.adverseRate).toBe(1);

    expect(report.medicine.withoutMedicine.evaluableExposures).toBe(4);

    expect(report.medicine.withoutMedicine.adverseRate).toBe(0);

    expect(report.medicine.difference).toBe(1);
  });

  it("marks Medicine as inseparable when it appears in every exposure", () => {
    const detail = getDetail(getScenario("medicine-overlap"), "coffee");

    const report = buildConcurrentContextReport(detail);

    expect(report.medicine.status).toBe("inseparable");

    expect(report.medicine.overlapExposures).toBe(6);

    expect(report.medicine.overlapShare).toBe(1);
  });

  it("detects an inseparable accompanying food", () => {
    const detail = getDetail(getScenario("mixed-ambiguity"), "coffee");

    const report = buildConcurrentContextReport(detail);

    const milk = report.foodFactors.find((item) => item.foodId === "milk");

    expect(milk?.status).toBe("inseparable");

    expect(milk?.share).toBe(1);
  });

  it("reports no Medicine when none is registered in target windows", () => {
    const detail = getDetail(getScenario("coffee-high"), "coffee");

    const report = buildConcurrentContextReport(detail);

    expect(report.medicine.status).toBe("none");

    expect(report.medicine.overlapExposures).toBe(0);
  });
});
