import { describe, expect, it } from "vitest";

import { enrichTimelineFoodNames } from "./timeline.enrichment";

import type { TimelineEventBase } from "./timeline.types";

function event(
  id: string,
  type: "food" | "bathroom" | "medicine",
): TimelineEventBase {
  return {
    id,

    user_id: "user-1",

    occurred_at: "2026-10-06T15:00:00Z",

    event_type: type,

    event_subtype: type === "food" ? "lunch" : null,

    notes: null,

    created_at: "2026-10-06T15:00:00Z",

    updated_at: "2026-10-06T15:00:00Z",
  };
}

describe("timeline food enrichment", () => {
  it("adds food names in sort order only to food events", () => {
    const events = [event("meal-1", "food"), event("bath-1", "bathroom")];

    const result = enrichTimelineFoodNames(
      events,
      [
        {
          food_entry_id: "meal-1",

          food_id: "chicken",

          sort_order: 1,
        },

        {
          food_entry_id: "meal-1",

          food_id: "rice",

          sort_order: 0,
        },
      ],
      [
        {
          id: "chicken",

          name: "Pollo",
        },

        {
          id: "rice",

          name: "Arroz",
        },
      ],
    );

    expect(result[0]?.food_names).toEqual(["Arroz", "Pollo"]);

    expect(result[1]?.food_names).toEqual([]);
  });

  it("ignores missing catalog rows instead of inventing names", () => {
    const result = enrichTimelineFoodNames(
      [event("meal-1", "food")],
      [
        {
          food_entry_id: "meal-1",

          food_id: "missing",

          sort_order: 0,
        },
      ],
      [],
    );

    expect(result[0]?.food_names).toEqual([]);
  });
});
