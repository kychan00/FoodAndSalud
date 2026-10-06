import { supabase } from "../../lib/supabase/client";

import { rankDailySuggestions } from "../entries/dailySuggestions";

export interface MedicineSuggestion {
  id: string;

  name: string;

  isFavorite: boolean;

  defaultUnit: string | null;

  lastDose: number | null;

  lastUnit: string | null;
}

interface MedicineCatalogSuggestion {
  id: string;

  name: string;

  isFavorite: boolean;

  defaultUnit: string | null;
}

export async function getMedicineSuggestions(
  userId: string,
): Promise<MedicineSuggestion[]> {
  const [historyResult, catalogResult] = await Promise.all([
    supabase
      .from("medicine_entries")
      .select("medicine_id,dose,unit,taken_at")
      .eq("user_id", userId)
      .order("taken_at", {
        ascending: false,
      })
      .limit(60),

    supabase
      .from("medicines")
      .select("id,name,is_favorite,default_unit,updated_at")
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

  if (historyResult.error) {
    throw historyResult.error;
  }

  if (catalogResult.error) {
    throw catalogResult.error;
  }

  const recentIds: string[] = [];

  const latestByMedicine = new Map<
    string,
    {
      dose: number | null;

      unit: string | null;
    }
  >();

  for (const row of historyResult.data ?? []) {
    recentIds.push(row.medicine_id);

    if (latestByMedicine.has(row.medicine_id)) {
      continue;
    }

    latestByMedicine.set(row.medicine_id, {
      dose: row.dose,

      unit: row.unit,
    });
  }

  const catalog: MedicineCatalogSuggestion[] = (catalogResult.data ?? []).map(
    (medicine) => ({
      id: medicine.id,

      name: medicine.name,

      isFavorite: medicine.is_favorite,

      defaultUnit: medicine.default_unit,
    }),
  );

  const ranked = rankDailySuggestions(recentIds, catalog, 12);

  return ranked.map((medicine) => {
    const latest = latestByMedicine.get(medicine.id);

    return {
      ...medicine,

      lastDose: latest?.dose ?? null,

      lastUnit: latest?.unit ?? null,
    };
  });
}
