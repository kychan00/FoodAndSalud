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

    const withMedicine = coffeeIndex <= 6;

    exposures.push({
      entryId: `coffee-${day}`,

      foodId: "coffee",

      foodName: "Café",

      eatenAt: iso(day, 8),
    });

    if (withMedicine) {
      medicines.push({
        id: `medicine-${day}`,

        medicineId: "omeprazole",

        medicineName: "Omeprazol",

        occurredAt: iso(day, 9),

        dose: 20,

        unit: "mg",
      });
    }

    bathrooms.push({
      id: `bath-${day}`,

      occurredAt: iso(day, 12),

      bristolType: withMedicine ? 7 : 4,

      urgency: withMedicine ? 2 : 0,

      painLevel: withMedicine ? 1 : 0,
    });

    continue;
  }

  exposures.push({
    entryId: `rice-${day}`,

    foodId: "rice",

    foodName: "Arroz",

    eatenAt: iso(day, 8),
  });

  bathrooms.push({
    id: `bath-${day}`,

    occurredAt: iso(day, 12),

    bristolType: 4,

    urgency: 0,

    painLevel: 0,
  });
}

export const concurrentMedicineScenario: PatternQaScenario = {
  id: "medicine-discrimination",

  title: "Café con Medicina discriminable",

  description:
    "Café aparece diez veces. En seis exposiciones también se registra Omeprazol 20 mg y las seis tienen respuesta marcada. En cuatro exposiciones sin Omeprazol la respuesta es normal. Arroz funciona como comparación externa normal.",

  bugFocus:
    "Comprueba que el sistema pueda identificar qué medicamento concreto aparece junto al patrón.",

  expectedText:
    "Café con Omeprazol debe mostrar 100% de respuestas marcadas y Café sin Omeprazol 0%, con diferencia de +100 pp.",

  expectedSignals: {
    coffee: "medium",

    rice: "low",
  } satisfies Record<string, AssociationSignal>,

  expectedMedicineOverlap: {
    coffee: 6,
  },

  input: {
    days: 90,

    totalFoodEntries: 20,

    exposures,

    bathrooms,

    medicines,
  },
};
