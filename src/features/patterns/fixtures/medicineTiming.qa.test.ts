import { describe, expect, it } from "vitest";

import { buildMedicineTimingReport } from "../medicineTiming.engine";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

import { medicineBeforeScenario } from "./medicineBeforeScenario";

describe("Medicine before QA scenario", () => {
  it("shows Omeprazol two hours before Café", () => {
    const detail = buildQaFoodDetailReport(medicineBeforeScenario, "coffee");

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const report = buildMedicineTimingReport(detail);

    const factor = report.factors[0];

    expect(factor?.medicineName).toBe("Omeprazol");

    expect(factor?.beforeIntakeCount).toBe(6);

    expect(factor?.medianBeforeHours).toBe(2);

    expect(factor?.beforeStatus).toBe("higher");
  });
});
