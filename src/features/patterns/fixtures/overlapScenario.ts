import type {
  AssociationSignal,
  BathroomObservation,
  FoodExposure,
} from "../association.types";

import type { PatternQaScenario } from "./association.fixtures";

function iso(day: number, hour: number) {
  return `2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:00:00Z`;
}

const exposures: FoodExposure[] = [];

const bathrooms: BathroomObservation[] = [];

/*
 * Días 1–4
 *
 * 08:00 Café
 * 13:00 Arroz
 * 15:00 respuesta marcada
 */
for (let day = 1; day <= 4; day += 1) {
  exposures.push(
    {
      entryId: `coffee-${day}`,

      foodId: "coffee",

      foodName: "Café",

      eatenAt: iso(day, 8),
    },

    {
      entryId: `rice-${day}`,

      foodId: "rice",

      foodName: "Arroz",

      eatenAt: iso(day, 13),
    },
  );

  bathrooms.push({
    id: `rice-bath-${day}`,

    occurredAt: iso(day, 15),

    bristolType: 7,

    urgency: 2,

    painLevel: 1,
  });
}

/*
 * Días 5–8
 *
 * 08:00 Café
 * 13:00 Pan
 * 15:00 respuesta normal
 */
for (let day = 5; day <= 8; day += 1) {
  exposures.push(
    {
      entryId: `coffee-${day}`,

      foodId: "coffee",

      foodName: "Café",

      eatenAt: iso(day, 8),
    },

    {
      entryId: `bread-${day}`,

      foodId: "bread",

      foodName: "Pan",

      eatenAt: iso(day, 13),
    },
  );

  bathrooms.push({
    id: `bread-bath-${day}`,

    occurredAt: iso(day, 15),

    bristolType: 4,

    urgency: 0,

    painLevel: 0,
  });
}

export const overlappingMealScenario: PatternQaScenario = {
  id: "overlapping-meals",

  title: "Comidas superpuestas",

  description:
    "Café se registra a las 08:00. A las 13:00 se registra otra comida y la evacuación ocurre a las 15:00. La respuesta posterior debe pertenecer a la ventana de la comida de las 13:00, no fortalecer también el Café de la mañana.",

  bugFocus:
    "Comprueba que una misma evacuación no sea atribuida simultáneamente a varias comidas cuando una exposición posterior ya interrumpió la ventana anterior.",

  expectedText:
    "Café debe quedar sin exposiciones evaluables porque sus ocho ventanas terminan cuando aparece la comida de las 13:00. Arroz debe conservar 4 respuestas marcadas y Pan 4 respuestas normales.",

  expectedSignals: {
    coffee: "insufficient",

    rice: "medium",

    bread: "low",
  } satisfies Record<string, AssociationSignal>,

  input: {
    days: 90,

    totalFoodEntries: 16,

    exposures,

    bathrooms,

    medicines: [],
  },
};
