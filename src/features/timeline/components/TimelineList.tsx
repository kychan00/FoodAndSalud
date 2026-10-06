import { Activity, Pill, Salad } from "lucide-react";

import { formatEventTime } from "../../../utils/date";

import {
  getTimelineEventClass,
  getTimelineEventDetail,
  getTimelineEventTitle,
} from "../timeline.presentation";

import type { TimelineEvent } from "../timeline.types";

import "./TimelineList.css";

interface TimelineListProps {
  events: TimelineEvent[];
}

function getEventIcon(event: TimelineEvent) {
  if (event.event_type === "food") {
    return <Salad size={20} />;
  }

  if (event.event_type === "bathroom") {
    return <Activity size={20} />;
  }

  return <Pill size={20} />;
}

export function TimelineList({ events }: TimelineListProps) {
  return (
    <div className="timeline-list">
      {events.map((event) => {
        const eventClass = getTimelineEventClass(event);

        const detail = getTimelineEventDetail(event);

        return (
          <article
            key={`${event.event_type}-${event.id}`}
            className="timeline-event"
          >
            <span
              className={`timeline-event__icon timeline-event__icon--${eventClass}`}
            >
              {getEventIcon(event)}
            </span>

            <div className="timeline-event__body">
              <strong>{getTimelineEventTitle(event)}</strong>

              {detail ? (
                <span className="timeline-event__detail">{detail}</span>
              ) : null}

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
