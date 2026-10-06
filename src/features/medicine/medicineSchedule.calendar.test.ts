import { describe, expect, it } from "vitest";

import { mergeMedicineScheduleOccurrences } from "./medicineSchedule.calendar";

import type { MedicineScheduleOccurrence } from "./medicineSchedule.engine";

function occurrence(
  scheduleId: string,
  scheduledFor: string,
): MedicineScheduleOccurrence {
  return {
    id: `${scheduleId}:${scheduledFor}`,

    scheduleId,

    medicineId: "medicine-1",

    medicineName: "Medicamento prueba",

    scheduledFor,

    dose: 20,

    unit: "mg",

    reason: null,

    notes: null,
  };
}

describe("medicine schedule calendar", () => {
  it("marks an occurrence as recorded when a linked medicine entry exists", () => {
    const result = mergeMedicineScheduleOccurrences({
      occurrences: [occurrence("schedule-1", "2026-10-06T14:00:00.000Z")],

      recorded: [
        {
          id: "entry-1",

          scheduleId: "schedule-1",

          scheduledFor: "2026-10-06T14:00:00+00:00",

          takenAt: "2026-10-06T14:07:00Z",
        },
      ],
    });

    expect(result[0]?.status).toBe("recorded");

    expect(result[0]?.medicineEntryId).toBe("entry-1");

    expect(result[0]?.takenAt).toBe("2026-10-06T14:07:00Z");
  });

  it("keeps an occurrence scheduled when there is no actual intake", () => {
    const result = mergeMedicineScheduleOccurrences({
      occurrences: [occurrence("schedule-1", "2026-10-06T14:00:00Z")],

      recorded: [],
    });

    expect(result[0]?.status).toBe("scheduled");

    expect(result[0]?.medicineEntryId).toBeNull();
  });

  it("does not match another schedule at the same time", () => {
    const result = mergeMedicineScheduleOccurrences({
      occurrences: [
        occurrence("schedule-1", "2026-10-06T14:00:00Z"),

        occurrence("schedule-2", "2026-10-06T14:00:00Z"),
      ],

      recorded: [
        {
          id: "entry-2",

          scheduleId: "schedule-2",

          scheduledFor: "2026-10-06T14:00:00Z",

          takenAt: "2026-10-06T14:03:00Z",
        },
      ],
    });

    expect(result[0]?.status).toBe("scheduled");

    expect(result[1]?.status).toBe("recorded");
  });
});
