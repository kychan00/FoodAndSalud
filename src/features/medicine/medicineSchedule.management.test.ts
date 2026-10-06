import { describe, expect, it } from "vitest";

import {
  formatMedicineScheduleRule,
  getMedicineScheduleLifecycle,
} from "./medicineSchedule.management";

import type { MedicineScheduleDefinition } from "./medicineSchedule.engine";

function base(
  overrides: Partial<MedicineScheduleDefinition> = {},
): MedicineScheduleDefinition {
  return {
    id: "schedule-1",

    medicineId: "medicine-1",

    medicineName: "Medicamento",

    scheduleType: "specific_times",

    startDate: "2026-10-01",

    endDate: "2026-10-31",

    timezone: "UTC",

    dose: 20,

    unit: "mg",

    reason: null,

    notes: null,

    times: ["08:00", "20:00"],

    intervalMinutes: null,

    intervalStartTime: null,

    stoppedAt: null,

    ...overrides,
  };
}

describe("medicine schedule management", () => {
  it("detects upcoming, active and ended schedules", () => {
    expect(
      getMedicineScheduleLifecycle(base(), new Date("2026-09-30T12:00:00Z")),
    ).toBe("upcoming");

    expect(
      getMedicineScheduleLifecycle(base(), new Date("2026-10-15T12:00:00Z")),
    ).toBe("active");

    expect(
      getMedicineScheduleLifecycle(base(), new Date("2026-11-01T12:00:00Z")),
    ).toBe("ended");
  });

  it("prioritizes explicit stopped state", () => {
    expect(
      getMedicineScheduleLifecycle(
        base({
          stoppedAt: "2026-10-10T15:00:00Z",
        }),
        new Date("2026-10-15T12:00:00Z"),
      ),
    ).toBe("stopped");
  });

  it("formats specific and interval rules", () => {
    expect(formatMedicineScheduleRule(base())).toBe("08:00 · 20:00");

    expect(
      formatMedicineScheduleRule(
        base({
          scheduleType: "interval",

          times: [],

          intervalMinutes: 480,

          intervalStartTime: "06:00",
        }),
      ),
    ).toBe("Cada 8 h · desde 06:00");
  });
});
