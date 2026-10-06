import { describe, expect, it } from "vitest";

import { buildTemporalPersistenceReport } from "./temporal.engine";

import { buildQaFoodDetailReport } from "./fixtures/qaFoodDetail";

import {
  temporalPersistentScenario,
  temporalRecentScenario,
  temporalWeakenedScenario,
} from "./fixtures/temporalScenario";

function getReport(scenario: typeof temporalPersistentScenario) {
  const detail = buildQaFoodDetailReport(scenario, "coffee");

  expect(detail).not.toBeNull();

  if (!detail) {
    throw new Error("Missing QA detail.");
  }

  return buildTemporalPersistenceReport(detail);
}

describe("temporal persistence engine", () => {
  it("detects a persistent pattern", () => {
    const report = getReport(temporalPersistentScenario);

    expect(report.status).toBe("persistent");

    expect(report.older.absoluteRiskDifference).toBe(1);

    expect(report.recent.absoluteRiskDifference).toBe(1);

    expect(report.differenceChange).toBe(0);
  });

  it("detects a pattern that appears recently", () => {
    const report = getReport(temporalRecentScenario);

    expect(report.status).toBe("recent");

    expect(report.older.absoluteRiskDifference).toBe(0);

    expect(report.recent.absoluteRiskDifference).toBe(1);

    expect(report.differenceChange).toBe(1);
  });

  it("detects a pattern that weakened", () => {
    const report = getReport(temporalWeakenedScenario);

    expect(report.status).toBe("weakened");

    expect(report.older.absoluteRiskDifference).toBe(1);

    expect(report.recent.absoluteRiskDifference).toBe(0);

    expect(report.differenceChange).toBe(-1);
  });
});
