import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { localDateTimeToIso, toLocalDateTimeInput } from "../../../utils/date";
import { createFoodEntry, type MealType } from "../food.service";

import "../../entries/components/EntryForm.css";
import "./FoodRegistrationForm.css";

interface FoodRegistrationFormProps {
  userId: string;
  initialDate: Date;
  onSaved: () => void;
  onCancel: () => void;
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

function normalizeKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-MX");
}

export function FoodRegistrationForm({
  userId,
  initialDate,
  onSaved,
  onCancel,
}: FoodRegistrationFormProps) {
  const [mealType, setMealType] = useState<MealType>("lunch");

  const [eatenAt, setEatenAt] = useState(toLocalDateTimeInput(initialDate));

  const [foodInput, setFoodInput] = useState("");

  const [foodNames, setFoodNames] = useState<string[]>([]);

  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const addFood = () => {
    const value = foodInput.trim().replace(/\s+/g, " ");

    if (!value) {
      return;
    }

    const key = normalizeKey(value);

    if (foodNames.some((food) => normalizeKey(food) === key)) {
      setFoodInput("");
      return;
    }

    setFoodNames((current) => [...current, value]);

    setFoodInput("");
    setError(null);
  };

  const handleFoodKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addFood();
    }
  };

  const removeFood = (index: number) => {
    setFoodNames((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let namesToSave = [...foodNames];

    if (foodInput.trim()) {
      const value = foodInput.trim().replace(/\s+/g, " ");

      const exists = namesToSave.some(
        (food) => normalizeKey(food) === normalizeKey(value),
      );

      if (!exists) {
        namesToSave = [...namesToSave, value];
      }
    }

    if (namesToSave.length === 0) {
      setError("Agregue al menos un alimento.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createFoodEntry({
        userId,
        eatenAt: localDateTimeToIso(eatenAt),
        mealType,
        notes,
        foodNames: namesToSave,
      });

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError("No pudimos guardar la comida. Inténtelo nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={(event) => void handleSubmit(event)}>
      <section className="entry-form__section">
        <p className="entry-form__label">¿Qué tipo de comida fue?</p>

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
        <label className="entry-form__label" htmlFor="food-eaten-at">
          ¿Cuándo?
        </label>

        <input
          id="food-eaten-at"
          className="entry-form__input entry-form__date"
          type="datetime-local"
          value={eatenAt}
          onChange={(event) => setEatenAt(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="food-name">
          ¿Qué comió?
        </label>

        <p className="entry-form__hint">
          Agregue cada alimento por separado. Ejemplo: arroz, pollo, salsa.
        </p>

        <div className="food-add-row">
          <input
            id="food-name"
            className="entry-form__input"
            type="text"
            value={foodInput}
            placeholder="Ej. Café"
            maxLength={120}
            onChange={(event) => setFoodInput(event.target.value)}
            onKeyDown={handleFoodKeyDown}
          />

          <button
            type="button"
            className="food-add-button"
            aria-label="Agregar alimento"
            onClick={addFood}
          >
            <Plus size={20} />
          </button>
        </div>

        {foodNames.length > 0 ? (
          <div className="food-chip-list">
            {foodNames.map((food, index) => (
              <span key={`${food}-${index}`} className="food-chip">
                {food}

                <button
                  type="button"
                  aria-label={`Quitar ${food}`}
                  onClick={() => removeFood(index)}
                >
                  <X size={15} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="food-notes">
          Notas
        </label>

        <textarea
          id="food-notes"
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
          {saving ? "Guardando…" : "Guardar comida"}
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
