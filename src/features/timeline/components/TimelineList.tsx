import { Activity, Salad } from "lucide-react";

import { formatEventTime } from "../../../utils/date";
import type { TimelineEvent } from "../timeline.service";

import "./TimelineList.css";

interface TimelineListProps {
  events: TimelineEvent[];
}

const mealLabels: Record<string, string> = {
  breakfast: "Desayuno",
  lunch: "Comida",
  dinner: "Cena",
  snack: "Colación",
  other: "Comida",
};

function getEventTitle(event: TimelineEvent) {
  if (event.event_type === "food") {
    return mealLabels[event.event_subtype ?? ""] ?? "Alimento";
  }

  if (event.event_type === "bathroom") {
    const type = event.event_subtype?.replace("bristol_", "");

    return type ? `Baño · Bristol ${type}` : "Baño";
  }

  return "Registro";
}

export function TimelineList({ events }: TimelineListProps) {
  return (
    <div className="timeline-list">
      {events.map((event) => {
        const isFood = event.event_type === "food";

        return (
          <article
            key={`${event.event_type}-${event.id}`}
            className="timeline-event"
          >
            <span
              className={
                isFood
                  ? "timeline-event__icon timeline-event__icon--food"
                  : "timeline-event__icon timeline-event__icon--bathroom"
              }
            >
              {isFood ? <Salad size={20} /> : <Activity size={20} />}
            </span>

            <div className="timeline-event__body">
              <strong>{getEventTitle(event)}</strong>

              {event.notes ? (
                <span className="timeline-event__notes">{event.notes}</span>
              ) : null}
            </div>

            <time
              className="timeline-event__time"
              dateTime={event.occurred_at ?? undefined}
            >
              {event.occurred_at ? formatEventTime(event.occurred_at) : ""}
            </time>
          </article>
        );
      })}
    </div>
  );
}
