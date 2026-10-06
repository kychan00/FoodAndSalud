import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";

import { useQuery } from "@tanstack/react-query";

import { Plus, X } from "lucide-react";

import { Button } from "../../../components/ui/Button";

import { QuickSuggestionChips } from "../../entries/components/QuickSuggestionChips";

import { normalizeSuggestionText } from "../../entries/dailySuggestions";

import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";

import {
  getFoodEntryForEdit,
  normalizeUniqueFoodNames,
  updateFoodEntry,
  type EditableFoodEntry,
  type MealType,
} from "../food.service";

import type { FoodSuggestion } from "../foodSuggestions.service";

import { useFoodSuggestions } from "../useFoodSuggestions";

import "../../entries/components/EntryForm.css";
import "./FoodRegistrationForm.css";

interface FoodEntryEditFormProps {
  userId: string;
  entryId: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface FoodEntryEditFieldsProps extends FoodEntryEditFormProps {
  initial: EditableFoodEntry;
  suggestions: FoodSuggestion[];
}

const mealTypes: Array<{
  value: MealType;
  label: string;
}> = [
  {
    value: "breakfast",
    label: "Desayuno",
  },
  {
    value: "lunch",
    label: "Comida",
  },
  {
    value: "dinner",
    label: "Cena",
  },
  {
    value: "snack",
    label: "Colación",
  },
  {
    value: "other",
    label: "Otro",
  },
];

function FoodEntryEditFields({
  userId,
  entryId,
  onSaved,
  onCancel,
  initial,
  suggestions,
}: FoodEntryEditFieldsProps) {
  const [mealType, setMealType] = useState<MealType>(initial.mealType);

  const [eatenAt, setEatenAt] = useState(() =>
    toLocalDateTimeInput(new Date(initial.eatenAt)),
  );

  const [foodInput, setFoodInput] = useState("");

  const [foodNames, setFoodNames] = useState<string[]>(() => [
    ...initial.foodNames,
  ]);

  const [notes, setNotes] = useState(initial.notes);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const visibleSuggestions = useMemo(() => {
    const selected = new Set(foodNames.map(normalizeSuggestionText));

    const query = normalizeSuggestionText(foodInput);

    return suggestions
      .filter((item) => {
        if (selected.has(normalizeSuggestionText(item.name))) {
          return false;
        }

        return !query || normalizeSuggestionText(item.name).includes(query);
      })
      .slice(0, 8);
  }, [foodInput, foodNames, suggestions]);

  const addFood = (raw: string) => {
    const next = normalizeUniqueFoodNames([...foodNames, raw]);

    setFoodNames(next);

    setFoodInput("");

    setError(null);
  };

  const handleFoodKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (foodInput.trim()) {
        addFood(foodInput);
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let names = [...foodNames];

    if (foodInput.trim()) {
      names = normalizeUniqueFoodNames([...names, foodInput]);
    }

    if (names.length === 0) {
      setError("Agregue al menos un alimento.");

      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateFoodEntry({
        userId,
        entryId,

        eatenAt: localDateTimeToIso(eatenAt),

        mealType,
        notes,

        foodNames: names,
      });

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError("No pudimos actualizar la comida.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <section className="entry-form__section">
        <p className="entry-form__label">Tipo de comida</p>

        <div className="entry-form__choices">
          {mealTypes.map((option) => (
            <button
              key={option.value}
              type="button"
              className="entry-choice"
              data-selected={mealType === option.value}
              onClick={() => setMealType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-food-time">
          ¿Cuándo?
        </label>

        <input
          id="edit-food-time"
          className="entry-form__input entry-form__date"
          type="datetime-local"
          value={eatenAt}
          onChange={(event) => setEatenAt(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-food-name">
          Alimentos
        </label>

        <QuickSuggestionChips
          label="Atajos"
          hint="Recientes y favoritos"
          items={visibleSuggestions.map((item) => ({
            id: item.id,

            label: item.name,

            favorite: item.isFavorite,
          }))}
          onSelect={(id) => {
            const item = suggestions.find((candidate) => candidate.id === id);

            if (item) {
              addFood(item.name);
            }
          }}
        />

        <div className="food-add-row">
          <input
            id="edit-food-name"
            className="entry-form__input"
            type="text"
            value={foodInput}
            placeholder="Agregar alimento"
            autoComplete="off"
            maxLength={120}
            onChange={(event) => setFoodInput(event.target.value)}
            onKeyDown={handleFoodKeyDown}
          />

          <button
            type="button"
            className="food-add-button"
            aria-label="Agregar alimento"
            onClick={() => {
              if (foodInput.trim()) {
                addFood(foodInput);
              }
            }}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="food-chip-list">
          {foodNames.map((food, index) => (
            <span key={`${food}-${index}`} className="food-chip">
              {food}

              <button
                type="button"
                aria-label={`Quitar ${food}`}
                onClick={() =>
                  setFoodNames((current) =>
                    current.filter((_, currentIndex) => currentIndex !== index),
                  )
                }
              >
                <X size={15} />
              </button>
            </span>
          ))}
        </div>
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-food-notes">
          Notas
        </label>

        <textarea
          id="edit-food-notes"
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

export function FoodEntryEditForm({
  userId,
  entryId,
  onSaved,
  onCancel,
}: FoodEntryEditFormProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["entry-editor", "food", userId, entryId],

    queryFn: () => getFoodEntryForEdit(userId, entryId),
  });

  const { data: suggestions = [] } = useFoodSuggestions(userId);

  if (isLoading) {
    return <div className="entry-editor-state">Cargando comida…</div>;
  }

  if (isError || !data) {
    return (
      <div className="entry-editor-state entry-editor-state--error">
        No pudimos cargar esta comida.
      </div>
    );
  }

  return (
    <FoodEntryEditFields
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
