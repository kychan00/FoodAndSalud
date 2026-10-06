import { combinationDiscriminationScenario } from "./combinationScenario";

import type {
  AssociationSignal,
  BathroomObservation,
  FoodExposure,
  MedicineObservation,
} from "../association.types";

interface ScenarioInput {
  days: number;
  totalFoodEntries: number;
  exposures: FoodExposure[];
  bathrooms: BathroomObservation[];
  medicines: MedicineObservation[];
}

export interface PatternQaScenario {
  id: string;
  title: string;
  description: string;
  bugFocus: string;
  expectedText: string;
  expectedSignals: Record<string, AssociationSignal>;
  expectedMedicineOverlap?: Record<string, number>;
  input: ScenarioInput;
}

function iso(day: number, hour: number) {
  return `2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:00:00Z`;
}

function exposure(
  entryId: string,
  foodId: string,
  foodName: string,
  day: number,
  hour = 8,
): FoodExposure {
  return {
    entryId,
    foodId,
    foodName,
    eatenAt: iso(day, hour),
  };
}

function bathroom(
  id: string,
  day: number,
  bristolType: number,
  urgency = 0,
  painLevel = 0,
  hour = 12,
): BathroomObservation {
  return {
    id,
    occurredAt: iso(day, hour),
    bristolType,
    urgency,
    painLevel,
  };
}

function medicine(id: string, day: number, hour = 9): MedicineObservation {
  return {
    id,
    occurredAt: iso(day, hour),
  };
}

function buildHighCoffeeScenario(): PatternQaScenario {
  const exposures: FoodExposure[] = [];
  const bathrooms: BathroomObservation[] = [];

  for (let day = 1; day <= 16; day += 1) {
    const coffeeDay = day % 2 === 1;

    if (coffeeDay) {
      exposures.push(exposure(`entry-${day}`, "coffee", "Café", day));

      bathrooms.push(bathroom(`bath-${day}`, day, day % 4 === 1 ? 7 : 6, 3, 1));
    } else {
      exposures.push(exposure(`entry-${day}`, "rice", "Arroz", day));

      bathrooms.push(bathroom(`bath-${day}`, day, 4, 0, 0));
    }
  }

  return {
    id: "coffee-high",
    title: "Café con señal alta",
    description:
      "Café aparece 8 veces y siempre precede una respuesta marcada. Arroz aparece 8 veces y siempre precede una evacuación Bristol 4 sin urgencia ni dolor.",
    bugFocus:
      "Comprueba ranking, señal alta, alimento neutral y referencia personal.",
    expectedText:
      "Café debe quedar arriba con señal alta. Arroz debe quedar sin señal clara.",
    expectedSignals: {
      coffee: "high",
      rice: "low",
    },
    input: {
      days: 90,
      totalFoodEntries: 16,
      exposures,
      bathrooms,
      medicines: [],
    },
  };
}

function buildInsufficientScenario(): PatternQaScenario {
  return {
    id: "insufficient",
    title: "Pocos datos",
    description:
      "Queso aparece solamente dos veces y ambas coinciden con Bristol 7.",
    bugFocus: "Evita que dos observaciones produzcan una conclusión fuerte.",
    expectedText:
      "Queso debe seguir mostrando Pocos datos aunque ambas coincidencias sean adversas.",
    expectedSignals: {
      cheese: "insufficient",
    },
    input: {
      days: 90,
      totalFoodEntries: 2,
      exposures: [
        exposure("entry-cheese-1", "cheese", "Queso", 1),
        exposure("entry-cheese-2", "cheese", "Queso", 3),
      ],
      bathrooms: [
        bathroom("bath-cheese-1", 1, 7, 3, 2),
        bathroom("bath-cheese-2", 3, 7, 2, 1),
      ],
      medicines: [],
    },
  };
}

function buildMediumMilkScenario(): PatternQaScenario {
  const exposures = [
    exposure("milk-1", "milk", "Leche", 1),
    exposure("milk-2", "milk", "Leche", 3),
    exposure("milk-3", "milk", "Leche", 5),
    exposure("milk-4", "milk", "Leche", 7),
  ];

  const bathrooms = [
    bathroom("milk-bath-1", 1, 6, 2, 0),
    bathroom("milk-bath-2", 3, 7, 2, 1),
    bathroom("milk-bath-3", 5, 6, 0, 2),
    bathroom("milk-bath-4", 7, 4, 0, 0),

    bathroom("background-10", 10, 7, 2, 0),
    bathroom("background-11", 11, 6, 0, 2),
    bathroom("background-12", 12, 4),
    bathroom("background-13", 13, 4),
    bathroom("background-14", 14, 4),
    bathroom("background-15", 15, 4),
    bathroom("background-16", 16, 4),
    bathroom("background-17", 17, 4),
  ];

  return {
    id: "milk-medium",
    title: "Leche con señal media",
    description:
      "Leche aparece cuatro veces. Tres exposiciones presentan una respuesta marcada y una es normal.",
    bugFocus: "Comprueba el umbral medio y la evidencia media.",
    expectedText: "Leche debe producir señal media, no alta.",
    expectedSignals: {
      milk: "medium",
    },
    input: {
      days: 90,
      totalFoodEntries: 4,
      exposures,
      bathrooms,
      medicines: [],
    },
  };
}

