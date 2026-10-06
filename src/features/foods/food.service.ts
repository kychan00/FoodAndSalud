import { supabase } from "../../lib/supabase/client";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "other";

interface CreateFoodEntryInput {
  userId: string;
  eatenAt: string;
  mealType: MealType;
  notes?: string;
  foodNames: string[];
}

function normalizeFoodName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

async function findActiveFood(userId: string, name: string) {
  const { data, error } = await supabase
    .from("foods")
    .select("id")
    .eq("user_id", userId)
    .is("archived_at", null)
    .ilike("name", name)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getOrCreateFood(userId: string, rawName: string) {
  const name = normalizeFoodName(rawName);

  const existing = await findActiveFood(userId, name);

  if (existing) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from("foods")
    .insert({
      user_id: userId,
      name,
    })
    .select("id")
    .single();

  if (!error && data) {
    return data.id;
  }

  if (error?.code === "23505") {
    const concurrent = await findActiveFood(userId, name);

    if (concurrent) {
      return concurrent.id;
    }
  }

  throw error;
}

export async function createFoodEntry({
  userId,
  eatenAt,
  mealType,
  notes,
  foodNames,
}: CreateFoodEntryInput) {
  const { data: entry, error: entryError } = await supabase
    .from("food_entries")
    .insert({
      user_id: userId,
      eaten_at: eatenAt,
      meal_type: mealType,
      notes: notes?.trim() || null,
    })
    .select("id")
    .single();

  if (entryError || !entry) {
    throw entryError;
  }

  try {
    const foodIds: string[] = [];

    for (const foodName of foodNames) {
      const foodId = await getOrCreateFood(userId, foodName);

      foodIds.push(foodId);
    }

    const { error: itemsError } = await supabase
      .from("food_entry_items")
      .insert(
        foodIds.map((foodId, index) => ({
          user_id: userId,
          food_entry_id: entry.id,
          food_id: foodId,
          sort_order: index,
        })),
      );

    if (itemsError) {
      throw itemsError;
    }

    return entry.id;
  } catch (error) {
    await supabase.from("food_entries").delete().eq("id", entry.id);

    throw error;
  }
}
