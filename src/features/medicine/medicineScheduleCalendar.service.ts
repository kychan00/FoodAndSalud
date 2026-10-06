import { supabase } from "../../lib/supabase/client";

import { getMonthRange } from "../../utils/date";

import { expandMedicineSchedules } from "./medicineSchedule.engine";

import { getMedicineSchedules } from "./medicineSchedule.service";

import {
  mergeMedicineScheduleOccurrences,
  type MedicineScheduleCalendarItem,
  type RecordedScheduleOccurrence,
} from "./medicineSchedule.calendar";

export async function getMedicineScheduleCalendarItems(
  userId: string,
  month: Date,
): Promise<MedicineScheduleCalendarItem[]> {
  const { start, end } = getMonthRange(month);

  const schedules = await getMedicineSchedules(userId);

  const occurrences = expandMedicineSchedules(schedules, start, end);

  if (occurrences.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("medicine_entries")
    .select("id,schedule_id,scheduled_for,taken_at")
    .eq("user_id", userId)
    .not("schedule_id", "is", null)
    .gte("scheduled_for", start.toISOString())
    .lt("scheduled_for", end.toISOString());

  if (error) {
    throw error;
  }

  const recorded: RecordedScheduleOccurrence[] = (data ?? [])
    .filter(
      (entry) => Boolean(entry.schedule_id) && Boolean(entry.scheduled_for),
    )
    .map((entry) => ({
      id: entry.id,

      scheduleId: entry.schedule_id as string,

      scheduledFor: entry.scheduled_for as string,

      takenAt: entry.taken_at,
    }));

  return mergeMedicineScheduleOccurrences({
    occurrences,
    recorded,
  });
}
