import { describe, expect, it } from "vitest";

import {
  getDeleteQuestion,
  getEntryEditorTitle,
  getEntryKindLabel,
} from "./entryEditor.presentation";

import type { TimelineEvent } from "../timeline/timeline.types";

function event(type: "food" | "bathroom" | "medicine"): TimelineEvent {
  return {
    id: "entry-1",

    user_id: "user-1",

    occurred_at: "2026-10-06T12:00:00Z",

    event_type: type,

    event_subtype: null,

    notes: null,

    created_at: "2026-10-06T12:00:00Z",

    updated_at: "2026-10-06T12:00:00Z",

    food_names: [],
  };
}

describe("entry editor presentation", () => {
  it("labels food editing", () => {
    const item = event("food");

    expect(getEntryEditorTitle(item, true)).toBe("Editar comida");

    expect(getDeleteQuestion(item)).toBe("¿Eliminar esta comida?");
  });

  it("labels Bristol", () => {
    const item = event("bathroom");

    expect(getEntryKindLabel(item)).toBe("registro Bristol");

    expect(getEntryEditorTitle(item, true)).toBe("Editar Bristol");
  });

  it("labels Medicine", () => {
    const item = event("medicine");

    expect(getEntryKindLabel(item)).toBe("registro de Medicina");

    expect(getEntryEditorTitle(item, true)).toBe("Editar Medicina");
  });
});
