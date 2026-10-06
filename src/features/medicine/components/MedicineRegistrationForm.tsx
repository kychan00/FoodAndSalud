import { useState, type FormEvent } from "react";
import { Pill } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";
import { createMedicineEntry } from "../medicine.service";

import "../../entries/components/EntryForm.css";
import "./MedicineRegistrationForm.css";

interface MedicineRegistrationFormProps {
  userId: string;
  initialDate: Date;
  onSaved: () => void;
  onCancel: () => void;
}

const units = ["mg", "g", "ml", "tableta", "cápsula"];

export function MedicineRegistrationForm({
  userId,
  initialDate,
  onSaved,
  onCancel,
}: MedicineRegistrationFormProps) {
  const [name, setName] = useState("");

  const [takenAt, setTakenAt] = useState(toLocalDateTimeInput(initialDate));

  const [dose, setDose] = useState("");

  const [unit, setUnit] = useState("mg");

  const [reason, setReason] = useState("");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const cleanName = name.trim().replace(/\s+/g, " ");

    if (!cleanName) {
      setError("Escriba el nombre.");
      return;
    }

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
      await createMedicineEntry({
        userId,
        name: cleanName,
        takenAt: localDateTimeToIso(takenAt),
        dose: parsedDose,
        unit: dose.trim() ? unit : undefined,
        reason,
        notes,
      });

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError("No pudimos guardar Medicina. Inténtelo nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="medicine-form__hero">
        <span>
          <Pill size={27} />
        </span>

        <div>
          <strong>Medicina</strong>

          <p>Medicamento, suplemento o remedio.</p>
        </div>
      </div>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="medicine-name">
          Nombre
        </label>

        <input
          id="medicine-name"
          className="entry-form__input"
          type="text"
          value={name}
          maxLength={120}
          autoComplete="off"
          placeholder="Ej. Omeprazol"
          onChange={(event) => setName(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="medicine-time">
          ¿Cuándo?
        </label>

        <input
          id="medicine-time"
          className="entry-form__input entry-form__date"
          type="datetime-local"
          value={takenAt}
          onChange={(event) => setTakenAt(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Dosis</p>

        <div className="medicine-dose-row">
          <input
            className="entry-form__input"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={dose}
            placeholder="20"
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

        <p className="entry-form__hint">Opcional.</p>
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="medicine-reason">
          Motivo
        </label>

        <input
          id="medicine-reason"
          className="entry-form__input"
          type="text"
          value={reason}
          maxLength={300}
          placeholder="Ej. Acidez"
          onChange={(event) => setReason(event.target.value)}
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="medicine-notes">
          Notas
        </label>

        <textarea
          id="medicine-notes"
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
          {saving ? "Guardando…" : "Guardar Medicina"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          fullWidth
          disabled={saving}
          onClick={onCancel}
        >
          Volver
        </Button>
      </div>
    </form>
  );
}
