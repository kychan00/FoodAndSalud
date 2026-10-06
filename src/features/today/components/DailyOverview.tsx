import { Activity, Clock3, Pill, RotateCcw, Salad } from "lucide-react";

import { Card } from "../../../components/ui/Card";

import { formatEventTime } from "../../../utils/date";

import {
  getTimelineEventDetail,
  getTimelineEventTitle,
} from "../../timeline/timeline.presentation";

import type { TimelineEvent } from "../../timeline/timeline.types";

import { buildDailySummary } from "../dailySummary";

import "./DailyOverview.css";

interface DailyOverviewProps {
  events: TimelineEvent[];

  selectedIsToday: boolean;

  onReturnToday: () => void;
}

function getFoodValue(event: TimelineEvent | null) {
  if (!event) {
    return "Sin comida";
  }

  return getTimelineEventDetail(event) ?? getTimelineEventTitle(event);
}

function getBathroomValue(event: TimelineEvent | null) {
  if (!event) {
    return "Sin Bristol";
  }

  return getTimelineEventTitle(event).replace(/^Baño · /, "");
}

function getMedicineValue(event: TimelineEvent | null) {
  if (!event) {
    return "Sin Medicina";
  }

  return event.event_subtype ?? "Medicina";
}

function getTime(event: TimelineEvent | null) {
  if (!event?.occurred_at) {
    return "—";
  }

  return formatEventTime(event.occurred_at);
}

export function DailyOverview({
  events,
  selectedIsToday,
  onReturnToday,
}: DailyOverviewProps) {
  const summary = buildDailySummary(events);

  return (
    <section className="daily-overview">
      <div className="daily-overview__heading">
        <div>
          <span>En un vistazo</span>

          <h2>
            {summary.total === 0
              ? "Sin registros"
              : `${summary.total} ${
                  summary.total === 1 ? "registro" : "registros"
                }`}
          </h2>
        </div>

        {!selectedIsToday ? (
          <button
            type="button"
            className="daily-overview__today"
            onClick={onReturnToday}
          >
            <RotateCcw size={14} />
            Hoy
          </button>
        ) : null}
      </div>

      {summary.total === 0 ? (
        <Card className="daily-overview__empty">
          <Clock3 size={22} />

          <div>
            <strong>Este día todavía está vacío</strong>

            <span>Sus registros aparecerán aquí conforme los agregue.</span>
          </div>
        </Card>
      ) : (
        <div className="daily-overview__grid">
          <Card className="daily-overview-item daily-overview-item--food">
            <span className="daily-overview-item__icon">
              <Salad size={19} />
            </span>

            <div className="daily-overview-item__body">
              <span className="daily-overview-item__label">Última comida</span>

              <strong>{getFoodValue(summary.food.latest)}</strong>

              <small>
                {summary.food.count}{" "}
                {summary.food.count === 1 ? "comida" : "comidas"} ·{" "}
                {getTime(summary.food.latest)}
              </small>
            </div>
          </Card>

          <Card className="daily-overview-item daily-overview-item--bathroom">
            <span className="daily-overview-item__icon">
              <Activity size={19} />
            </span>

            <div className="daily-overview-item__body">
              <span className="daily-overview-item__label">Último Bristol</span>

              <strong>{getBathroomValue(summary.bathroom.latest)}</strong>

              <small>
                {summary.bathroom.count}{" "}
                {summary.bathroom.count === 1 ? "registro" : "registros"} ·{" "}
                {getTime(summary.bathroom.latest)}
              </small>
            </div>
          </Card>

          <Card className="daily-overview-item daily-overview-item--medicine">
            <span className="daily-overview-item__icon">
              <Pill size={19} />
            </span>

            <div className="daily-overview-item__body">
              <span className="daily-overview-item__label">
                Última Medicina
              </span>

              <strong>{getMedicineValue(summary.medicine.latest)}</strong>

              <small>
                {summary.medicine.count}{" "}
                {summary.medicine.count === 1 ? "toma" : "tomas"} ·{" "}
                {getTime(summary.medicine.latest)}
              </small>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
