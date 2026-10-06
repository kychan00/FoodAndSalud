import { supabase } from "../../lib/supabase/client";

interface CreateMedicineEntryInput {
  userId: string;
  name: string;
  takenAt: string;
  dose?: number;
  unit?: string;
  reason?: string;
  notes?: string;
}

function normalizeMedicineName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

async function findActiveMedicine(userId: string, name: string) {
  const { data, error } = await supabase
    .from("medicines")
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

async function getOrCreateMedicine(
  userId: string,
  rawName: string,
  unit?: string,
) {
  const name = normalizeMedicineName(rawName);

  const existing = await findActiveMedicine(userId, name);

  if (existing) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from("medicines")
    .insert({
      user_id: userId,
      name,
      default_unit: unit?.trim() || null,
    })
    .select("id")
    .single();

  if (!error && data) {
    return data.id;
  }

  if (error?.code === "23505") {
    const concurrent = await findActiveMedicine(userId, name);

    if (concurrent) {
      return concurrent.id;
    }
  }

  throw error ?? new Error("No se pudo crear el medicamento.");
}

export async function createMedicineEntry({
  userId,
  name,
  takenAt,
  dose,
  unit,
  reason,
  notes,
}: CreateMedicineEntryInput) {
  const medicineId = await getOrCreateMedicine(userId, name, unit);

  const { data, error } = await supabase
    .from("medicine_entries")
    .insert({
      user_id: userId,
      medicine_id: medicineId,
      taken_at: takenAt,
      dose: dose ?? null,
      unit: unit?.trim() || null,
      reason: reason?.trim() || null,
      notes: notes?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw error ?? new Error("No se pudo guardar el registro de Medicina.");
  }

  return data.id;
}
