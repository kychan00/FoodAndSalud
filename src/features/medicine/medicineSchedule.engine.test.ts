import { describe, expect, it } from "vitest";

import {
  expandMedicineSchedule,
  zonedLocalDateTimeToDate,
  type MedicineScheduleDefinition,
} from "./medicineSchedule.engine";

function schedule(
  overrides: Partial<MedicineScheduleDefinition> = {},
): MedicineScheduleDefinition {
  return {
    id: "schedule-1",

    medicineId: "medicine-1",

    medicineName: "Medicamento de prueba",

    scheduleType: "specific_times",

    startDate: "2026-10-01",

    endDate: "2026-10-03",

    timezone: "UTC",

    dose: 20,

    unit: "mg",

    reason: null,

    notes: null,

    times: ["08:00", "20:00"],

    intervalMinutes: null,

    intervalStartTime: null,

    ...overrides,
  };
}

describe("medicine schedule recurrence", () => {
  it("expands N specific times per day", () => {
    const result = expandMedicineSchedule(
      schedule(),
      new Date("2026-10-01T00:00:00Z"),
      new Date("2026-10-04T00:00:00Z"),
    );

    expect(result).toHaveLength(6);

    expect(result.map((item) => item.scheduledFor)).toEqual([
      "2026-10-01T08:00:00.000Z",
      "2026-10-01T20:00:00.000Z",
      "2026-10-02T08:00:00.000Z",
      "2026-10-02T20:00:00.000Z",
      "2026-10-03T08:00:00.000Z",
      "2026-10-03T20:00:00.000Z",
    ]);
  });

  it("expands continuous intervals from the first scheduled time", () => {
    const result = expandMedicineSchedule(
      schedule({
        scheduleType: "interval",

        startDate: "2026-10-01",

        endDate: "2026-10-02",

        times: [],

        intervalMinutes: 8 * 60,

        intervalStartTime: "06:00",
      }),
      new Date("2026-10-01T00:00:00Z"),
      new Date("2026-10-03T00:00:00Z"),
    );

    expect(result.map((item) => item.scheduledFor)).toEqual([
      "2026-10-01T06:00:00.000Z",
      "2026-10-01T14:00:00.000Z",
      "2026-10-01T22:00:00.000Z",
      "2026-10-02T06:00:00.000Z",
      "2026-10-02T14:00:00.000Z",
      "2026-10-02T22:00:00.000Z",
    ]);
  });

  it("respects an inclusive end date", () => {
    const result = expandMedicineSchedule(
      schedule({
        startDate: "2026-10-02",

        endDate: "2026-10-02",

        times: ["09:30"],
      }),
      new Date("2026-10-01T00:00:00Z"),
      new Date("2026-10-03T00:00:00Z"),
    );

    expect(result).toHaveLength(1);

    expect(result[0]?.scheduledFor).toBe("2026-10-02T09:30:00.000Z");
  });

  it("converts a wall-clock time using its saved timezone", () => {
    const result = zonedLocalDateTimeToDate(
      "2026-10-06",
      "08:00",
      "America/Mexico_City",
    );

    expect(result.toISOString()).toBe("2026-10-06T14:00:00.000Z");
  });

  it("clips occurrences to the requested query range", () => {
    const result = expandMedicineSchedule(
      schedule(),
      new Date("2026-10-02T12:00:00Z"),
      new Date("2026-10-03T12:00:00Z"),
    );

    expect(result.map((item) => item.scheduledFor)).toEqual([
      "2026-10-02T20:00:00.000Z",
      "2026-10-03T08:00:00.000Z",
    ]);
  });
});
