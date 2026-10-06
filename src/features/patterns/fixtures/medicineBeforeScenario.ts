import type {
  AssociationSignal,
  BathroomObservation,
  FoodExposure,
  MedicineObservation,
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

const medicines: MedicineObservation[] = [];

let coffeeIndex = 0;

for (let day = 1; day <= 20; day += 1) {
  const coffeeDay = day % 2 === 1;

  if (coffeeDay) {
    coffeeIndex += 1;

    const withMedicineBefore = coffeeIndex <= 6;

    exposures.push({
      entryId: `coffee-before-${day}`,

      foodId: "coffee",

      foodName: "Café",

      eatenAt: iso(day, 12),
    });

    if (withMedicineBefore) {
      medicines.push({
        id: `omeprazole-before-${day}`,

        medicineId: "omeprazole-before-qa",

        medicineName: "Omeprazol",

        occurredAt: iso(day, 10),

        dose: 20,

        unit: "mg",
      });
    }

    bathrooms.push({
      id: `bath-before-${day}`,

      occurredAt: iso(day, 16),

      bristolType: withMedicineBefore ? 7 : 4,

      urgency: withMedicineBefore ? 2 : 0,

      painLevel: withMedicineBefore ? 1 : 0,
    });

    continue;
  }

  exposures.push({
    entryId: `rice-before-${day}`,

    foodId: "rice",

    foodName: "Arroz",

    eatenAt: iso(day, 12),
  });

  bathrooms.push({
    id: `bath-before-${day}`,

    occurredAt: iso(day, 16),

    bristolType: 4,

    urgency: 0,

    painLevel: 0,
  });
}

export const medicineBeforeScenario: PatternQaScenario = {
  id: "medicine-before-discrimination",

  title: "Café con Omeprazol antes",

  description:
    "Café aparece diez veces. En seis exposiciones Omeprazol 20 mg se registra dos horas antes de la comida y las seis tienen respuesta marcada. Las cuatro exposiciones de Café sin Omeprazol son normales.",

  bugFocus:
    "Comprueba que una toma anterior a la comida ya no desaparezca del análisis temporal.",

  expectedText:
    "Omeprazol antes debe mostrar 6 exposiciones, 100% de respuestas marcadas y +100 pp frente a Café sin Omeprazol.",

  expectedSignals: {
    coffee: "medium",

    rice: "low",
  } satisfies Record<string, AssociationSignal>,

  input: {
    days: 90,

    totalFoodEntries: 20,

    exposures,

    bathrooms,

    medicines,
  },
};
