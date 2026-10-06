import { useState, type FormEvent } from "react";

import { Button } from "../../../components/ui/Button";
import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";
import { createBathroomEntry } from "../bathroom.service";

import "../../entries/components/EntryForm.css";
import "./BathroomRegistrationForm.css";

interface BathroomRegistrationFormProps {
  userId: string;
  initialDate: Date;
  onSaved: () => void;
  onCancel: () => void;
}

const bristolOptions = [
  {
    value: 1,
    label: "Bolitas duras",
  },
  {
    value: 2,
    label: "Grumosa",
  },
  {
    value: 3,
    label: "Agrietada",
  },
  {
    value: 4,
    label: "Lisa y suave",
  },
  {
    value: 5,
    label: "Trozos blandos",
  },
  {
    value: 6,
    label: "Pastosa",
  },
  {
    value: 7,
    label: "Líquida",
  },
];

const levelOptions = [0, 1, 2, 3, 4];

export function BathroomRegistrationForm({
  userId,
  initialDate,
  onSaved,
  onCancel,
}: BathroomRegistrationFormProps) {
  const [occurredAt, setOccurredAt] = useState(
    toLocalDateTimeInput(initialDate),
  );

  const [bristolType, setBristolType] = useState(4);

  const [urgency, setUrgency] = useState(0);

  const [painLevel, setPainLevel] = useState(0);

  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await createBathroomEntry({
        userId,
        occurredAt: localDateTimeToIso(occurredAt),
        bristolType,
        urgency,
        painLevel,
        notes,
      });

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError("No pudimos guardar el registro. Inténtelo nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="bathroom-time">
          ¿Cuándo?
        </label>

        <input
          id="bathroom-time"
          className="entry-form__input entry-form__date"
          type="datetime-local"
          value={occurredAt}
          onChange={(event) => setOccurredAt(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Tipo de evacuación</p>

        <p className="entry-form__hint">Escala de Bristol</p>

        <div className="bristol-grid">
          {bristolOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="bristol-option"
              data-selected={bristolType === option.value}
              onClick={() => setBristolType(option.value)}
            >
              <strong>Tipo {option.value}</strong>

              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Urgencia</p>

        <div className="level-grid">
          {levelOptions.map((level) => (
            <button
              key={level}
              type="button"
              className="level-option"
              data-selected={urgency === level}
              onClick={() => setUrgency(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="level-labels">
          <span>Nada</span>
          <span>Inmediata</span>
        </div>
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Dolor o molestia</p>

        <div className="level-grid">
          {levelOptions.map((level) => (
            <button
              key={level}
              type="button"
              className="level-option"
              data-selected={painLevel === level}
              onClick={() => setPainLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="level-labels">
          <span>Nada</span>
          <span>Intenso</span>
        </div>
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="bathroom-notes">
          Notas
        </label>

        <textarea
          id="bathroom-notes"
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
          {saving ? "Guardando…" : "Guardar registro"}
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
