import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/useAuth";
import { TimelineList } from "../../timeline/components/TimelineList";
import { useMonthTimeline } from "../../timeline/useMonthTimeline";
import {
  formatMonthTitle,
  getDateKey,
  isSameLocalDay,
  isToday,
} from "../../../utils/date";

import "./CalendarPage.css";

const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

function getCalendarCells(month: Date) {
  const year = month.getFullYear();

  const monthIndex = month.getMonth();

  const first = new Date(year, monthIndex, 1);

  const jsDay = first.getDay();

  const mondayIndex = jsDay === 0 ? 6 : jsDay - 1;

  const gridStart = new Date(first);

  gridStart.setDate(first.getDate() - mondayIndex);

  return Array.from(
    {
      length: 42,
    },
    (_, index) => {
      const date = new Date(gridStart);

      date.setDate(gridStart.getDate() + index);

      return date;
    },
  );
}

export function CalendarPage() {
  const { user } = useAuth();

  const [month, setMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: events = [], isLoading } = useMonthTimeline(user?.id, month);

  const cells = useMemo(() => getCalendarCells(month), [month]);

  const eventsByDay = useMemo(() => {
    const result = new Map<
      string,
      {
        food: number;
        bathroom: number;
      }
    >();

    for (const event of events) {
      if (!event.occurred_at) {
        continue;
      }

      const key = getDateKey(event.occurred_at);

      const current = result.get(key) ?? {
        food: 0,
        bathroom: 0,
      };

      if (event.event_type === "food") {
        current.food += 1;
      }

      if (event.event_type === "bathroom") {
        current.bathroom += 1;
      }

      result.set(key, current);
    }

    return result;
  }, [events]);

  const selectedEvents = events.filter((event) =>
    event.occurred_at
      ? isSameLocalDay(new Date(event.occurred_at), selectedDate)
      : false,
  );

  const moveMonth = (amount: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + amount, 1);

    setMonth(next);
    setSelectedDate(next);
  };

  const goToday = () => {
    const today = new Date();

    setMonth(today);
    setSelectedDate(today);
  };

  return (
    <main className="calendar-page">
      <div className="calendar-page__content">
        <header className="calendar-header">
          <div>
            <p>FoodAndSalud</p>

            <h1>Calendario</h1>
          </div>

          <button type="button" onClick={goToday}>
            Hoy
          </button>
        </header>

        <Card className="calendar-card">
          <div className="calendar-month-header">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeft size={21} />
            </button>

            <strong>{formatMonthTitle(month)}</strong>

            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => moveMonth(1)}
            >
              <ChevronRight size={21} />
            </button>
          </div>

          <div className="calendar-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {cells.map((date) => {
              const key = getDateKey(date);

              const counts = eventsByDay.get(key);

              const outside = date.getMonth() !== month.getMonth();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className="calendar-day"
                  data-selected={isSameLocalDay(date, selectedDate)}
                  data-today={isToday(date)}
                  data-outside={outside}
                  onClick={() => setSelectedDate(date)}
                >
                  <span>{date.getDate()}</span>

                  <span className="calendar-day__dots">
                    {counts?.food ? (
                      <i className="calendar-dot calendar-dot--food" />
                    ) : null}

                    {counts?.bathroom ? (
                      <i className="calendar-dot calendar-dot--bathroom" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <section className="calendar-selected">
          <div className="calendar-selected__header">
            <h2>
              {new Intl.DateTimeFormat("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(selectedDate)}
            </h2>

            <span>{selectedEvents.length} registros</span>
          </div>

          {isLoading ? <Card className="calendar-empty">Cargando…</Card> : null}

          {!isLoading && selectedEvents.length === 0 ? (
            <Card className="calendar-empty">No hay registros este día.</Card>
          ) : null}

          {!isLoading && selectedEvents.length > 0 ? (
            <TimelineList events={selectedEvents} />
          ) : null}
        </section>
      </div>
    </main>
  );
}
