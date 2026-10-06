import { BottomSheet } from "../../../components/ui/BottomSheet";

import type { MedicineScheduleCalendarItem } from "../medicineSchedule.calendar";

import { MedicineScheduledIntakeForm } from "./MedicineScheduledIntakeForm";

interface MedicineScheduledIntakeSheetProps {
  item: MedicineScheduleCalendarItem | null;

  userId: string;

  onClose: () => void;
}

export function MedicineScheduledIntakeSheet({
  item,
  userId,
  onClose,
}: MedicineScheduledIntakeSheetProps) {
  if (!item) {
    return null;
  }

  return (
    <BottomSheet open title="Medicina programada" onClose={onClose}>
      <MedicineScheduledIntakeForm
        key={item.id}
        userId={userId}
        item={item}
        onSaved={onClose}
        onCancel={onClose}
      />
    </BottomSheet>
  );
}
