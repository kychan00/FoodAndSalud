import type { AssociationSignal } from "../association.types";

import type { PatternQaScenario } from "./association.fixtures";

function iso(day: number, hour: number) {
  return `2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:00:00Z`;
}

/*
 * Escenario 1:
 * la diferencia ya existe dentro de las primeras 6 horas.
 */
export const combinationDiscriminationScenario: PatternQaScenario = {
  id: "coffee-milk-discrimination",

  title: "Café solo vs Café + Leche",

  description:
    "Café aparece ocho veces. Cuatro veces se consume con Leche y las cuatro son seguidas por una respuesta marcada a las 4 horas. Las cuatro veces que Café aparece sin Leche son seguidas por Bristol 4.",

  bugFocus:
    "Comprueba una diferencia clara entre combinación y alimento sin acompañante.",

  expectedText:
    "Café + Leche debe mostrar 100% y Café sin Leche 0% desde la ventana de 6 horas.",

  expectedSignals: {
    coffee: "low",

    milk: "medium",
  } satisfies Record<string, AssociationSignal>,

  input: {
    days: 90,

    totalFoodEntries: 8,

    exposures: [
      {
        entryId: "combo-1",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(1, 8),
      },
      {
        entryId: "combo-1",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(1, 8),
      },

      {
        entryId: "combo-2",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(2, 8),
      },
      {
        entryId: "combo-2",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(2, 8),
      },

      {
        entryId: "combo-3",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(3, 8),
      },
      {
        entryId: "combo-3",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(3, 8),
      },

      {
        entryId: "combo-4",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(4, 8),
      },
      {
        entryId: "combo-4",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(4, 8),
      },

      {
        entryId: "solo-5",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(5, 8),
      },

      {
        entryId: "solo-6",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(6, 8),
      },

      {
        entryId: "solo-7",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(7, 8),
      },

      {
        entryId: "solo-8",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(8, 8),
      },
    ],

    bathrooms: [
      {
        id: "combo-b1",
        occurredAt: iso(1, 12),
        bristolType: 7,
        urgency: 3,
        painLevel: 1,
      },
      {
        id: "combo-b2",
        occurredAt: iso(2, 12),
        bristolType: 6,
        urgency: 2,
        painLevel: 1,
      },
      {
        id: "combo-b3",
        occurredAt: iso(3, 12),
        bristolType: 7,
        urgency: 3,
        painLevel: 2,
      },
      {
        id: "combo-b4",
        occurredAt: iso(4, 12),
        bristolType: 6,
        urgency: 2,
        painLevel: 0,
      },

      {
        id: "solo-b5",
        occurredAt: iso(5, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "solo-b6",
        occurredAt: iso(6, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "solo-b7",
        occurredAt: iso(7, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "solo-b8",
        occurredAt: iso(8, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
    ],

    medicines: [],
  },
};

/*
 * Escenario 2:
 *
 * 08:00 Café + Leche
 * 12:00 Bristol 4 normal
 * 18:00 Bristol 6/7 marcado
 *
 * Por tanto:
 *
 * 6 h  -> combinación 0%
 * 12 h -> combinación 100%
 * 24 h -> combinación 100%
 *
 * Café sin Leche sólo tiene Bristol 4 a las 4h.
 */
export const delayedCombinationScenario: PatternQaScenario = {
  id: "coffee-milk-delayed",

  title: "Café + Leche con patrón tardío",

  description:
    "Las comidas con Café + Leche tienen primero Bristol 4 a las 4 horas y después una respuesta marcada a las 10 horas. Café sin Leche sólo presenta Bristol 4.",

  bugFocus:
    "Comprueba que una combinación pueda verse neutral a 6 horas pero diferente al ampliar la ventana a 12 y 24 horas.",

  expectedText:
    "A 6 h ambos contextos deben estar en 0%. A 12 h y 24 h Café + Leche debe subir a 100% mientras Café sin Leche permanece en 0%.",

  expectedSignals: {
    coffee: "low",

    milk: "medium",
  } satisfies Record<string, AssociationSignal>,

  input: {
    days: 90,

    totalFoodEntries: 8,

    exposures: [
      {
        entryId: "late-combo-1",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(1, 8),
      },
      {
        entryId: "late-combo-1",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(1, 8),
      },

      {
        entryId: "late-combo-2",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(2, 8),
      },
      {
        entryId: "late-combo-2",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(2, 8),
      },

      {
        entryId: "late-combo-3",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(3, 8),
      },
      {
        entryId: "late-combo-3",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(3, 8),
      },

      {
        entryId: "late-combo-4",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(4, 8),
      },
      {
        entryId: "late-combo-4",
        foodId: "milk",
        foodName: "Leche",
        eatenAt: iso(4, 8),
      },

      {
        entryId: "late-solo-5",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(5, 8),
      },
      {
        entryId: "late-solo-6",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(6, 8),
      },
      {
        entryId: "late-solo-7",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(7, 8),
      },
      {
        entryId: "late-solo-8",
        foodId: "coffee",
        foodName: "Café",
        eatenAt: iso(8, 8),
      },
    ],

    bathrooms: [
      /*
       * Café + Leche:
       * normal a 4 horas.
       */
      {
        id: "late-normal-1",
        occurredAt: iso(1, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "late-normal-2",
        occurredAt: iso(2, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "late-normal-3",
        occurredAt: iso(3, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "late-normal-4",
        occurredAt: iso(4, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },

      /*
       * Café + Leche:
       * respuesta marcada a 10 horas.
       */
      {
        id: "late-adverse-1",
        occurredAt: iso(1, 18),
        bristolType: 7,
        urgency: 2,
        painLevel: 1,
      },
      {
        id: "late-adverse-2",
        occurredAt: iso(2, 18),
        bristolType: 6,
        urgency: 2,
        painLevel: 1,
      },
      {
        id: "late-adverse-3",
        occurredAt: iso(3, 18),
        bristolType: 7,
        urgency: 3,
        painLevel: 1,
      },
      {
        id: "late-adverse-4",
        occurredAt: iso(4, 18),
        bristolType: 6,
        urgency: 2,
        painLevel: 1,
      },

      /*
       * Café sin Leche:
       * normal a 4 horas.
       */
      {
        id: "late-solo-normal-5",
        occurredAt: iso(5, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "late-solo-normal-6",
        occurredAt: iso(6, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "late-solo-normal-7",
        occurredAt: iso(7, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
      {
        id: "late-solo-normal-8",
        occurredAt: iso(8, 12),
        bristolType: 4,
        urgency: 0,
        painLevel: 0,
      },
    ],

    medicines: [],
  },
};
