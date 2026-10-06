import { describe, expect, it } from "vitest";

import { buildSpecificMedicineReport } from "../medicineSpecific.engine";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

import { concurrentMedicineScenario } from "./concurrentScenario";

describe("specific Medicine QA", () => {
  it("exposes Omeprazol identity, timing and dose", () => {
    const detail = buildQaFoodDetailReport(
      concurrentMedicineScenario,
      "coffee",
    );

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildSpecificMedicineReport(detail);

    const factor = report.factors[0];

    expect(factor?.medicineName).toBe("Omeprazol");

    expect(factor?.intakeCount).toBe(6);

    expect(factor?.medianTimingHours).toBe(1);

    expect(factor?.doseLabels).toContain("20 mg");
  });
});
