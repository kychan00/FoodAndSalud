import { History } from "lucide-react";

import type { MealType } from "../food.service";

import type { RecentMealTemplate } from "../recentMeals";

import "./RecentMealTemplates.css";

interface RecentMealTemplatesProps {
  items: RecentMealTemplate[];

  onSelect: (item: RecentMealTemplate) => void;
}

const mealLabels: Record<MealType, string> = {
  breakfast: "Desayuno",

  lunch: "Comida",

  dinner: "Cena",

  snack: "Colación",

  other: "Otro",
};

export function RecentMealTemplates({
  items,
  onSelect,
}: RecentMealTemplatesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="recent-meals">
      <div className="recent-meals__heading">
        <div>
          <History size={16} />

          <strong>Comidas recientes</strong>
        </div>

        <span>Reutilice una combinación</span>
      </div>

      <div className="recent-meals__scroller">
        {items.map((item) => (
          <button
            key={item.sourceEntryId}
            type="button"
            className="recent-meal-card"
            onClick={() => onSelect(item)}
          >
            <span className="recent-meal-card__type">
              {mealLabels[item.mealType]}
            </span>

            <strong>{item.foodNames.join(" · ")}</strong>

            <small>Usar esta comida</small>
          </button>
        ))}
      </div>
    </section>
  );
}
