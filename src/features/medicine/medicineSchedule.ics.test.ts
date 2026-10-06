import { describe, expect, it } from "vitest";

import {
  buildMedicineScheduleIcs,
  escapeIcsText,
  getMedicineScheduleExportOccurrences,
  getMedicineScheduleIcsFilename,
} from "./medicineSchedule.ics";

import type { MedicineScheduleDefinition } from "./medicineSchedule.engine";

function schedule(
  overrides: Partial<MedicineScheduleDefinition> = {},
): MedicineScheduleDefinition {
  return {
    id: "schedule-123",

    medicineId: "medicine-123",

    medicineName: "Medicamento prueba",

    scheduleType: "specific_times",

    startDate: "2026-10-06",

    endDate: "2026-10-07",

    timezone: "UTC",

    dose: 20,

    unit: "mg",

    reason: "Dato privado de motivo",

    notes: "Dato privado de notas",

    times: ["08:00", "20:00"],

    intervalMinutes: null,

    intervalStartTime: null,

    stoppedAt: null,

    ...overrides,
  };
}

function unfoldIcs(value: string) {
  /*
   * iCalendar permite line folding:
   *
   * CRLF + espacio/tab
   *
   * representa una sola línea lógica.
   *
   * Para comprobar contenido semántico debemos
   * reconstruir primero esa línea.
   */
  return value.replace(/\r\n[ \t]/g, "");
}

describe("medicine schedule ICS export", () => {
  it("creates one VEVENT per scheduled occurrence", () => {
    const ics = buildMedicineScheduleIcs(
      schedule(),
      new Date("2026-10-01T12:00:00Z"),
    );

    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(4);

    expect(ics).toContain("DTSTART:20261006T080000Z");

    expect(ics).toContain("DTSTART:20261007T200000Z");

    expect(ics).toContain("TRANSP:TRANSPARENT");
  });

  it("uses the schedule timezone before writing UTC calendar timestamps", () => {
    const occurrences = getMedicineScheduleExportOccurrences(
      schedule({
        timezone: "America/Mexico_City",

        startDate: "2026-10-06",

        endDate: "2026-10-06",

        times: ["08:00"],
      }),
    );

    expect(occurrences[0]?.scheduledFor).toBe("2026-10-06T14:00:00.000Z");
  });

  it("respects stoppedAt when exporting", () => {
    const occurrences = getMedicineScheduleExportOccurrences(
      schedule({
        startDate: "2026-10-06",

        endDate: "2026-10-06",

        times: ["08:00", "14:00", "22:00"],

        stoppedAt: "2026-10-06T15:00:00Z",
      }),
    );

    expect(occurrences.map((item) => item.scheduledFor)).toEqual([
      "2026-10-06T08:00:00.000Z",
      "2026-10-06T14:00:00.000Z",
    ]);
  });

  it("does not export private reason or notes", () => {
    const ics = buildMedicineScheduleIcs(schedule());

    const unfolded = unfoldIcs(ics);

    expect(unfolded).not.toContain("Dato privado de motivo");

    expect(unfolded).not.toContain("Dato privado de notas");

    expect(unfolded).toContain(
      "Este evento no confirma que la toma haya ocurrido.",
    );
  });

  it("uses valid iCalendar line folding for long logical lines", () => {
    const ics = buildMedicineScheduleIcs(
      schedule({
        medicineName:
          "Medicamento con un nombre deliberadamente largo para validar el plegado correcto del contenido iCalendar",
      }),
    );

    expect(ics).toMatch(/\r\n /);

    const unfolded = unfoldIcs(ics);

    expect(unfolded).toContain(
      "Medicamento con un nombre deliberadamente largo para validar el plegado correcto del contenido iCalendar",
    );
  });

  it("escapes ICS text and generates a stable filename", () => {
    expect(escapeIcsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D\\nE");

    expect(
      getMedicineScheduleIcsFilename(
        schedule({
          medicineName: "Ácido fólico / prueba",
        }),
      ),
    ).toBe("foodandsalud-acido-folico-prueba-2026-10-06-2026-10-07.ics");
  });
});
