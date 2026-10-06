export type MedicineScheduleType = "specific_times" | "interval";

export interface MedicineScheduleDefinition {
  id: string;

  medicineId: string;

  medicineName: string;

  scheduleType: MedicineScheduleType;

  startDate: string;

  endDate: string;

  timezone: string;

  dose: number | null;

  unit: string | null;

  reason: string | null;

  notes: string | null;

  times: string[];

  intervalMinutes: number | null;

  intervalStartTime: string | null;
}

export interface MedicineScheduleOccurrence {
  id: string;

  scheduleId: string;

  medicineId: string;

  medicineName: string;

  scheduledFor: string;

  dose: number | null;

  unit: string | null;

  reason: string | null;

  notes: string | null;
}

interface WallTime {
  year: number;

  month: number;

  day: number;

  hour: number;

  minute: number;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Fecha inválida: ${value}`);
  }

  return {
    year,
    month,
    day,
  };
}

function parseTimeKey(value: string) {
  const [hour, minute] = value.slice(0, 5).split(":").map(Number);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Hora inválida: ${value}`);
  }

  return {
    hour,
    minute,
  };
}

function getWallTimeInZone(date: Date, timeZone: string): WallTime {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,

    year: "numeric",

    month: "2-digit",

    day: "2-digit",

    hour: "2-digit",

    minute: "2-digit",

    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);

  const value = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),

    month: value("month"),

    day: value("day"),

    hour: value("hour"),

    minute: value("minute"),
  };
}

export function zonedLocalDateTimeToDate(
  dateKey: string,
  timeKey: string,
  timeZone: string,
) {
  const date = parseDateKey(dateKey);

  const time = parseTimeKey(timeKey);

  const desiredAsUtc = Date.UTC(
    date.year,
    date.month - 1,
    date.day,
    time.hour,
    time.minute,
  );

  let candidate = new Date(desiredAsUtc);

  /*
   * Iterative offset correction using Intl.
   *
   * This avoids assuming the user's schedule timezone
   * is the same as the machine executing the calculation.
   */
  for (let iteration = 0; iteration < 3; iteration += 1) {
    const actual = getWallTimeInZone(candidate, timeZone);

    const actualAsUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
    );

    const difference = desiredAsUtc - actualAsUtc;

    if (difference === 0) {
      break;
    }

    candidate = new Date(candidate.getTime() + difference);
  }

  return candidate;
}

function dateKeyToUtcDate(value: string) {
  const { year, month, day } = parseDateKey(value);

  return new Date(Date.UTC(year, month - 1, day));
}

function formatUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function iterateDateKeys(startDate: string, endDate: string) {
  const result: string[] = [];

  const current = dateKeyToUtcDate(startDate);

  const end = dateKeyToUtcDate(endDate);

  while (current.getTime() <= end.getTime()) {
    result.push(formatUtcDateKey(current));

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

function buildOccurrence(
  schedule: MedicineScheduleDefinition,
  date: Date,
): MedicineScheduleOccurrence {
  const scheduledFor = date.toISOString();

  return {
    id: `${schedule.id}:${scheduledFor}`,

    scheduleId: schedule.id,

    medicineId: schedule.medicineId,

    medicineName: schedule.medicineName,

    scheduledFor,

    dose: schedule.dose,

    unit: schedule.unit,

    reason: schedule.reason,

    notes: schedule.notes,
  };
}

export function expandMedicineSchedule(
  schedule: MedicineScheduleDefinition,
  rangeStart: Date,
  rangeEnd: Date,
): MedicineScheduleOccurrence[] {
  const result: MedicineScheduleOccurrence[] = [];

  if (rangeEnd.getTime() <= rangeStart.getTime()) {
    return result;
  }

  if (schedule.scheduleType === "specific_times") {
    const uniqueTimes = [...new Set(schedule.times)].sort();

    for (const dateKey of iterateDateKeys(
      schedule.startDate,
      schedule.endDate,
    )) {
      for (const time of uniqueTimes) {
        const date = zonedLocalDateTimeToDate(dateKey, time, schedule.timezone);

        if (
          date.getTime() < rangeStart.getTime() ||
          date.getTime() >= rangeEnd.getTime()
        ) {
          continue;
        }

        result.push(buildOccurrence(schedule, date));
      }
    }

    return result.sort(
      (left, right) =>
        new Date(left.scheduledFor).getTime() -
        new Date(right.scheduledFor).getTime(),
    );
  }

  if (!schedule.intervalMinutes || !schedule.intervalStartTime) {
    return result;
  }

  const anchor = zonedLocalDateTimeToDate(
    schedule.startDate,
    schedule.intervalStartTime,
    schedule.timezone,
  );

  const endOfSchedule =
    zonedLocalDateTimeToDate(
      schedule.endDate,
      "23:59",
      schedule.timezone,
    ).getTime() + 60_000;

  const step = schedule.intervalMinutes * 60_000;

  let current = anchor.getTime();

  let guard = 0;

  while (current < endOfSchedule) {
    guard += 1;

    if (guard > 20_000) {
      throw new Error("La programación produjo demasiadas ocurrencias.");
    }

    if (current >= rangeStart.getTime() && current < rangeEnd.getTime()) {
      result.push(buildOccurrence(schedule, new Date(current)));
    }

    current += step;
  }

  return result;
}

export function expandMedicineSchedules(
  schedules: MedicineScheduleDefinition[],
  rangeStart: Date,
  rangeEnd: Date,
) {
  return schedules
    .flatMap((schedule) =>
      expandMedicineSchedule(schedule, rangeStart, rangeEnd),
    )
    .sort(
      (left, right) =>
        new Date(left.scheduledFor).getTime() -
        new Date(right.scheduledFor).getTime(),
    );
}
