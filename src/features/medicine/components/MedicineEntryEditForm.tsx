import { useMemo, useState, type FormEvent } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button } from "../../../components/ui/Button";

import { QuickSuggestionChips } from "../../entries/components/QuickSuggestionChips";

import { normalizeSuggestionText } from "../../entries/dailySuggestions";

import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";

import {
  getMedicineEntryForEdit,
  updateMedicineEntry,
  type EditableMedicineEntry,
} from "../medicine.service";

import type { MedicineSuggestion } from "../medicineSuggestions.service";

import { useMedicineSuggestions } from "../useMedicineSuggestions";

import "../../entries/components/EntryForm.css";
import "./MedicineRegistrationForm.css";

interface MedicineEntryEditFormProps {
  userId: string;
  entryId: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface MedicineEntryEditFieldsProps extends MedicineEntryEditFormProps {
  initial: EditableMedicineEntry;

  suggestions: MedicineSuggestion[];
}

const units = ["mg", "g", "ml", "tableta", "cápsula"];

function MedicineEntryEditFields({
  userId,
  entryId,
  onSaved,
  onCancel,
  initial,
  suggestions,
}: MedicineEntryEditFieldsProps) {
  const [name, setName] = useState(initial.name);

  const [takenAt, setTakenAt] = useState(() =>
    toLocalDateTimeInput(new Date(initial.takenAt)),
  );

  const [dose, setDose] = useState(
    initial.dose === null ? "" : String(initial.dose),
  );

  const [unit, setUnit] = useState(initial.unit || "mg");

  const [reason, setReason] = useState(initial.reason);

  const [notes, setNotes] = useState(initial.notes);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const visibleSuggestions = useMemo(() => {
    const query = normalizeSuggestionText(name);

    return suggestions
      .filter(
        (item) => !query || normalizeSuggestionText(item.name).includes(query),
      )
      .slice(0, 8);
  }, [name, suggestions]);

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
      await updateMedicineEntry({
        userId,
        entryId,

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

      setError("No pudimos actualizar Medicina.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <QuickSuggestionChips
        label="Atajos"
        hint="Historial personal"
        items={visibleSuggestions.map((item) => ({
          id: item.id,

          label: item.name,

          meta:
            item.lastDose !== null
              ? `${item.lastDose} ${item.lastUnit ?? item.defaultUnit ?? ""}`.trim()
              : item.defaultUnit,

          favorite: item.isFavorite,
        }))}
        onSelect={(id) => {
          const item = suggestions.find((candidate) => candidate.id === id);

          if (!item) {
            return;
          }

          setName(item.name);

          if (item.lastDose !== null) {
            setDose(String(item.lastDose));
          }

          const nextUnit = item.lastUnit ?? item.defaultUnit;

          if (nextUnit) {
            setUnit(nextUnit);
          }
        }}
      />

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-medicine-name">
          Nombre
        </label>

        <input
          id="edit-medicine-name"
          className="entry-form__input"
          type="text"
          value={name}
          maxLength={120}
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-medicine-time">
          ¿Cuándo?
        </label>

        <input
          id="edit-medicine-time"
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
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-medicine-reason">
          Motivo
        </label>

        <input
          id="edit-medicine-reason"
          className="entry-form__input"
          type="text"
          value={reason}
          maxLength={300}
          onChange={(event) => setReason(event.target.value)}
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-medicine-notes">
          Notas
        </label>

        <textarea
          id="edit-medicine-notes"
          className="entry-form__textarea"
          value={notes}
          maxLength={2000}
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

export function MedicineEntryEditForm({
  userId,
  entryId,
  onSaved,
  onCancel,
}: MedicineEntryEditFormProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["entry-editor", "medicine", userId, entryId],

    queryFn: () => getMedicineEntryForEdit(userId, entryId),
  });

  const { data: suggestions = [] } = useMedicineSuggestions(userId);

  if (isLoading) {
    return <div className="entry-editor-state">Cargando Medicina…</div>;
  }

  if (isError || !data) {
    return (
      <div className="entry-editor-state entry-editor-state--error">
        No pudimos cargar este registro.
      </div>
    );
  }

  return (
    <MedicineEntryEditFields
      key={entryId}
      userId={userId}
      entryId={entryId}
      onSaved={onSaved}
      onCancel={onCancel}
      initial={data}
      suggestions={suggestions}
    />
  );
}
