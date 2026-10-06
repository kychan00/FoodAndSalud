import type { MealType } from "./food.service";

export interface RecentMealEntry {
  id: string;

  eatenAt: string;

  mealType: MealType;
}

export interface RecentMealItem {
  foodEntryId: string;

  foodId: string;

  sortOrder: number | null;
}

export interface RecentMealFood {
  id: string;

  name: string;
}

export interface RecentMealTemplate {
  sourceEntryId: string;

  eatenAt: string;

  mealType: MealType;

  foodNames: string[];
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function getSignature(mealType: MealType, names: string[]) {
  /*
   * Para detectar la misma combinación:
   *
   * - ignoramos mayúsculas;
   * - ignoramos espacios extra;
   * - ignoramos el orden en que fueron capturados.
   *
   * Pero la plantilla conserva el orden de la comida
   * más reciente que representa esa combinación.
   */
  const normalized = names
    .map((name) => normalizeName(name).toLocaleLowerCase("es-MX"))
    .sort();

  return `${mealType}|${normalized.join("|")}`;
}

export function buildRecentMealTemplates({
  entries,
  items,
  foods,
  limit = 6,
}: {
  entries: RecentMealEntry[];

  items: RecentMealItem[];

  foods: RecentMealFood[];

  limit?: number;
}): RecentMealTemplate[] {
  const foodNameById = new Map(
    foods.map((food) => [food.id, normalizeName(food.name)]),
  );

  const itemsByEntry = new Map<string, RecentMealItem[]>();

  for (const item of items) {
    const current = itemsByEntry.get(item.foodEntryId) ?? [];

    current.push(item);

    itemsByEntry.set(item.foodEntryId, current);
  }

  const sortedEntries = [...entries].sort(
    (left, right) =>
      new Date(right.eatenAt).getTime() - new Date(left.eatenAt).getTime(),
  );

  const result: RecentMealTemplate[] = [];

  const seen = new Set<string>();

  for (const entry of sortedEntries) {
    if (result.length >= limit) {
      break;
    }

    const entryItems = [...(itemsByEntry.get(entry.id) ?? [])].sort(
      (left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0),
    );

    const names = entryItems
      .map((item) => foodNameById.get(item.foodId))
      .filter((name): name is string => Boolean(name));

    if (names.length === 0) {
      continue;
    }

    const signature = getSignature(entry.mealType, names);

    if (seen.has(signature)) {
      continue;
    }

    seen.add(signature);

    result.push({
      sourceEntryId: entry.id,

      eatenAt: entry.eatenAt,

      mealType: entry.mealType,

      foodNames: names,
    });
  }

  return result;
}
