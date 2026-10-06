import { describe, expect, it } from "vitest";

import {
  getTimelineEventDetail,
  getTimelineEventTitle,
} from "./timeline.presentation";

import type { TimelineEvent } from "./timeline.types";

function event(overrides: Partial<TimelineEvent>): TimelineEvent {
  return {
    id: "event-1",

    user_id: "user-1",

    occurred_at: "2026-10-06T15:00:00Z",

    event_type: "food",

    event_subtype: "lunch",

    notes: null,

    created_at: "2026-10-06T15:00:00Z",

    updated_at: "2026-10-06T15:00:00Z",

    food_names: [],

    ...overrides,
  };
}

describe("timeline presentation", () => {
  it("shows the meal type as title and foods as detail", () => {
    const item = event({
      event_type: "food",

      event_subtype: "breakfast",

      food_names: ["Café", "Pan"],
    });

    expect(getTimelineEventTitle(item)).toBe("Desayuno");

    expect(getTimelineEventDetail(item)).toBe("Café · Pan");
  });

  it("shows Bristol in bathroom title", () => {
    const item = event({
      event_type: "bathroom",

      event_subtype: "bristol_6",
    });

    expect(getTimelineEventTitle(item)).toBe("Baño · Bristol 6");
  });

  it("shows the Medicine name in its title", () => {
    const item = event({
      event_type: "medicine",

      event_subtype: "Omeprazol",
    });

    expect(getTimelineEventTitle(item)).toBe("Medicina · Omeprazol");
  });
});
