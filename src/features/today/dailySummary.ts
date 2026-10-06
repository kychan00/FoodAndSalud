import type { TimelineEvent } from "../timeline/timeline.types";

export interface DailySummaryGroup {
  count: number;

  latest: TimelineEvent | null;
}

export interface DailySummary {
  total: number;

  food: DailySummaryGroup;

  bathroom: DailySummaryGroup;

  medicine: DailySummaryGroup;

  latestOverall: TimelineEvent | null;
}

function timestamp(event: TimelineEvent) {
  if (!event.occurred_at) {
    return Number.NEGATIVE_INFINITY;
  }

  const value = new Date(event.occurred_at).getTime();

  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
}

export function buildDailySummary(events: TimelineEvent[]): DailySummary {
  const sorted = [...events].sort(
    (left, right) => timestamp(right) - timestamp(left),
  );

  const buildGroup = (
    eventType: "food" | "bathroom" | "medicine",
  ): DailySummaryGroup => {
    const matching = sorted.filter((event) => event.event_type === eventType);

    return {
      count: matching.length,

      latest: matching[0] ?? null,
    };
  };

  return {
    total: events.length,

    food: buildGroup("food"),

    bathroom: buildGroup("bathroom"),

    medicine: buildGroup("medicine"),

    latestOverall: sorted[0] ?? null,
  };
}
