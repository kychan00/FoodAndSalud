import { describe, expect, it } from "vitest";

import { buildConcurrentContextReport } from "./concurrent.engine";

import { patternQaScenarios } from "./fixtures/association.fixtures";

import { buildQaFoodDetailReport } from "./fixtures/qaFoodDetail";

import { buildFoodCombinationReport } from "./combination.engine";

import { buildResponseLatencyReport } from "./latency.engine";

import { buildMedicineTimingReport } from "./medicineTiming.engine";

import { buildSpecificMedicineReport } from "./medicineSpecific.engine";

import { buildTemporalPersistenceReport } from "./temporal.engine";

function expectFiniteNumbers(value: unknown, path = "root") {
  if (typeof value === "number") {
    expect(Number.isFinite(value), `Expected finite number at ${path}`).toBe(
      true,
    );

    return;
  }

  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      expectFiniteNumbers(item, `${path}[${index}]`),
    );

    return;
  }

  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      expectFiniteNumbers(item, `${path}.${key}`);
    }
  }
}

describe("Patterns v1 full QA contract", () => {
  for (const scenario of patternQaScenarios) {
    for (const foodId of Object.keys(scenario.expectedSignals)) {
      it(`${scenario.id} / ${foodId} produces finite reports across every v1 engine`, () => {
        const detail = buildQaFoodDetailReport(scenario, foodId);

        expect(detail).not.toBeNull();

        if (!detail) {
          return;
        }

        const reports = {
          detail,

          combinations: buildFoodCombinationReport(detail),

          temporal: buildTemporalPersistenceReport(detail),

          concurrent: buildConcurrentContextReport(detail),

          medicineSpecific: buildSpecificMedicineReport(detail),

          medicineTiming: buildMedicineTimingReport(detail),

          latency: buildResponseLatencyReport(detail),
        };

        expectFiniteNumbers(reports, `${scenario.id}.${foodId}`);
      });
    }
  }
});
