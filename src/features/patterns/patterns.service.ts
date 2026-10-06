import { getTimelineForRange } from "../timeline/timeline.service";

export interface PatternSummary {
  totalEvents: number;
  foodEntries: number;
  bathroomEntries: number;
  medicineEntries: number;
  averageBristol: number | null;
  bristolHighCount: number;
}

export async function getPatternSummary(
  userId: string,
): Promise<PatternSummary> {
  const end = new Date();

  const start = new Date(end);

  start.setDate(end.getDate() - 30);

  const events = await getTimelineForRange(userId, start, end);

  const foodEntries = events.filter((event) => event.event_type === "food");

  const bathroomEntries = events.filter(
    (event) => event.event_type === "bathroom",
  );

  const medicineEntries = events.filter(
    (event) => event.event_type === "medicine",
  );

  const bristolValues = bathroomEntries
    .map((event) => Number(event.event_subtype?.replace("bristol_", "")))
    .filter((value) => Number.isFinite(value));

  const averageBristol =
    bristolValues.length > 0
      ? bristolValues.reduce((total, value) => total + value, 0) /
        bristolValues.length
      : null;

  const bristolHighCount = bristolValues.filter((value) => value >= 6).length;

  return {
    totalEvents: events.length,
    foodEntries: foodEntries.length,
    bathroomEntries: bathroomEntries.length,
    medicineEntries: medicineEntries.length,
    averageBristol,
    bristolHighCount,
  };
}
