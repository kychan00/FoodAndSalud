import { describe, expect, it } from "vitest";

import { buildResponseLatencyReport } from "../latency.engine";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

import {
  combinationDiscriminationScenario,
  delayedCombinationScenario,
} from "./combinationScenario";

import { latencyLateScenario } from "./latencyScenario";

const cases = [
  {
    scenario: combinationDiscriminationScenario,

    status: "early",

    median: 4,
  },

  {
    scenario: delayedCombinationScenario,

    status: "intermediate",

    median: 10,
  },

  {
    scenario: latencyLateScenario,

    status: "late",

    median: 16,
  },
] as const;

describe("latency QA", () => {
  for (const { scenario, status, median } of cases) {
    it(`${scenario.id}: ${status}`, () => {
      const detail = buildQaFoodDetailReport(scenario, "coffee");

      expect(detail).not.toBeNull();

      if (!detail) {
        return;
      }

      const report = buildResponseLatencyReport(detail);

      expect(report.status).toBe(status);

      expect(report.medianHours).toBe(median);
    });
  }
});
