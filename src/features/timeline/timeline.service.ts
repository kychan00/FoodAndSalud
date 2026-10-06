import type { Database } from "../../lib/supabase/database.types";
import { supabase } from "../../lib/supabase/client";
import { getDayRange, getMonthRange } from "../../utils/date";

export type TimelineEvent =
  Database["public"]["Views"]["timeline_events"]["Row"];

export async function getTimelineForRange(
  userId: string,
  start: Date,
  end: Date,
) {
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

  return data ?? [];
}

export async function getDayTimeline(userId: string, date: Date) {
  const { start, end } = getDayRange(date);

  return getTimelineForRange(userId, start, end);
}

export async function getMonthTimeline(userId: string, month: Date) {
  const { start, end } = getMonthRange(month);

  return getTimelineForRange(userId, start, end);
}
