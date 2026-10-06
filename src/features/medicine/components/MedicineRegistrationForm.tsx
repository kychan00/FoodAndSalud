import { useState } from "react";

import { CalendarClock, CheckCircle2, Settings2 } from "lucide-react";

import { MedicineScheduleForm } from "./MedicineScheduleForm";

import { MedicineScheduleManager } from "./MedicineScheduleManager";

import { MedicineSingleEntryForm } from "./MedicineSingleEntryForm";

import "./MedicineRegistrationForm.css";

interface MedicineRegistrationFormProps {
  userId: string;

  initialDate: Date;

  onSaved: () => void;

  onCancel: () => void;
}

type MedicineCaptureMode = "single" | "schedule" | "manage";

export function MedicineRegistrationForm({
  userId,
  initialDate,
  onSaved,
  onCancel,
}: MedicineRegistrationFormProps) {
  const [mode, setMode] = useState<MedicineCaptureMode>("single");

  return (
    <div className="medicine-registration">
      <div className="medicine-registration__mode">
        <button
          type="button"
          data-selected={mode === "single"}
          onClick={() => setMode("single")}
        >
          <CheckCircle2 size={16} />

          <span>Una toma</span>
        </button>

        <button
          type="button"
          data-selected={mode === "schedule"}
          onClick={() => setMode("schedule")}
        >
          <CalendarClock size={16} />

          <span>Programar</span>
        </button>

        <button
          type="button"
          data-selected={mode === "manage"}
          onClick={() => setMode("manage")}
        >
          <Settings2 size={16} />

          <span>Administrar</span>
        </button>
      </div>

      {mode === "single" ? (
        <MedicineSingleEntryForm
          userId={userId}
          initialDate={initialDate}
          onSaved={onSaved}
          onCancel={onCancel}
        />
      ) : null}

      {mode === "schedule" ? (
        <MedicineScheduleForm
          userId={userId}
          initialDate={initialDate}
          onSaved={onSaved}
          onCancel={onCancel}
        />
      ) : null}

      {mode === "manage" ? (
        <MedicineScheduleManager userId={userId} onCancel={onCancel} />
      ) : null}
    </div>
  );
}
