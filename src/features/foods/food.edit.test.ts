import { describe, expect, it } from "vitest";

import { normalizeUniqueFoodNames } from "./food.service";

describe("food editing normalization", () => {
  it("removes duplicate food names ignoring case and spaces", () => {
    expect(
      normalizeUniqueFoodNames([" Arroz ", "arroz", "POLLO", " pollo  "]),
    ).toEqual(["Arroz", "POLLO"]);
  });

  it("removes empty values", () => {
    expect(normalizeUniqueFoodNames(["", "   ", "Café"])).toEqual(["Café"]);
  });

  it("preserves first-use order", () => {
    expect(normalizeUniqueFoodNames(["Salsa", "Pollo", "Arroz"])).toEqual([
      "Salsa",
      "Pollo",
      "Arroz",
    ]);
  });
});
