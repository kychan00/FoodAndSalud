import { describe, expect, it } from "vitest";

import { patternQaScenarios } from "./association.fixtures";

describe("pattern QA scenario registry", () => {
  it("registers the early Café + Leche discrimination scenario", () => {
    expect(
      patternQaScenarios.some(
        (scenario) => scenario.id === "coffee-milk-discrimination",
      ),
    ).toBe(true);
  });

  it("registers the delayed Café + Leche scenario", () => {
    expect(
      patternQaScenarios.some(
        (scenario) => scenario.id === "coffee-milk-delayed",
      ),
    ).toBe(true);
  });
});
