import { supabase } from "../../lib/supabase/client";

import { buildAssociationReport } from "./association.engine";
import type {
  BathroomObservation,
  FoodExposure,
  MedicineObservation,
} from "./association.types";

const DEFAULT_DAYS = 90;

export async function getFoodAssociationReport(
  userId: string,
  days = DEFAULT_DAYS,
) {
  const end = new Date();

  const start = new Date(end);

  start.setDate(end.getDate() - days);

  const startIso = start.toISOString();

  const endIso = end.toISOString();

  const [foodEntriesResult, bathroomResult, medicineResult] = await Promise.all(
    [
      supabase
        .from("food_entries")
        .select("id,eaten_at")
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
    ],
  );

  if (foodEntriesResult.error) {
    throw foodEntriesResult.error;
  }

  if (bathroomResult.error) {
    throw bathroomResult.error;
  }

  if (medicineResult.error) {
    throw medicineResult.error;
  }

  const foodEntries = foodEntriesResult.data ?? [];

  const bathrooms: BathroomObservation[] = (bathroomResult.data ?? []).map(
    (entry) => ({
      id: entry.id,
      occurredAt: entry.occurred_at,
      bristolType: entry.bristol_type,
      urgency: entry.urgency,
      painLevel: entry.pain_level,
    }),
  );

  const medicines: MedicineObservation[] = (medicineResult.data ?? []).map(
    (entry) => ({
      id: entry.id,
      occurredAt: entry.taken_at,
    }),
  );

  if (foodEntries.length === 0) {
    return buildAssociationReport({
      days,
      totalFoodEntries: 0,
      exposures: [],
      bathrooms,
      medicines,
    });
  }

  const entryIds = foodEntries.map((entry) => entry.id);

  const { data: itemData, error: itemError } = await supabase
    .from("food_entry_items")
    .select("food_entry_id,food_id")
    .eq("user_id", userId)
    .in("food_entry_id", entryIds);

  if (itemError) {
    throw itemError;
  }

  const items = itemData ?? [];

  if (items.length === 0) {
    return buildAssociationReport({
      days,
      totalFoodEntries: foodEntries.length,
      exposures: [],
      bathrooms,
      medicines,
    });
  }

  const foodIds = [...new Set(items.map((item) => item.food_id))];

  const { data: foodData, error: foodError } = await supabase
    .from("foods")
    .select("id,name")
    .eq("user_id", userId)
    .in("id", foodIds);

  if (foodError) {
    throw foodError;
  }

  const entryById = new Map(foodEntries.map((entry) => [entry.id, entry]));

  const foodById = new Map((foodData ?? []).map((food) => [food.id, food]));

  const exposures: FoodExposure[] = [];

  for (const item of items) {
    const entry = entryById.get(item.food_entry_id);

    const food = foodById.get(item.food_id);

    if (!entry || !food) {
      continue;
    }

    exposures.push({
      entryId: entry.id,

      foodId: food.id,

      foodName: food.name,

      eatenAt: entry.eaten_at,
    });
  }

  return buildAssociationReport({
    days,
    totalFoodEntries: foodEntries.length,
    exposures,
    bathrooms,
    medicines,
  });
}
