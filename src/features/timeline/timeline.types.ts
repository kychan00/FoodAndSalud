import type { Database } from "../../lib/supabase/database.types";

export type TimelineEventBase =
  Database["public"]["Views"]["timeline_events"]["Row"];

export type TimelineEvent = TimelineEventBase & {
  /*
   * Sólo se utiliza en eventos de comida.
   *
   * Se resuelve en el cliente a partir de:
   *
   * food_entry_items
   * +
   * foods
   *
   * para no cambiar todavía la vista SQL estable.
   */
  food_names: string[];
};
