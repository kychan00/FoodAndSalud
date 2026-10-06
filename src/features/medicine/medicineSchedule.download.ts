import type { MedicineScheduleDefinition } from "./medicineSchedule.engine";

import {
  buildMedicineScheduleIcs,
  getMedicineScheduleIcsFilename,
} from "./medicineSchedule.ics";

export function downloadMedicineScheduleIcs(
  schedule: MedicineScheduleDefinition,
) {
  const content = buildMedicineScheduleIcs(schedule);

  const filename = getMedicineScheduleIcsFilename(schedule);

  const blob = new Blob([content], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;

  anchor.download = filename;

  anchor.rel = "noopener";

  anchor.style.display = "none";

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);

  return filename;
}
