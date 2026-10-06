import { supabase } from "../../lib/supabase/client";

import { getOrCreateMedicine } from "./medicine.service";

import type {
  MedicineScheduleDefinition,
  MedicineScheduleType,
} from "./medicineSchedule.engine";

export interface CreateMedicineScheduleInput {
  userId: string;

  name: string;

  dose?: number;

  unit?: string;

  reason?: string;

  notes?: string;

  startDate: string;

  endDate: string;

  timezone: string;

  scheduleType: MedicineScheduleType;

  times?: string[];

  intervalHours?: number;

  intervalStartTime?: string;
}

function normalizeTime(value: string) {
  return value.trim().slice(0, 5);
}

function uniqueTimes(values: string[]) {
  return [...new Set(values.map(normalizeTime).filter(Boolean))].sort();
}

export async function createMedicineSchedule({
  userId,
  name,
  dose,
  unit,
  reason,
  notes,
  startDate,
  endDate,
  timezone,
  scheduleType,
  times = [],
  intervalHours,
  intervalStartTime,
}: CreateMedicineScheduleInput) {
  const medicineId = await getOrCreateMedicine(userId, name, unit);

  const normalizedTimes = uniqueTimes(times);

  const intervalMinutes =
    scheduleType === "interval" && intervalHours
      ? Math.round(intervalHours * 60)
      : null;

  const { data: schedule, error: scheduleError } = await supabase
    .from("medicine_schedules")
    .insert({
      user_id: userId,

      medicine_id: medicineId,

      schedule_type: scheduleType,

      start_date: startDate,

      end_date: endDate,

      dose: dose ?? null,

      unit: dose === undefined ? null : unit?.trim() || null,

      reason: reason?.trim() || null,

      notes: notes?.trim() || null,

      timezone,

      interval_minutes: intervalMinutes,

      interval_start_time:
        scheduleType === "interval"
          ? normalizeTime(intervalStartTime ?? "") || null
          : null,
    })
    .select("id")
    .single();

  if (scheduleError || !schedule) {
    throw scheduleError ?? new Error("No se pudo crear la programación.");
  }

  try {
    if (scheduleType === "specific_times") {
      if (normalizedTimes.length === 0) {
        throw new Error("La programación necesita al menos una hora.");
      }

      const { error: timesError } = await supabase
        .from("medicine_schedule_times")
        .insert(
          normalizedTimes.map((time, index) => ({
            user_id: userId,

            schedule_id: schedule.id,

            time_of_day: time,

            sort_order: index,
          })),
        );

      if (timesError) {
        throw timesError;
      }
    }

    return schedule.id;
  } catch (error) {
    await supabase
      .from("medicine_schedules")
      .delete()
      .eq("user_id", userId)
      .eq("id", schedule.id);

    throw error;
  }
}

export async function getMedicineSchedules(
  userId: string,
): Promise<MedicineScheduleDefinition[]> {
  const { data: schedules, error: scheduleError } = await supabase
    .from("medicine_schedules")
    .select(
      "id,medicine_id,schedule_type,start_date,end_date,dose,unit,reason,notes,timezone,interval_minutes,interval_start_time,created_at",
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (scheduleError) {
    throw scheduleError;
  }

  if (!schedules || schedules.length === 0) {
    return [];
  }

  const scheduleIds = schedules.map((schedule) => schedule.id);

  const medicineIds = [
    ...new Set(schedules.map((schedule) => schedule.medicine_id)),
  ];

  const [timesResult, medicinesResult] = await Promise.all([
    supabase
      .from("medicine_schedule_times")
      .select("schedule_id,time_of_day,sort_order")
      .eq("user_id", userId)
      .in("schedule_id", scheduleIds)
      .order("sort_order", {
        ascending: true,
      }),

    supabase
      .from("medicines")
      .select("id,name")
      .eq("user_id", userId)
      .in("id", medicineIds),
  ]);

  if (timesResult.error) {
    throw timesResult.error;
  }

  if (medicinesResult.error) {
    throw medicinesResult.error;
  }

  const medicineNameById = new Map(
    (medicinesResult.data ?? []).map((medicine) => [
      medicine.id,
      medicine.name,
    ]),
  );

  const timesBySchedule = new Map<string, string[]>();

  for (const row of timesResult.data ?? []) {
    const current = timesBySchedule.get(row.schedule_id) ?? [];

    current.push(row.time_of_day.slice(0, 5));

    timesBySchedule.set(row.schedule_id, current);
  }

  return schedules.map((schedule) => ({
    id: schedule.id,

    medicineId: schedule.medicine_id,

    medicineName: medicineNameById.get(schedule.medicine_id) ?? "Medicina",

    scheduleType: schedule.schedule_type as MedicineScheduleType,

    startDate: schedule.start_date,

    endDate: schedule.end_date,

    timezone: schedule.timezone,

    dose: schedule.dose,

    unit: schedule.unit,

    reason: schedule.reason,

    notes: schedule.notes,

    times: timesBySchedule.get(schedule.id) ?? [],

    intervalMinutes: schedule.interval_minutes,

    intervalStartTime: schedule.interval_start_time
      ? schedule.interval_start_time.slice(0, 5)
      : null,
  }));
}
