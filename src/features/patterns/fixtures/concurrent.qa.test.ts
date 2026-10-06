import { describe, expect, it } from "vitest";

import { buildConcurrentContextReport } from "../concurrent.engine";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

import { concurrentMedicineScenario } from "./concurrentScenario";

describe("concurrent Medicine QA scenario", () => {
  it("shows a discriminable Medicine context", () => {
    const detail = buildQaFoodDetailReport(
      concurrentMedicineScenario,
      "coffee",
    );

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    const context = buildConcurrentContextReport(detail);

    expect(context.medicine.status).toBe("higher_with");

    expect(context.medicine.withMedicine.adverseExposures).toBe(6);

    expect(context.medicine.withoutMedicine.adverseExposures).toBe(0);
  });
});
