import type { AssociationSignal } from "../association.types";

function iso(day: number, hour: number) {
  return `2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:00:00Z`;
}

const exposures = [
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
];

const bathrooms = [
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
];

export const combinationDiscriminationScenario = {
  id: "coffee-milk-discrimination",

  title: "Café solo vs Café + Leche",

  description:
    "Café aparece ocho veces. Cuatro veces se consume con Leche y las cuatro son seguidas por una respuesta marcada. Las cuatro veces que Café aparece sin Leche son seguidas por Bristol 4 sin urgencia ni dolor.",

  bugFocus:
    "Comprueba si el detalle puede distinguir una combinación específica de la señal general del alimento.",

  expectedText:
    "Café globalmente no debe parecer claramente problemático, pero en su detalle Café + Leche debe mostrar 100% y Café sin Leche 0%.",

  expectedSignals: {
    coffee: "low",
    milk: "high",
  } satisfies Record<string, AssociationSignal>,

  input: {
    days: 90,

    totalFoodEntries: 8,

    exposures,

    bathrooms,

    medicines: [],
  },
};
