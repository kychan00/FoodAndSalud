import type { MedicineScheduleOccurrence } from "./medicineSchedule.engine";

export interface RecordedScheduleOccurrence {
  id: string;

  scheduleId: string;

  scheduledFor: string;

  takenAt: string;
}

export type MedicineScheduleCalendarStatus = "scheduled" | "recorded";

export interface MedicineScheduleCalendarItem extends MedicineScheduleOccurrence {
  status: MedicineScheduleCalendarStatus;

  medicineEntryId: string | null;

  takenAt: string | null;
}

function occurrenceKey(scheduleId: string, scheduledFor: string) {
  const timestamp = new Date(scheduledFor).getTime();

  return `${scheduleId}:${timestamp}`;
}

export function mergeMedicineScheduleOccurrences({
  occurrences,
  recorded,
}: {
  occurrences: MedicineScheduleOccurrence[];

  recorded: RecordedScheduleOccurrence[];
}): MedicineScheduleCalendarItem[] {
  const recordedByOccurrence = new Map<string, RecordedScheduleOccurrence>();

  for (const entry of recorded) {
    recordedByOccurrence.set(
      occurrenceKey(entry.scheduleId, entry.scheduledFor),
      entry,
    );
  }

  return occurrences.map((occurrence) => {
    const entry = recordedByOccurrence.get(
      occurrenceKey(occurrence.scheduleId, occurrence.scheduledFor),
    );

    return {
      ...occurrence,

      status: entry ? "recorded" : "scheduled",

      medicineEntryId: entry?.id ?? null,

      takenAt: entry?.takenAt ?? null,
    };
  });
}
