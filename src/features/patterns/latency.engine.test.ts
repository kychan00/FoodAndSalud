import { describe, expect, it } from "vitest";

import { buildResponseLatencyReport } from "./latency.engine";

import { buildQaFoodDetailReport } from "./fixtures/qaFoodDetail";

import {
  combinationDiscriminationScenario,
  delayedCombinationScenario,
} from "./fixtures/combinationScenario";

import { latencyLateScenario } from "./fixtures/latencyScenario";

function getDetail(scenario: Parameters<typeof buildQaFoodDetailReport>[0]) {
  const detail = buildQaFoodDetailReport(scenario, "coffee");

  expect(detail).not.toBeNull();

  if (!detail) {
    throw new Error("Missing QA detail.");
  }

  return detail;
}

describe("response latency analysis", () => {
  it("detects an early profile at four hours", () => {
    const detail = getDetail(combinationDiscriminationScenario);

    const report = buildResponseLatencyReport(detail);

    expect(report.status).toBe("early");

    expect(report.markedExposures).toBe(4);

    expect(report.medianHours).toBe(4);

    expect(report.buckets.find((bucket) => bucket.id === "early")?.count).toBe(
      4,
    );
  });

  it("uses the first adverse response rather than the first normal bathroom", () => {
    const detail = getDetail(delayedCombinationScenario);

    const report = buildResponseLatencyReport(detail);

    expect(report.status).toBe("intermediate");

    expect(report.markedExposures).toBe(4);

    expect(report.medianHours).toBe(10);

    expect(
      report.buckets.find((bucket) => bucket.id === "intermediate")?.count,
    ).toBe(4);
  });

  it("detects a late profile at sixteen hours", () => {
    const detail = getDetail(latencyLateScenario);

    const report = buildResponseLatencyReport(detail);

    expect(report.status).toBe("late");

    expect(report.markedExposures).toBe(8);

    expect(report.medianHours).toBe(16);

    expect(report.minHours).toBe(16);

    expect(report.maxHours).toBe(16);
  });

  it("requires at least three marked exposures", () => {
    const detail = getDetail(latencyLateScenario);

    const marked = detail.history
      .filter((item) => item.firstAdverseBathroom !== null)
      .slice(0, 2);

    const report = buildResponseLatencyReport({
      ...detail,

      history: marked,
    });

    expect(report.markedExposures).toBe(2);

    expect(report.status).toBe("insufficient");
  });

  it("detects a diffuse distribution without a 60 percent dominant bucket", () => {
    const detail = getDetail(latencyLateScenario);

    const marked = detail.history
      .filter((item) => item.firstAdverseBathroom !== null)
      .slice(0, 4)
      .map((item, index) => {
        const hours = [4, 10, 10, 16][index];

        if (!item.firstAdverseBathroom || hours === undefined) {
          return item;
        }

        return {
          ...item,

          firstAdverseBathroom: {
            ...item.firstAdverseBathroom,

            elapsedHours: hours,
          },
        };
      });

    const report = buildResponseLatencyReport({
      ...detail,

      history: marked,
    });

    expect(report.status).toBe("diffuse");

    expect(report.dominantShare).toBe(0.5);
  });
});
