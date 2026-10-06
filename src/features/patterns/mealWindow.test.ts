import { describe, expect, it } from "vitest";

import {
  buildMealWindowBoundaries,
  getEffectiveMealWindowHours,
  isEventInsideMealWindow,
  isMealWindowTruncated,
} from "./mealWindow";

describe("meal window boundaries", () => {
  it("closes a 24h window when the next meal starts", () => {
    const windows = buildMealWindowBoundaries([
      {
        entryId: "breakfast",

        eatenAt: "2026-10-01T08:00:00Z",
      },

      {
        entryId: "lunch",

        eatenAt: "2026-10-01T13:00:00Z",
      },
    ]);

    const breakfast = windows[0];

    expect(breakfast).toBeDefined();

    if (!breakfast) {
      return;
    }

    expect(isMealWindowTruncated(breakfast, 24)).toBe(true);

    expect(getEffectiveMealWindowHours(breakfast, 24)).toBe(5);
  });

  it("accepts an event before the next meal", () => {
    const windows = buildMealWindowBoundaries([
      {
        entryId: "breakfast",

        eatenAt: "2026-10-01T08:00:00Z",
      },

      {
        entryId: "lunch",

        eatenAt: "2026-10-01T13:00:00Z",
      },
    ]);

    const breakfast = windows[0];

    if (!breakfast) {
      throw new Error("Breakfast window missing.");
    }

    expect(isEventInsideMealWindow(breakfast, "2026-10-01T12:00:00Z", 24)).toBe(
      true,
    );
  });

  it("rejects an event after the next meal", () => {
    const windows = buildMealWindowBoundaries([
      {
        entryId: "breakfast",

        eatenAt: "2026-10-01T08:00:00Z",
      },

      {
        entryId: "lunch",

        eatenAt: "2026-10-01T13:00:00Z",
      },
    ]);

    const breakfast = windows[0];

    if (!breakfast) {
      throw new Error("Breakfast window missing.");
    }

    expect(isEventInsideMealWindow(breakfast, "2026-10-01T15:00:00Z", 24)).toBe(
      false,
    );
  });

  it("keeps the full window when there is no later meal", () => {
    const windows = buildMealWindowBoundaries([
      {
        entryId: "dinner",

        eatenAt: "2026-10-01T20:00:00Z",
      },
    ]);

    const dinner = windows[0];

    if (!dinner) {
      throw new Error("Dinner window missing.");
    }

    expect(isMealWindowTruncated(dinner, 24)).toBe(false);

    expect(isEventInsideMealWindow(dinner, "2026-10-02T18:00:00Z", 24)).toBe(
      true,
    );
  });
});