function buildNeutralRiceScenario(): PatternQaScenario {
  const exposures: FoodExposure[] = [];
  const bathrooms: BathroomObservation[] = [];

  for (let day = 1; day <= 8; day += 1) {
    exposures.push(exposure(`rice-${day}`, "rice", "Arroz", day));

    bathrooms.push(bathroom(`rice-bath-${day}`, day, 4, 0, 0));
  }

  bathrooms.push(
    bathroom("background-a1", 15, 7, 3, 2),
    bathroom("background-a2", 16, 6, 2, 0),
    bathroom("background-a3", 17, 2, 0, 2),
    bathroom("background-a4", 18, 7, 2, 1),
    bathroom("background-n1", 19, 4),
    bathroom("background-n2", 20, 4),
    bathroom("background-n3", 21, 4),
    bathroom("background-n4", 22, 4),
  );

  return {
    id: "rice-neutral",
    title: "Arroz neutral",
    description:
      "Arroz aparece ocho veces y todas las evacuaciones posteriores son Bristol 4 sin urgencia ni dolor. Existen otros eventos adversos en días distintos.",
    bugFocus:
      "Comprueba que una referencia personal con eventos adversos no convierta artificialmente un alimento neutral en sospechoso.",
    expectedText: "Arroz debe mostrar Sin señal clara.",
    expectedSignals: {
      rice: "low",
    },
    input: {
      days: 90,
      totalFoodEntries: 8,
      exposures,
      bathrooms,
      medicines: [],
    },
  };
}

function buildMedicineOverlapScenario(): PatternQaScenario {
  const exposures: FoodExposure[] = [];
  const bathrooms: BathroomObservation[] = [];
  const medicines: MedicineObservation[] = [];

  for (let day = 1; day <= 6; day += 1) {
    exposures.push(exposure(`coffee-med-${day}`, "coffee", "Café", day));

    medicines.push(medicine(`medicine-${day}`, day));

    bathrooms.push(bathroom(`coffee-med-bath-${day}`, day, 7, 3, 2));
  }

  for (let day = 15; day <= 20; day += 1) {
    bathrooms.push(bathroom(`normal-${day}`, day, 4, 0, 0));
  }

  return {
    id: "medicine-overlap",
    title: "Café + Medicina",
    description:
      "Café aparece seis veces y las seis ocasiones tienen una respuesta marcada, pero también existe Medicina dentro de la misma ventana temporal.",
    bugFocus:
      "Comprueba que el motor detecte la asociación sin ocultar un posible factor concurrente.",
    expectedText:
      "Café puede mostrar señal alta, pero debe advertir que Medicina coincide en las seis exposiciones.",
    expectedSignals: {
      coffee: "high",
    },
    expectedMedicineOverlap: {
      coffee: 6,
    },
    input: {
      days: 90,
      totalFoodEntries: 6,
      exposures,
      bathrooms,
      medicines,
    },
  };
}

function buildMixedMealScenario(): PatternQaScenario {
  const exposures: FoodExposure[] = [];
  const bathrooms: BathroomObservation[] = [];

  for (let day = 1; day <= 4; day += 1) {
    const entryId = `mixed-${day}`;

    exposures.push(
      exposure(entryId, "coffee", "Café", day),

      exposure(entryId, "milk", "Leche", day),
    );

    bathrooms.push(bathroom(`mixed-bath-${day}`, day, 7, 3, 2));
  }

  for (let day = 15; day <= 18; day += 1) {
    bathrooms.push(bathroom(`mixed-normal-${day}`, day, 4, 0, 0));
  }

  return {
    id: "mixed-ambiguity",
    title: "Café + Leche juntos",
    description:
      "Café y Leche aparecen siempre en la misma comida y las cuatro comidas preceden respuestas marcadas.",
    bugFocus:
      "Comprueba el problema de ambigüedad: el sistema no puede saber cuál de los dos alimentos explica mejor el patrón cuando siempre aparecen juntos.",
    expectedText:
      "Café y Leche deben obtener señales muy similares. Ninguno debe presentarse como causa.",
    expectedSignals: {
      coffee: "high",
      milk: "high",
    },
    input: {
      days: 90,
      totalFoodEntries: 4,
      exposures,
      bathrooms,
      medicines: [],
    },
  };
}

export const patternQaScenarios: PatternQaScenario[] = [
  combinationDiscriminationScenario,
  buildHighCoffeeScenario(),
  buildInsufficientScenario(),
  buildMediumMilkScenario(),
  buildNeutralRiceScenario(),
  buildMedicineOverlapScenario(),
  buildMixedMealScenario(),
];
