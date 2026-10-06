import type { TimelineEvent } from "../timeline/timeline.types";

export function getEntryKindLabel(event: TimelineEvent) {
  switch (event.event_type) {
    case "food":
      return "comida";

    case "bathroom":
      return "registro Bristol";

    case "medicine":
      return "registro de Medicina";

    default:
      return "registro";
  }
}

export function getEntryEditorTitle(event: TimelineEvent, editing: boolean) {
  const prefix = editing ? "Editar" : "Registro";

  switch (event.event_type) {
    case "food":
      return `${prefix} comida`;

    case "bathroom":
      return `${prefix} Bristol`;

    case "medicine":
      return editing ? "Editar Medicina" : "Registro de Medicina";

    default:
      return prefix;
  }
}

export function getDeleteQuestion(event: TimelineEvent) {
  if (event.event_type === "food") {
    return "¿Eliminar esta comida?";
  }

  if (event.event_type === "bathroom") {
    return "¿Eliminar este registro Bristol?";
  }

  if (event.event_type === "medicine") {
    return "¿Eliminar este registro de Medicina?";
  }

  return "¿Eliminar este registro?";
}
