import type { MedicineScheduleDefinition } from "./medicineSchedule.engine";

export type MedicineScheduleLifecycle =
  "upcoming" | "active" | "stopped" | "ended";

function dateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,

    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function getMedicineScheduleLifecycle(
  schedule: MedicineScheduleDefinition,
  now = new Date(),
): MedicineScheduleLifecycle {
  if (schedule.stoppedAt) {
    return "stopped";
  }

  const today = dateKeyInTimeZone(now, schedule.timezone);

  if (today < schedule.startDate) {
    return "upcoming";
  }

  if (today > schedule.endDate) {
    return "ended";
  }

  return "active";
}

export function getMedicineScheduleLifecycleLabel(
  lifecycle: MedicineScheduleLifecycle,
) {
  switch (lifecycle) {
    case "upcoming":
      return "Próxima";

    case "active":
      return "Activa";

    case "stopped":
      return "Finalizada";

    case "ended":
      return "Terminada";
  }
}

export function formatMedicineScheduleRule(
  schedule: MedicineScheduleDefinition,
) {
  if (schedule.scheduleType === "specific_times") {
    return schedule.times.join(" · ");
  }

  if (schedule.intervalMinutes && schedule.intervalStartTime) {
    return `Cada ${schedule.intervalMinutes / 60} h · desde ${
      schedule.intervalStartTime
    }`;
  }

  return "Horario incompleto";
}
