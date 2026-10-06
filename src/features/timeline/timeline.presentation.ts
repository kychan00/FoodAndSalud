import type { TimelineEvent } from "./timeline.types";

const mealLabels: Record<string, string> = {
  breakfast: "Desayuno",

  lunch: "Comida",

  dinner: "Cena",

  snack: "Colación",

  other: "Comida",
};

export function getTimelineEventTitle(event: TimelineEvent) {
  if (event.event_type === "food") {
    return mealLabels[event.event_subtype ?? ""] ?? "Alimento";
  }

  if (event.event_type === "bathroom") {
    const type = event.event_subtype?.replace("bristol_", "");

    return type ? `Baño · Bristol ${type}` : "Baño";
  }

  if (event.event_type === "medicine") {
    return event.event_subtype
      ? `Medicina · ${event.event_subtype}`
      : "Medicina";
  }

  return "Registro";
}

export function getTimelineEventDetail(event: TimelineEvent) {
  if (event.event_type === "food" && event.food_names.length > 0) {
    return event.food_names.join(" · ");
  }

  return null;
}

export function getTimelineEventClass(event: TimelineEvent) {
  if (event.event_type === "food") {
    return "food";
  }

  if (event.event_type === "bathroom") {
    return "bathroom";
  }

  return "medicine";
}
