import { supabase } from "../../lib/supabase/client";

import { getDayRange, getMonthRange } from "../../utils/date";

import { enrichTimelineFoodNames } from "./timeline.enrichment";

import type { TimelineEvent, TimelineEventBase } from "./timeline.types";

export type { TimelineEvent } from "./timeline.types";

export async function getTimelineForRange(
  userId: string,
  start: Date,
  end: Date,
): Promise<TimelineEvent[]> {
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("user_id", userId)
    .gte("occurred_at", start.toISOString())
    .lt("occurred_at", end.toISOString())
    .order("occurred_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  const events = (data ?? []) as TimelineEventBase[];

  const foodEntryIds = events
    .filter((event) => event.event_type === "food" && Boolean(event.id))
    .map((event) => event.id)
    .filter((id): id is string => Boolean(id));

  if (foodEntryIds.length === 0) {
    return enrichTimelineFoodNames(events, [], []);
  }

  const { data: itemRows, error: itemError } = await supabase
    .from("food_entry_items")
    .select("food_entry_id,food_id,sort_order")
    .eq("user_id", userId)
    .in("food_entry_id", foodEntryIds);

  if (itemError) {
    throw itemError;
  }

  const foodIds = [...new Set((itemRows ?? []).map((item) => item.food_id))];

  if (foodIds.length === 0) {
    return enrichTimelineFoodNames(events, itemRows ?? [], []);
  }

  const { data: foodRows, error: foodError } = await supabase
    .from("foods")
    .select("id,name")
    .eq("user_id", userId)
    .in("id", foodIds);

  if (foodError) {
    throw foodError;
  }

  return enrichTimelineFoodNames(events, itemRows ?? [], foodRows ?? []);
}

export async function getDayTimeline(userId: string, date: Date) {
  const { start, end } = getDayRange(date);

  return getTimelineForRange(userId, start, end);
}

export async function getMonthTimeline(userId: string, month: Date) {
  const { start, end } = getMonthRange(month);

  return getTimelineForRange(userId, start, end);
}
