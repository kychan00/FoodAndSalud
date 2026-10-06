import { describe, expect, it } from "vitest";

import { buildDailySummary } from "./dailySummary";

import type { TimelineEvent } from "../timeline/timeline.types";

function event({
  id,
  type,
  occurredAt,
  subtype = null,
  foodNames = [],
}: {
  id: string;

  type: "food" | "bathroom" | "medicine";

  occurredAt: string | null;

  subtype?: string | null;

  foodNames?: string[];
}): TimelineEvent {
  return {
    id,

    user_id: "user-1",

    occurred_at: occurredAt,

    event_type: type,

    event_subtype: subtype,

    notes: null,

    created_at: occurredAt,

    updated_at: occurredAt,

    food_names: foodNames,
  };
}

describe("daily summary", () => {
  it("counts each event type", () => {
    const summary = buildDailySummary([
      event({
        id: "food-1",

        type: "food",

        occurredAt: "2026-10-06T08:00:00Z",
      }),

      event({
        id: "food-2",

        type: "food",

        occurredAt: "2026-10-06T14:00:00Z",
      }),

      event({
        id: "bath-1",

        type: "bathroom",

        occurredAt: "2026-10-06T16:00:00Z",
      }),

      event({
        id: "med-1",

        type: "medicine",

        occurredAt: "2026-10-06T07:00:00Z",
      }),
    ]);

    expect(summary.total).toBe(4);

    expect(summary.food.count).toBe(2);

    expect(summary.bathroom.count).toBe(1);

    expect(summary.medicine.count).toBe(1);
  });

  it("selects the latest event of each type regardless of input order", () => {
    const summary = buildDailySummary([
      event({
        id: "food-new",

        type: "food",

        occurredAt: "2026-10-06T20:00:00Z",

        foodNames: ["Arroz", "Pollo"],
      }),

      event({
        id: "bath-old",

        type: "bathroom",

        occurredAt: "2026-10-06T09:00:00Z",

        subtype: "bristol_4",
      }),

      event({
        id: "food-old",

        type: "food",

        occurredAt: "2026-10-06T08:00:00Z",
      }),

      event({
        id: "bath-new",

        type: "bathroom",

        occurredAt: "2026-10-06T21:00:00Z",

        subtype: "bristol_6",
      }),

      event({
        id: "med-1",

        type: "medicine",

        occurredAt: "2026-10-06T12:00:00Z",

        subtype: "Omeprazol",
      }),
    ]);

    expect(summary.food.latest?.id).toBe("food-new");

    expect(summary.bathroom.latest?.id).toBe("bath-new");

    expect(summary.medicine.latest?.id).toBe("med-1");

    expect(summary.latestOverall?.id).toBe("bath-new");
  });

  it("returns null latest events for an empty day", () => {
    const summary = buildDailySummary([]);

    expect(summary.total).toBe(0);

    expect(summary.food.latest).toBeNull();

    expect(summary.bathroom.latest).toBeNull();

    expect(summary.medicine.latest).toBeNull();

    expect(summary.latestOverall).toBeNull();
  });

  it("places events without a valid timestamp after dated events", () => {
    const summary = buildDailySummary([
      event({
        id: "missing-time",

        type: "food",

        occurredAt: null,
      }),

      event({
        id: "dated",

        type: "food",

        occurredAt: "2026-10-06T08:00:00Z",
      }),
    ]);

    expect(summary.food.latest?.id).toBe("dated");
  });
});
