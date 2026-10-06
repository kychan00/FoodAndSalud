import { describe, expect, it } from "vitest";

import {
  buildMealWindowBoundaries,
  isEventInsideMealWindow,
} from "./mealWindow";

describe("Patterns v1 meal-window contract", () => {
  it("includes events exactly at the nominal 6h, 12h and 24h boundaries", () => {
    const boundary = {
      entryId: "meal-1",

      eatenAt: "2026-10-01T08:00:00Z",

      nextMealAt: null,
    };

    expect(isEventInsideMealWindow(boundary, "2026-10-01T14:00:00Z", 6)).toBe(
      true,
    );

    expect(isEventInsideMealWindow(boundary, "2026-10-01T20:00:00Z", 12)).toBe(
      true,
    );

    expect(isEventInsideMealWindow(boundary, "2026-10-02T08:00:00Z", 24)).toBe(
      true,
    );
  });

  it("excludes an event exactly at the next meal from the previous meal", () => {
    const boundary = {
      entryId: "breakfast",

      eatenAt: "2026-10-01T08:00:00Z",

      nextMealAt: "2026-10-01T13:00:00Z",
    };

    expect(
      isEventInsideMealWindow(boundary, "2026-10-01T12:59:59.999Z", 24),
    ).toBe(true);

    expect(isEventInsideMealWindow(boundary, "2026-10-01T13:00:00Z", 24)).toBe(
      false,
    );
  });

  it("does not use simultaneous meals to truncate one another", () => {
    const boundaries = buildMealWindowBoundaries([
      {
        entryId: "meal-a",

        eatenAt: "2026-10-01T08:00:00Z",
      },

      {
        entryId: "meal-b",

        eatenAt: "2026-10-01T08:00:00Z",
      },

      {
        entryId: "meal-c",

        eatenAt: "2026-10-01T13:00:00Z",
      },
    ]);

    const mealA = boundaries.find((item) => item.entryId === "meal-a");

    const mealB = boundaries.find((item) => item.entryId === "meal-b");

    expect(mealA?.nextMealAt).toBe("2026-10-01T13:00:00Z");

    expect(mealB?.nextMealAt).toBe("2026-10-01T13:00:00Z");
  });

  it("does not include events at or before the meal start", () => {
    const boundary = {
      entryId: "meal-1",

      eatenAt: "2026-10-01T08:00:00Z",

      nextMealAt: null,
    };

    expect(isEventInsideMealWindow(boundary, "2026-10-01T08:00:00Z", 24)).toBe(
      false,
    );

    expect(isEventInsideMealWindow(boundary, "2026-10-01T07:59:59Z", 24)).toBe(
      false,
    );
  });
});
