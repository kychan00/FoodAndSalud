import { supabase } from "../../lib/supabase/client";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "other";

interface CreateFoodEntryInput {
  userId: string;

  eatenAt: string;

  mealType: MealType;

  notes?: string;

  foodNames: string[];
}

export interface EditableFoodEntry {
  id: string;

  eatenAt: string;

  mealType: MealType;

  notes: string;

  foodNames: string[];
}

export interface UpdateFoodEntryInput extends CreateFoodEntryInput {
  entryId: string;
}

export function normalizeUniqueFoodNames(values: string[]) {
  const result: string[] = [];

  const seen = new Set<string>();

  for (const raw of values) {
    const name = normalizeFoodName(raw);

    if (!name) {
      continue;
    }

    const key = name.toLocaleLowerCase("es-MX");

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    result.push(name);
  }

  return result;
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

  throw error ?? new Error("No se pudo crear el alimento.");
}

async function resolveFoodIds(userId: string, foodNames: string[]) {
  const names = normalizeUniqueFoodNames(foodNames);

  if (names.length === 0) {
    throw new Error("La comida necesita al menos un alimento.");
  }

  const result: string[] = [];

  const seen = new Set<string>();

  for (const name of names) {
    const id = await getOrCreateFood(userId, name);

    if (seen.has(id)) {
      continue;
    }

    seen.add(id);

    result.push(id);
  }

  return result;
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
    throw entryError ?? new Error("No se pudo crear la comida.");
  }

  try {
    const foodIds = await resolveFoodIds(userId, foodNames);

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
    await supabase
      .from("food_entries")
      .delete()
      .eq("id", entry.id)
      .eq("user_id", userId);

    throw error;
  }
}

export async function getFoodEntryForEdit(
  userId: string,
  entryId: string,
): Promise<EditableFoodEntry> {
  const { data: entry, error: entryError } = await supabase
    .from("food_entries")
    .select("id,eaten_at,meal_type,notes")
    .eq("user_id", userId)
    .eq("id", entryId)
    .single();

  if (entryError || !entry) {
    throw entryError ?? new Error("No se encontró la comida.");
  }

  const { data: items, error: itemError } = await supabase
    .from("food_entry_items")
    .select("food_id,sort_order")
    .eq("user_id", userId)
    .eq("food_entry_id", entryId)
    .order("sort_order", {
      ascending: true,
    });

  if (itemError) {
    throw itemError;
  }

  const foodIds = (items ?? []).map((item) => item.food_id);

  const namesById = new Map<string, string>();

  if (foodIds.length > 0) {
    const { data: foods, error: foodError } = await supabase
      .from("foods")
      .select("id,name")
      .eq("user_id", userId)
      .in("id", foodIds);

    if (foodError) {
      throw foodError;
    }

    for (const food of foods ?? []) {
      namesById.set(food.id, food.name);
    }
  }

  return {
    id: entry.id,

    eatenAt: entry.eaten_at,

    mealType: entry.meal_type as MealType,

    notes: entry.notes ?? "",

    foodNames: foodIds
      .map((id) => namesById.get(id))
      .filter((name): name is string => Boolean(name)),
  };
}

export async function updateFoodEntry({
  userId,
  entryId,
  eatenAt,
  mealType,
  notes,
  foodNames,
}: UpdateFoodEntryInput) {
  /*
   * No existe una transacción cliente → Supabase.
   *
   * Reducimos riesgo:
   *
   * 1. resolvemos todos los food IDs primero;
   * 2. guardamos snapshot de items actuales;
   * 3. reemplazamos items;
   * 4. sólo al final actualizamos metadata de food_entries;
   * 5. ante error intentamos restaurar los items previos.
   */

  const foodIds = await resolveFoodIds(userId, foodNames);

  const { data: oldItems, error: snapshotError } = await supabase
    .from("food_entry_items")
    .select("food_id,quantity,unit,sort_order,notes")
    .eq("user_id", userId)
    .eq("food_entry_id", entryId)
    .order("sort_order", {
      ascending: true,
    });

  if (snapshotError) {
    throw snapshotError;
  }

  const restoreOldItems = async () => {
    await supabase
      .from("food_entry_items")
      .delete()
      .eq("user_id", userId)
      .eq("food_entry_id", entryId);

    if ((oldItems ?? []).length > 0) {
      await supabase.from("food_entry_items").insert(
        (oldItems ?? []).map((item) => ({
          user_id: userId,

          food_entry_id: entryId,

          food_id: item.food_id,

          quantity: item.quantity,

          unit: item.unit,

          sort_order: item.sort_order,

          notes: item.notes,
        })),
      );
    }
  };

  const { error: deleteItemsError } = await supabase
    .from("food_entry_items")
    .delete()
    .eq("user_id", userId)
    .eq("food_entry_id", entryId);

  if (deleteItemsError) {
    throw deleteItemsError;
  }

  const { error: insertItemsError } = await supabase
    .from("food_entry_items")
    .insert(
      foodIds.map((foodId, index) => ({
        user_id: userId,

        food_entry_id: entryId,

        food_id: foodId,

        sort_order: index,
      })),
    );

  if (insertItemsError) {
    await restoreOldItems();

    throw insertItemsError;
  }

  const { error: updateError } = await supabase
    .from("food_entries")
    .update({
      eaten_at: eatenAt,

      meal_type: mealType,

      notes: notes?.trim() || null,
    })
    .eq("user_id", userId)
    .eq("id", entryId);

  if (updateError) {
    await restoreOldItems();

    throw updateError;
  }
}

export async function deleteFoodEntry(userId: string, entryId: string) {
  const { error } = await supabase
    .from("food_entries")
    .delete()
    .eq("user_id", userId)
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}
