import {
  expandMedicineSchedule,
  zonedLocalDateTimeToDate,
  type MedicineScheduleDefinition,
  type MedicineScheduleOccurrence,
} from "./medicineSchedule.engine";

const MAX_EXPORT_OCCURRENCES = 20_000;

const encoder = new TextEncoder();

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

function addDaysToDateKey(value: string, amount: number) {
  const { year, month, day } = parseDateKey(value);

  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + amount);

  return date.toISOString().slice(0, 10);
}

function formatUtcIcsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function occurrenceUid(occurrence: MedicineScheduleOccurrence) {
  const timestamp = formatUtcIcsDate(new Date(occurrence.scheduledFor));

  return `${occurrence.scheduleId}-${timestamp}@foodandsalud.local`;
}

export function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldIcsLine(line: string) {
  const parts: string[] = [];

  let current = "";

  for (const character of line) {
    const candidate = `${current}${character}`;

    const limit = parts.length === 0 ? 75 : 74;

    if (current && encoder.encode(candidate).length > limit) {
      parts.push(current);

      current = character;
    } else {
      current = candidate;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts
    .map((part, index) => (index === 0 ? part : ` ${part}`))
    .join("\r\n");
}

function makeDescription(schedule: MedicineScheduleDefinition) {
  const lines = ["Evento programado en FoodAndSalud."];

  if (schedule.dose !== null) {
    lines.push(
      `Dosis programada: ${schedule.dose}${
        schedule.unit ? ` ${schedule.unit}` : ""
      }.`,
    );
  }

  lines.push("Este evento no confirma que la toma haya ocurrido.");

  return lines.join("\n");
}

export function getMedicineScheduleExportOccurrences(
  schedule: MedicineScheduleDefinition,
) {
  const rangeStart = zonedLocalDateTimeToDate(
    schedule.startDate,
    "00:00",
    schedule.timezone,
  );

  const dayAfterEnd = addDaysToDateKey(schedule.endDate, 1);

  const rangeEnd = zonedLocalDateTimeToDate(
    dayAfterEnd,
    "00:00",
    schedule.timezone,
  );

  const occurrences = expandMedicineSchedule(schedule, rangeStart, rangeEnd);

  if (occurrences.length > MAX_EXPORT_OCCURRENCES) {
    throw new Error(
      `La programación contiene más de ${MAX_EXPORT_OCCURRENCES} eventos y es demasiado grande para exportarse en un solo archivo.`,
    );
  }

  return occurrences;
}

export function buildMedicineScheduleIcs(
  schedule: MedicineScheduleDefinition,
  generatedAt = new Date(),
) {
  const occurrences = getMedicineScheduleExportOccurrences(schedule);

  if (occurrences.length === 0) {
    throw new Error("Esta programación no tiene ocurrencias para exportar.");
  }

  const calendarName = `FoodAndSalud · ${schedule.medicineName}`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//FoodAndSalud//Medicine Schedule Export//ES",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
  ];

  const stamp = formatUtcIcsDate(generatedAt);

  const description = escapeIcsText(makeDescription(schedule));

  const summary = escapeIcsText(`FoodAndSalud · ${schedule.medicineName}`);

  for (const occurrence of occurrences) {
    lines.push("BEGIN:VEVENT");

    lines.push(`UID:${occurrenceUid(occurrence)}`);

    lines.push(`DTSTAMP:${stamp}`);

    lines.push(
      `DTSTART:${formatUtcIcsDate(new Date(occurrence.scheduledFor))}`,
    );

    lines.push(`SUMMARY:${summary}`);

    lines.push(`DESCRIPTION:${description}`);

    lines.push("CATEGORIES:FoodAndSalud,Medicina");

    lines.push("STATUS:CONFIRMED");

    /*
     * A medicine reminder should not reserve
     * the user's calendar availability.
     */
    lines.push("TRANSP:TRANSPARENT");

    lines.push(`X-FOODANDSALUD-SCHEDULE-ID:${schedule.id}`);

    lines.push(
      `X-FOODANDSALUD-SCHEDULED-FOR:${escapeIcsText(occurrence.scheduledFor)}`,
    );

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}

function slugify(value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "medicina";
}

export function getMedicineScheduleIcsFilename(
  schedule: MedicineScheduleDefinition,
) {
  return (
    [
      "foodandsalud",
      slugify(schedule.medicineName),
      schedule.startDate,
      schedule.endDate,
    ].join("-") + ".ics"
  );
}
