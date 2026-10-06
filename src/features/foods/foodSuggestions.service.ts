import { supabase } from "../../lib/supabase/client";

import { rankDailySuggestions } from "../entries/dailySuggestions";

export interface FoodSuggestion {
  id: string;

  name: string;

  isFavorite: boolean;
}

export async function getFoodSuggestions(
  userId: string,
): Promise<FoodSuggestion[]> {
  /*
   * Las últimas comidas se consultan por eaten_at,
   * no por created_at.
   *
   * Así un backfill histórico no se vuelve
   * artificialmente "lo más reciente".
   */
  const [entryResult, catalogResult] = await Promise.all([
    supabase
      .from("food_entries")
      .select("id,eaten_at")
      .eq("user_id", userId)
      .order("eaten_at", {
        ascending: false,
      })
      .limit(40),

    supabase
      .from("foods")
      .select("id,name,is_favorite,updated_at")
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("is_favorite", {
        ascending: false,
      })
      .order("updated_at", {
        ascending: false,
      })
      .limit(100),
  ]);

  if (entryResult.error) {
    throw entryResult.error;
  }

  if (catalogResult.error) {
    throw catalogResult.error;
  }

  const entries = entryResult.data ?? [];

  const catalog = (catalogResult.data ?? []).map((food) => ({
    id: food.id,

    name: food.name,

    isFavorite: food.is_favorite,
  }));

  if (entries.length === 0) {
    return rankDailySuggestions([], catalog, 12);
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

  const byEntry = new Map<
    string,
    Array<{
      foodId: string;

      sortOrder: number;
    }>
  >();

  for (const item of itemRows ?? []) {
    const current = byEntry.get(item.food_entry_id) ?? [];

    current.push({
      foodId: item.food_id,

      sortOrder: item.sort_order,
    });

    byEntry.set(item.food_entry_id, current);
  }

  const recentIds: string[] = [];

  for (const entry of entries) {
    const items = [...(byEntry.get(entry.id) ?? [])].sort(
      (left, right) => left.sortOrder - right.sortOrder,
    );

    for (const item of items) {
      recentIds.push(item.foodId);
    }
  }

  return rankDailySuggestions(recentIds, catalog, 12);
}
