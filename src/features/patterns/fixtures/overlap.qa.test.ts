import { describe, expect, it } from "vitest";

import { buildAssociationReport } from "../association.engine";

import { buildQaFoodDetailReport } from "./qaFoodDetail";

import { overlappingMealScenario } from "./overlapScenario";

describe("overlapping meal QA scenario", () => {
  it("does not give afternoon outcomes to morning coffee", () => {
    const report = buildAssociationReport(overlappingMealScenario.input);

    const coffee = report.associations.find((item) => item.foodId === "coffee");

    const rice = report.associations.find((item) => item.foodId === "rice");

    const bread = report.associations.find((item) => item.foodId === "bread");

    expect(coffee?.evaluableExposures).toBe(0);

    expect(coffee?.truncatedExposures).toBe(8);

    expect(rice?.adverseExposures).toBe(4);

    expect(bread?.adverseExposures).toBe(0);
  });

  it("shows coffee history as truncated and unevaluable", () => {
    const detail = buildQaFoodDetailReport(overlappingMealScenario, "coffee");

    expect(detail).not.toBeNull();

    if (!detail) {
      return;
    }

    expect(detail.history.length).toBe(8);

    expect(detail.history.every((item) => item.windowTruncated)).toBe(true);

    expect(detail.history.every((item) => item.firstBathroom === null)).toBe(
      true,
    );

    expect(
      detail.history.every((item) => item.effectiveWindowHours === 5),
    ).toBe(true);
  });
});
