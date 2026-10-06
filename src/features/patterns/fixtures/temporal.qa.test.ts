import { describe, expect, it } from "vitest";

import { buildTemporalPersistenceReport } from "../temporal.engine";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

import {
  temporalPersistentScenario,
  temporalRecentScenario,
  temporalWeakenedScenario,
} from "./temporalScenario";

const cases = [
  {
    scenario: temporalPersistentScenario,

    expected: "persistent",
  },

  {
    scenario: temporalRecentScenario,

    expected: "recent",
  },

  {
    scenario: temporalWeakenedScenario,

    expected: "weakened",
  },
] as const;

describe("temporal QA scenarios", () => {
  for (const { scenario, expected } of cases) {
    it(`${scenario.id}: ${expected}`, () => {
      const detail = buildQaFoodDetailReport(scenario, "coffee");

      expect(detail).not.toBeNull();

      if (!detail) {
        return;
      }

      const report = buildTemporalPersistenceReport(detail);

      expect(report.status).toBe(expected);
    });
  }
});
