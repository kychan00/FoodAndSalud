import { useState, type FormEvent } from "react";

import { CalendarClock } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "../../../components/ui/Button";

import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";

import { createMedicineEntryFromScheduleOccurrence } from "../medicine.service";

import type { MedicineScheduleCalendarItem } from "../medicineSchedule.calendar";

import "../../entries/components/EntryForm.css";
import "./MedicineScheduleForm.css";

interface MedicineScheduledIntakeFormProps {
  userId: string;

  item: MedicineScheduleCalendarItem;

  onSaved: () => void;

  onCancel: () => void;
}

const units = ["mg", "g", "ml", "tableta", "cápsula"];

export function MedicineScheduledIntakeForm({
  userId,
  item,
  onSaved,
  onCancel,
}: MedicineScheduledIntakeFormProps) {
  const queryClient = useQueryClient();

  const [takenAt, setTakenAt] = useState(() =>
    toLocalDateTimeInput(new Date(item.scheduledFor)),
  );

  const [dose, setDose] = useState(item.dose === null ? "" : String(item.dose));

  const [unit, setUnit] = useState(item.unit ?? "mg");

  const [reason, setReason] = useState(item.reason ?? "");

  const [notes, setNotes] = useState(item.notes ?? "");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const parsedDose = dose.trim() ? Number(dose) : undefined;

    if (
      parsedDose !== undefined &&
      (!Number.isFinite(parsedDose) || parsedDose <= 0)
    ) {
      setError("La dosis debe ser mayor a cero.");

      return;
    }

    setSaving(true);

    setError(null);

    try {
      await createMedicineEntryFromScheduleOccurrence({
        userId,

        medicineId: item.medicineId,

        scheduleId: item.scheduleId,

        scheduledFor: item.scheduledFor,

        takenAt: localDateTimeToIso(takenAt),

        dose: parsedDose,

        unit: parsedDose === undefined ? undefined : unit,

        reason,

        notes,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["medicine-schedule-calendar"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["timeline"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["patterns"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["daily-suggestions"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["entry-editor"],
        }),
      ]);

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos registrar la toma.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="medicine-schedule-form__notice">
        <CalendarClock size={21} />

        <div>
          <strong>{item.medicineName}</strong>

          <span>
            Al guardar, esta ocurrencia programada se convierte en una toma
            realmente registrada y podrá participar en el timeline y Patrones.
          </span>
        </div>
      </div>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="scheduled-intake-time">
          Hora real
        </label>

        <input
          id="scheduled-intake-time"
          className="entry-form__input entry-form__date"
          type="datetime-local"
          value={takenAt}
          onChange={(event) => setTakenAt(event.target.value)}
          required
        />

        <p className="entry-form__hint">
          Puede corregir la hora si la tomó antes o después de lo programado.
        </p>
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Dosis registrada</p>

        <div className="medicine-dose-row">
          <input
            className="entry-form__input"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={dose}
            onChange={(event) => setDose(event.target.value)}
          />

          <select
            className="entry-form__input"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          >
            {units.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="scheduled-intake-reason">
          Motivo
        </label>

        <input
          id="scheduled-intake-reason"
          className="entry-form__input"
          type="text"
          value={reason}
          maxLength={300}
          placeholder="Opcional"
          onChange={(event) => setReason(event.target.value)}
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="scheduled-intake-notes">
          Notas
        </label>

        <textarea
          id="scheduled-intake-notes"
          className="entry-form__textarea"
          value={notes}
          maxLength={2000}
          placeholder="Opcional"
          onChange={(event) => setNotes(event.target.value)}
        />
      </section>

      {error ? (
        <p className="entry-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="entry-form__actions">
        <Button type="submit" fullWidth disabled={saving}>
          {saving ? "Registrando…" : "Registrar como tomada"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          fullWidth
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
