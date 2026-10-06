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

for (let day = 1; day <= 16; day += 1) {
  const coffeeDay = day % 2 === 1;

  exposures.push({
    entryId: coffeeDay ? `latency-coffee-${day}` : `latency-rice-${day}`,

    foodId: coffeeDay ? "coffee" : "rice",

    foodName: coffeeDay ? "Café" : "Arroz",

    eatenAt: iso(day, 6),
  });

  bathrooms.push({
    id: `latency-bath-${day}`,

    occurredAt: coffeeDay ? iso(day, 22) : iso(day, 10),

    bristolType: coffeeDay ? 7 : 4,

    urgency: coffeeDay ? 2 : 0,

    painLevel: 0,
  });
}

export const latencyLateScenario: PatternQaScenario = {
  id: "latency-late-16h",

  title: "Café con latencia tardía QA",

  description:
    "Café aparece ocho veces y las ocho primeras respuestas marcadas ocurren 16 horas después. Arroz permanece normal.",

  bugFocus:
    "Comprueba que una señal marcada repetida pueda describirse por su latencia y no sólo por pertenecer a una ventana de 24 horas.",

  expectedText:
    "Café debe mostrar mediana de 16.0 h y perfil principalmente tardío.",

  expectedSignals: {
    coffee: "high",

    rice: "low",
  } satisfies Record<string, AssociationSignal>,

  input: {
    days: 90,

    totalFoodEntries: 16,

    exposures,

    bathrooms,

    medicines: [],
  },
};
