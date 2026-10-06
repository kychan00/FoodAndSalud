import { useState, type FormEvent } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button } from "../../../components/ui/Button";

import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";

import {
  getBathroomEntryForEdit,
  updateBathroomEntry,
  type EditableBathroomEntry,
} from "../bathroom.service";

import "../../entries/components/EntryForm.css";
import "./BathroomRegistrationForm.css";

interface BathroomEntryEditFormProps {
  userId: string;
  entryId: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface BathroomEntryEditFieldsProps extends BathroomEntryEditFormProps {
  initial: EditableBathroomEntry;
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

const levels = [0, 1, 2, 3, 4];

function BathroomEntryEditFields({
  userId,
  entryId,
  onSaved,
  onCancel,
  initial,
}: BathroomEntryEditFieldsProps) {
  const [occurredAt, setOccurredAt] = useState(() =>
    toLocalDateTimeInput(new Date(initial.occurredAt)),
  );

  const [bristolType, setBristolType] = useState(initial.bristolType);

  const [urgency, setUrgency] = useState(initial.urgency);

  const [painLevel, setPainLevel] = useState(initial.painLevel);

  const [notes, setNotes] = useState(initial.notes);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await updateBathroomEntry({
        userId,
        entryId,

        occurredAt: localDateTimeToIso(occurredAt),

        bristolType,
        urgency,
        painLevel,
        notes,
      });

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError("No pudimos actualizar este registro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-bathroom-time">
          ¿Cuándo?
        </label>

        <input
          id="edit-bathroom-time"
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
          {levels.map((level) => (
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
          {levels.map((level) => (
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
        <label className="entry-form__label" htmlFor="edit-bathroom-notes">
          Notas
        </label>

        <textarea
          id="edit-bathroom-notes"
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
          {saving ? "Guardando…" : "Guardar cambios"}
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

export function BathroomEntryEditForm({
  userId,
  entryId,
  onSaved,
  onCancel,
}: BathroomEntryEditFormProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["entry-editor", "bathroom", userId, entryId],

    queryFn: () => getBathroomEntryForEdit(userId, entryId),
  });

  if (isLoading) {
    return <div className="entry-editor-state">Cargando Bristol…</div>;
  }

  if (isError || !data) {
    return (
      <div className="entry-editor-state entry-editor-state--error">
        No pudimos cargar este registro.
      </div>
    );
  }

  return (
    <BathroomEntryEditFields
      key={entryId}
      userId={userId}
      entryId={entryId}
      onSaved={onSaved}
      onCancel={onCancel}
      initial={data}
    />
  );
}
