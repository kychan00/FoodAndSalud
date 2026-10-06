import { supabase } from "../../lib/supabase/client";

interface CreateBathroomEntryInput {
  userId: string;

  occurredAt: string;

  bristolType: number;

  urgency: number;

  painLevel: number;

  notes?: string;
}

export interface EditableBathroomEntry {
  id: string;

  occurredAt: string;

  bristolType: number;

  urgency: number;

  painLevel: number;

  notes: string;
}

export interface UpdateBathroomEntryInput extends CreateBathroomEntryInput {
  entryId: string;
}

export async function createBathroomEntry({
  userId,
  occurredAt,
  bristolType,
  urgency,
  painLevel,
  notes,
}: CreateBathroomEntryInput) {
  const { data, error } = await supabase
    .from("bathroom_entries")
    .insert({
      user_id: userId,

      occurred_at: occurredAt,

      bristol_type: bristolType,

      urgency,

      pain_level: painLevel,

      notes: notes?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw error ?? new Error("No se pudo guardar Bristol.");
  }

  return data.id;
}

export async function getBathroomEntryForEdit(
  userId: string,
  entryId: string,
): Promise<EditableBathroomEntry> {
  const { data, error } = await supabase
    .from("bathroom_entries")
    .select("id,occurred_at,bristol_type,urgency,pain_level,notes")
    .eq("user_id", userId)
    .eq("id", entryId)
    .single();

  if (error || !data) {
    throw error ?? new Error("No se encontró el registro Bristol.");
  }

  return {
    id: data.id,

    occurredAt: data.occurred_at,

    bristolType: data.bristol_type,

    urgency: data.urgency ?? 0,

    painLevel: data.pain_level ?? 0,

    notes: data.notes ?? "",
  };
}

export async function updateBathroomEntry({
  userId,
  entryId,
  occurredAt,
  bristolType,
  urgency,
  painLevel,
  notes,
}: UpdateBathroomEntryInput) {
  const { error } = await supabase
    .from("bathroom_entries")
    .update({
      occurred_at: occurredAt,

      bristol_type: bristolType,

      urgency,

      pain_level: painLevel,

      notes: notes?.trim() || null,
    })
    .eq("user_id", userId)
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}

export async function deleteBathroomEntry(userId: string, entryId: string) {
  const { error } = await supabase
    .from("bathroom_entries")
    .delete()
    .eq("user_id", userId)
    .eq("id", entryId);

  if (error) {
    throw error;
  }
}
