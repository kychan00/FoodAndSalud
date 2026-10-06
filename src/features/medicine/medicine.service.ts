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

export interface EditableMedicineEntry {
  id: string;

  name: string;

  takenAt: string;

  dose: number | null;

  unit: string;

  reason: string;

  notes: string;
}

export interface UpdateMedicineEntryInput extends CreateMedicineEntryInput {
  entryId: string;
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

export async function getOrCreateMedicine(
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

export async function getMedicineEntryForEdit(
  userId: string,
  entryId: string,
): Promise<EditableMedicineEntry> {
  const { data: entry, error: entryError } = await supabase
    .from("medicine_entries")
    .select("id,medicine_id,taken_at,dose,unit,reason,notes")
    .eq("user_id", userId)
    .eq("id", entryId)
    .single();

  if (entryError || !entry) {
    throw entryError ?? new Error("No se encontró el registro de Medicina.");
  }

  const { data: medicine, error: medicineError } = await supabase
    .from("medicines")
    .select("name,default_unit")
    .eq("user_id", userId)
    .eq("id", entry.medicine_id)
    .single();

  if (medicineError || !medicine) {
    throw medicineError ?? new Error("No se encontró el medicamento.");
  }

  return {
    id: entry.id,

    name: medicine.name,

    takenAt: entry.taken_at,

    dose: entry.dose,

    unit: entry.unit ?? medicine.default_unit ?? "mg",

    reason: entry.reason ?? "",

    notes: entry.notes ?? "",
  };
}

export async function updateMedicineEntry({
  userId,
  entryId,
  name,
  takenAt,
  dose,
  unit,
  reason,
  notes,
}: UpdateMedicineEntryInput) {
  const medicineId = await getOrCreateMedicine(userId, name, unit);

  const { error } = await supabase
    .from("medicine_entries")
    .update({
      medicine_id: medicineId,

      taken_at: takenAt,

      dose: dose ?? null,

      unit: dose === undefined ? null : unit?.trim() || null,

      reason: reason?.trim() || null,

      notes: notes?.trim() || null,
    })
    .eq("user_id", userId)
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}

export async function deleteMedicineEntry(userId: string, entryId: string) {
  const { error } = await supabase
    .from("medicine_entries")
    .delete()
    .eq("user_id", userId)
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}
