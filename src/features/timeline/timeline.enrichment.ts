import type { TimelineEvent, TimelineEventBase } from "./timeline.types";

export interface TimelineFoodItem {
  food_entry_id: string;

  food_id: string;

  sort_order: number | null;
}

export interface TimelineFood {
  id: string;

  name: string;
}

export function enrichTimelineFoodNames(
  events: TimelineEventBase[],
  items: TimelineFoodItem[],
  foods: TimelineFood[],
): TimelineEvent[] {
  const foodNameById = new Map(foods.map((food) => [food.id, food.name]));

  const namesByEntry = new Map<string, string[]>();

  const sortedItems = [...items].sort(
    (left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0),
  );

  for (const item of sortedItems) {
    const name = foodNameById.get(item.food_id);

    if (!name) {
      continue;
    }

    const current = namesByEntry.get(item.food_entry_id) ?? [];

    current.push(name);

    namesByEntry.set(item.food_entry_id, current);
  }

  return events.map((event) => {
    if (event.event_type !== "food" || !event.id) {
      return {
        ...event,

        food_names: [],
      };
    }

    return {
      ...event,

      food_names: namesByEntry.get(event.id) ?? [],
    };
  });
}
