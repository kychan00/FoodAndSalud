import { supabase } from "../../lib/supabase/client";

import type {
  BathroomObservation,
  MedicineObservation,
} from "./association.types";

import { buildFoodDetailReport } from "./foodDetail.engine";

import type { FoodDetailExposureInput } from "./foodDetail.types";

const DETAIL_DAYS = 90;

export async function getFoodDetailReport(userId: string, foodId: string) {
  const end = new Date();

  const start = new Date(end);

  start.setDate(end.getDate() - DETAIL_DAYS);

  const startIso = start.toISOString();

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
      .select("id,taken_at")
      .eq("user_id", userId)
      .gte("taken_at", startIso)
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

  const medicines: MedicineObservation[] = (medicinesResult.data ?? []).map(
    (item) => ({
      id: item.id,

      occurredAt: item.taken_at,
    }),
  );

  if (allEntries.length === 0) {
    return buildFoodDetailReport({
      foodId: food.id,

      foodName: food.name,

      days: DETAIL_DAYS,

      exposures: [],

      bathrooms,
      medicines,
    });
  }

  const allEntryIds = allEntries.map((entry) => entry.id);

  const { data: selectedItems, error: selectedItemsError } = await supabase
    .from("food_entry_items")
    .select("food_entry_id,food_id")
    .eq("user_id", userId)
    .eq("food_id", foodId)
    .in("food_entry_id", allEntryIds);

  if (selectedItemsError) {
    throw selectedItemsError;
  }

  const selectedEntryIds = [
    ...new Set((selectedItems ?? []).map((item) => item.food_entry_id)),
  ];

  if (selectedEntryIds.length === 0) {
    return buildFoodDetailReport({
      foodId: food.id,

      foodName: food.name,

      days: DETAIL_DAYS,

      exposures: [],

      bathrooms,
      medicines,
    });
  }

  const selectedEntrySet = new Set(selectedEntryIds);

  const selectedEntries = allEntries.filter((entry) =>
    selectedEntrySet.has(entry.id),
  );

  const { data: allItems, error: allItemsError } = await supabase
    .from("food_entry_items")
    .select("food_entry_id,food_id")
    .eq("user_id", userId)
    .in("food_entry_id", selectedEntryIds);

  if (allItemsError) {
    throw allItemsError;
  }

  const foodIds = [...new Set((allItems ?? []).map((item) => item.food_id))];

  const { data: foods, error: foodsError } = await supabase
    .from("foods")
    .select("id,name")
    .eq("user_id", userId)
    .in("id", foodIds);

  if (foodsError) {
    throw foodsError;
  }

  const foodById = new Map((foods ?? []).map((item) => [item.id, item]));

  const itemsByEntry = new Map<string, string[]>();

  for (const item of allItems ?? []) {
    const current = itemsByEntry.get(item.food_entry_id) ?? [];

    current.push(item.food_id);

    itemsByEntry.set(item.food_entry_id, current);
  }

  const exposures: FoodDetailExposureInput[] = selectedEntries.map((entry) => {
    const itemIds = itemsByEntry.get(entry.id) ?? [];

    const coFoods = itemIds
      .filter((itemFoodId) => itemFoodId !== foodId)
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
  });
}
