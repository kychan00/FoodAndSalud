import { describe, expect, it } from "vitest";

import { patternQaScenarios } from "./association.fixtures";

const requiredScenarios = [
  "coffee-milk-discrimination",
  "coffee-milk-delayed",
  "overlapping-meals",
  "temporal-persistent",
  "temporal-recent",
  "temporal-weakened",
  "medicine-discrimination",
  "medicine-before-discrimination",
  "latency-late-16h",
];

describe("pattern QA scenario registry", () => {
  for (const id of requiredScenarios) {
    it(`registers ${id}`, () => {
      expect(patternQaScenarios.some((scenario) => scenario.id === id)).toBe(
        true,
      );
    });
  }
});
