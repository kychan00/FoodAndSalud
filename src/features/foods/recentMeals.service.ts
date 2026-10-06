import { supabase } from "../../lib/supabase/client";

import type { MealType } from "./food.service";

import {
  buildRecentMealTemplates,
  type RecentMealTemplate,
} from "./recentMeals";

export async function getRecentMealTemplates(
  userId: string,
): Promise<RecentMealTemplate[]> {
  const { data: entries, error: entryError } = await supabase
    .from("food_entries")
    .select("id,eaten_at,meal_type")
    .eq("user_id", userId)
    .order("eaten_at", {
      ascending: false,
    })
    .limit(30);

  if (entryError) {
    throw entryError;
  }

  if (!entries || entries.length === 0) {
    return [];
  }

  const entryIds = entries.map((entry) => entry.id);

  const { data: itemRows, error: itemError } = await supabase
    .from("food_entry_items")
    .select("food_entry_id,food_id,sort_order")
    .eq("user_id", userId)
    .in("food_entry_id", entryIds);

  if (itemError) {
    throw itemError;
  }

  const foodIds = [...new Set((itemRows ?? []).map((item) => item.food_id))];

  if (foodIds.length === 0) {
    return [];
  }

  const { data: foodRows, error: foodError } = await supabase
    .from("foods")
    .select("id,name")
    .eq("user_id", userId)
    .in("id", foodIds);

  if (foodError) {
    throw foodError;
  }

  return buildRecentMealTemplates({
    entries: entries.map((entry) => ({
      id: entry.id,

      eatenAt: entry.eaten_at,

      mealType: entry.meal_type as MealType,
    })),

    items: (itemRows ?? []).map((item) => ({
      foodEntryId: item.food_entry_id,

      foodId: item.food_id,

      sortOrder: item.sort_order,
    })),

    foods: foodRows ?? [],

    limit: 6,
  });
}
