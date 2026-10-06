import type {
  AssociationSignal,
  BathroomObservation,
  FoodExposure,
} from "../association.types";

import type { PatternQaScenario } from "./association.fixtures";

function iso(day: number, hour = 8) {
  return `2026-09-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0",
  )}:00:00Z`;
}

function createScenario(
  id: string,
  title: string,
  description: string,
  bugFocus: string,
  expectedText: string,
  targetAdverse: (day: number) => boolean,
): PatternQaScenario {
  const exposures: FoodExposure[] = [];

  const bathrooms: BathroomObservation[] = [];

  for (let day = 1; day <= 16; day += 1) {
    const targetDay = day % 2 === 1;

    const foodId = targetDay ? "coffee" : "rice";

    const foodName = targetDay ? "Café" : "Arroz";

    exposures.push({
      entryId: `${foodId}-${day}`,

      foodId,

      foodName,

      eatenAt: iso(day, 8),
    });

    const adverse = targetDay ? targetAdverse(day) : false;

    bathrooms.push({
      id: `bath-${day}`,

      occurredAt: iso(day, 12),

      bristolType: adverse ? 7 : 4,

      urgency: adverse ? 2 : 0,

      painLevel: 0,
    });
  }

  const totalTargetAdverse = [1, 3, 5, 7, 9, 11, 13, 15].filter(
    targetAdverse,
  ).length;

  const coffeeSignal: AssociationSignal =
    totalTargetAdverse === 8 ? "high" : "low";

  return {
    id,

    title,

    description,

    bugFocus,

    expectedText,

    expectedSignals: {
      coffee: coffeeSignal,

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

export const temporalPersistentScenario = createScenario(
  "temporal-persistent",

  "Café persistente",

  "Café y Arroz se alternan durante todo el periodo. Café tiene respuestas marcadas tanto en la mitad anterior como en la mitad reciente; Arroz permanece normal.",

  "Comprueba que un contraste repetido en ambas mitades se clasifique como persistente.",

  "Café debe mostrar +100 pp tanto en el periodo anterior como en el reciente.",

  () => true,
);

export const temporalRecentScenario = createScenario(
  "temporal-recent",

  "Café con patrón reciente",

  "En la primera mitad Café se comporta como el control. En la segunda mitad las exposiciones de Café presentan respuestas marcadas.",

  "Comprueba que un contraste que aparece solamente en la segunda mitad se clasifique como más reciente.",

  "Café debe pasar de 0 pp en la mitad anterior a +100 pp en la mitad reciente.",

  (day) => day >= 9,
);

export const temporalWeakenedScenario = createScenario(
  "temporal-weakened",

  "Café con patrón debilitado",

  "En la primera mitad Café presenta respuestas marcadas. En la segunda mitad Café se comporta igual que el control.",

  "Comprueba que un contraste presente al inicio y ausente después se clasifique como debilitado.",

  "Café debe pasar de +100 pp en la mitad anterior a 0 pp en la mitad reciente.",

  (day) => day <= 8,
);
