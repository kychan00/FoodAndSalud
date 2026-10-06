import { describe, expect, it } from "vitest";

import {
  normalizeSuggestionText,
  rankDailySuggestions,
} from "./dailySuggestions";

const catalog = [
  {
    id: "rice",

    name: "Arroz",

    isFavorite: false,
  },

  {
    id: "coffee",

    name: "Café",

    isFavorite: true,
  },

  {
    id: "chicken",

    name: "Pollo",

    isFavorite: false,
  },

  {
    id: "bread",

    name: "Pan",

    isFavorite: true,
  },
];

describe("daily suggestion ranking", () => {
  it("places recent items first in recent-use order", () => {
    const result = rankDailySuggestions(["chicken", "rice"], catalog);

    expect(result.map((item) => item.id)).toEqual([
      "chicken",
      "rice",
      "coffee",
      "bread",
    ]);
  });

  it("does not duplicate an item that is both recent and favorite", () => {
    const result = rankDailySuggestions(["coffee", "coffee", "rice"], catalog);

    expect(result.map((item) => item.id)).toEqual([
      "coffee",
      "rice",
      "bread",
      "chicken",
    ]);
  });

  it("respects the requested limit", () => {
    const result = rankDailySuggestions([], catalog, 2);

    expect(result).toHaveLength(2);

    expect(result.map((item) => item.id)).toEqual(["coffee", "bread"]);
  });

  it("normalizes spaces and case for filtering", () => {
    expect(normalizeSuggestionText("  Café   Con Leche ")).toBe(
      "café con leche",
    );
  });
});
