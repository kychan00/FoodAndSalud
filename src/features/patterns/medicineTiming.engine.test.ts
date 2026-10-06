import { describe, expect, it } from "vitest";

import { buildMedicineTimingReport } from "./medicineTiming.engine";

import { buildQaFoodDetailReport } from "./fixtures/qaFoodDetail";

import { medicineBeforeScenario } from "./fixtures/medicineBeforeScenario";

import { concurrentMedicineScenario } from "./fixtures/concurrentScenario";

describe("Medicine timing analysis", () => {
  it("detects Medicine before the meal", () => {
    const detail = buildQaFoodDetailReport(medicineBeforeScenario, "coffee");

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildMedicineTimingReport(detail);

    const factor = report.factors.find(
      (item) => item.medicineId === "omeprazole-before-qa",
    );

    expect(factor).toBeDefined();

    expect(factor?.beforeOnly.totalExposures).toBe(6);

    expect(factor?.beforeOnly.evaluableExposures).toBe(6);

    expect(factor?.beforeOnly.adverseRate).toBe(1);

    expect(factor?.none.totalExposures).toBe(4);

    expect(factor?.none.adverseRate).toBe(0);

    expect(factor?.beforeDifference).toBe(1);

    expect(factor?.beforeStatus).toBe("higher");

    expect(factor?.afterOnly.totalExposures).toBe(0);

    expect(factor?.medianBeforeHours).toBe(2);
  });

  it("keeps existing post-meal Omeprazol as after", () => {
    const detail = buildQaFoodDetailReport(
      concurrentMedicineScenario,
      "coffee",
    );

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildMedicineTimingReport(detail);

    const factor = report.factors.find(
      (item) => item.medicineId === "omeprazole",
    );

    expect(factor?.beforeOnly.totalExposures).toBe(0);

    expect(factor?.afterOnly.totalExposures).toBe(6);

    expect(factor?.afterOnly.adverseRate).toBe(1);

    expect(factor?.none.totalExposures).toBe(4);

    expect(factor?.afterDifference).toBe(1);

    expect(factor?.afterStatus).toBe("higher");

    expect(factor?.medianAfterHours).toBe(1);
  });

  it("keeps all timing groups mutually exclusive", () => {
    const detail = buildQaFoodDetailReport(medicineBeforeScenario, "coffee");

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildMedicineTimingReport(detail);

    const factor = report.factors[0];

    if (!factor) {
      throw new Error("Missing timing factor.");
    }

    const classified =
      factor.beforeOnly.totalExposures +
      factor.afterOnly.totalExposures +
      factor.both.totalExposures +
      factor.none.totalExposures;

    expect(classified).toBe(report.totalExposures);
  });
});
