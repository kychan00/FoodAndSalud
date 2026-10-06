import { supabase } from "../../lib/supabase/client";

import type {
  BathroomObservation,
  FoodExposure,
  MedicineObservation,
} from "./association.types";

import { buildFoodDetailReport } from "./foodDetail.engine";

import { MEDICINE_PRE_WINDOW_HOURS } from "./medicineTiming.constants";

import type { FoodDetailExposureInput } from "./foodDetail.types";

const DETAIL_DAYS = 90;

export async function getFoodDetailReport(userId: string, foodId: string) {
  const end = new Date();

  const start = new Date(end);

  start.setDate(end.getDate() - DETAIL_DAYS);

  const startIso = start.toISOString();

  const medicineStart = new Date(
    start.getTime() - MEDICINE_PRE_WINDOW_HOURS * 3_600_000,
  );

  const medicineStartIso = medicineStart.toISOString();

  const endIso = end.toISOString();

  const { data: food, error: foodError } = await supabase
    .from("foods")
    .select("id,name")
    .eq("user_id", userId)
    .eq("id", foodId)
    .maybeSingle();

  if (foodError) {
    throw foodError;
  }

  if (!food) {
    throw new Error("Alimento no encontrado.");
  }

  const [entriesResult, bathroomsResult, medicinesResult] = await Promise.all([
    supabase
      .from("food_entries")
      .select("id,eaten_at,meal_type")
      .eq("user_id", userId)
      .gte("eaten_at", startIso)
      .lte("eaten_at", endIso)
      .order("eaten_at", {
        ascending: true,
      }),

    supabase
      .from("bathroom_entries")
      .select("id,occurred_at,bristol_type,urgency,pain_level")
      .eq("user_id", userId)
      .gte("occurred_at", startIso)
      .lte("occurred_at", endIso)
      .order("occurred_at", {
        ascending: true,
      }),

    supabase
      .from("medicine_entries")
      .select("id,taken_at,medicine_id,dose,unit")
      .eq("user_id", userId)
      .gte("taken_at", medicineStartIso)
      .lte("taken_at", endIso)
      .order("taken_at", {
        ascending: true,
      }),
  ]);

  if (entriesResult.error) {
    throw entriesResult.error;
  }

  if (bathroomsResult.error) {
    throw bathroomsResult.error;
  }

  if (medicinesResult.error) {
    throw medicinesResult.error;
  }

  const allEntries = entriesResult.data ?? [];

  const bathrooms: BathroomObservation[] = (bathroomsResult.data ?? []).map(
    (item) => ({
      id: item.id,

      occurredAt: item.occurred_at,

      bristolType: item.bristol_type,

      urgency: item.urgency,

      painLevel: item.pain_level,
    }),
  );

  const medicineEntries = medicinesResult.data ?? [];

  const medicineIds = [
    ...new Set(medicineEntries.map((item) => item.medicine_id)),
  ];

  const medicineNameById = new Map<string, string>();

  if (medicineIds.length > 0) {
    const { data: medicineCatalog, error: medicineCatalogError } =
      await supabase
        .from("medicines")
        .select("id,name")
        .eq("user_id", userId)
        .in("id", medicineIds);

    if (medicineCatalogError) {
      throw medicineCatalogError;
    }

    for (const item of medicineCatalog ?? []) {
      medicineNameById.set(item.id, item.name);
    }
  }

  const medicines: MedicineObservation[] = medicineEntries.map((item) => ({
    id: item.id,

    occurredAt: item.taken_at,

    medicineId: item.medicine_id,

    medicineName: medicineNameById.get(item.medicine_id),

    dose: item.dose === null ? null : Number(item.dose),

    unit: item.unit,
  }));

  if (allEntries.length === 0) {
    return buildFoodDetailReport({
      foodId: food.id,

      foodName: food.name,

      days: DETAIL_DAYS,

      exposures: [],

      bathrooms,

      medicines,

      comparisonExposures: [],
    });
  }

  const allEntryIds = allEntries.map((entry) => entry.id);

  const { data: allItems, error: allItemsError } = await supabase
    .from("food_entry_items")
    .select("food_entry_id,food_id")
    .eq("user_id", userId)
    .in("food_entry_id", allEntryIds);

  if (allItemsError) {
    throw allItemsError;
  }

  const items = allItems ?? [];

  if (items.length === 0) {
    return buildFoodDetailReport({
      foodId: food.id,

      foodName: food.name,

      days: DETAIL_DAYS,

      exposures: [],

      bathrooms,

      medicines,

      comparisonExposures: [],
    });
  }

  const foodIds = [...new Set(items.map((item) => item.food_id))];

  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id,name")
    .eq("user_id", userId)
    .in("id", foodIds);

  if (foodsError) {
    throw foodsError;
  }

  const entryById = new Map(allEntries.map((entry) => [entry.id, entry]));

  const foodById = new Map((foods ?? []).map((item) => [item.id, item]));

  const itemsByEntry = new Map<string, string[]>();

  for (const item of items) {
    const current = itemsByEntry.get(item.food_entry_id) ?? [];

    current.push(item.food_id);

    itemsByEntry.set(item.food_entry_id, current);
  }

  const comparisonExposures: FoodExposure[] = [];

  for (const item of items) {
    const entry = entryById.get(item.food_entry_id);

    const itemFood = foodById.get(item.food_id);

    if (!entry || !itemFood) {
      continue;
    }

    comparisonExposures.push({
      entryId: entry.id,

      foodId: itemFood.id,

      foodName: itemFood.name,

      eatenAt: entry.eaten_at,
    });
  }

  const selectedEntryIds = new Set(
    comparisonExposures
      .filter((exposure) => exposure.foodId === foodId)
      .map((exposure) => exposure.entryId),
  );

  const selectedEntries = allEntries.filter((entry) =>
    selectedEntryIds.has(entry.id),
  );

  const exposures: FoodDetailExposureInput[] = selectedEntries.map((entry) => {
    const itemIds = itemsByEntry.get(entry.id) ?? [];

    const seen = new Set<string>();

    const coFoods = itemIds
      .filter((itemFoodId) => itemFoodId !== foodId)
      .filter((itemFoodId) => {
        if (seen.has(itemFoodId)) {
          return false;
        }

        seen.add(itemFoodId);

        return true;
      })
      .map((itemFoodId) => {
        const item = foodById.get(itemFoodId);

        return item
          ? {
              foodId: item.id,

              foodName: item.name,
            }
          : null;
      })
      .filter(
        (
          item,
        ): item is {
          foodId: string;

          foodName: string;
        } => item !== null,
      );

    return {
      entryId: entry.id,

      eatenAt: entry.eaten_at,

      mealType: entry.meal_type,

      coFoods,
    };
  });

  return buildFoodDetailReport({
    foodId: food.id,

    foodName: food.name,

    days: DETAIL_DAYS,

    exposures,

    bathrooms,

    medicines,

    comparisonExposures,
  });
}
