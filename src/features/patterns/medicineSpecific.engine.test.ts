import { describe, expect, it } from "vitest";

import { buildSpecificMedicineReport } from "./medicineSpecific.engine";

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

describe("specific Medicine analysis", () => {
  it("separates Omeprazol from exposures without Omeprazol", () => {
    const detail = buildQaFoodDetailReport(
      concurrentMedicineScenario,
      "coffee",
    );

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildSpecificMedicineReport(detail);

    const omeprazole = report.factors.find(
      (item) => item.medicineId === "omeprazole",
    );

    expect(omeprazole).toBeDefined();

    expect(omeprazole?.medicineName).toBe("Omeprazol");

    expect(omeprazole?.status).toBe("higher_with");

    expect(omeprazole?.exposureCount).toBe(6);

    expect(omeprazole?.exposureShare).toBe(0.6);

    expect(omeprazole?.withMedicine.adverseRate).toBe(1);

    expect(omeprazole?.withoutMedicine.adverseRate).toBe(0);

    expect(omeprazole?.difference).toBe(1);

    expect(omeprazole?.medianTimingHours).toBe(1);

    expect(omeprazole?.doseLabels).toEqual(["20 mg"]);
  });

  it("marks a named Medicine as inseparable when present in every exposure", () => {
    const scenario = getScenario("medicine-overlap");

    const detail = buildQaFoodDetailReport(scenario, "coffee");

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildSpecificMedicineReport(detail);

    expect(report.factors).toHaveLength(1);

    expect(report.factors[0]?.medicineName).toBe("Medicina QA");

    expect(report.factors[0]?.status).toBe("inseparable");
  });

  it("returns no named factors when no Medicine was recorded", () => {
    const scenario = getScenario("coffee-high");

    const detail = buildQaFoodDetailReport(scenario, "coffee");

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildSpecificMedicineReport(detail);

    expect(report.factors).toHaveLength(0);
  });
});
