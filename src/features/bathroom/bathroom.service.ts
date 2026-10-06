import { supabase } from "../../lib/supabase/client";

interface CreateBathroomEntryInput {
  userId: string;
  occurredAt: string;
  bristolType: number;
  urgency: number;
  painLevel: number;
  notes?: string;
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
    throw error;
  }

  return data.id;
}
