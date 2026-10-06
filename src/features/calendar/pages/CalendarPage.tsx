import { useMemo, useState } from "react";

import { Activity, ChevronLeft, ChevronRight, Pill, Salad } from "lucide-react";

import { Card } from "../../../components/ui/Card";

import {
  formatMonthTitle,
  getDateKey,
  isSameLocalDay,
  isToday,
  withTimeOfDay,
} from "../../../utils/date";

import { useAuth } from "../../auth/useAuth";

import {
  RegisterSheet,
  type RegisterMode,
} from "../../entries/components/RegisterSheet";

import { EntryEditorSheet } from "../../entries/components/EntryEditorSheet";

import { TimelineList } from "../../timeline/components/TimelineList";

import { useMonthTimeline } from "../../timeline/useMonthTimeline";

import type { TimelineEvent } from "../../timeline/timeline.types";

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

  const [registerOpen, setRegisterOpen] = useState(false);

  const [registerMode, setRegisterMode] = useState<RegisterMode>("choice");

  const [selectedTimelineEvent, setSelectedTimelineEvent] =
    useState<TimelineEvent | null>(null);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useMonthTimeline(user?.id, month);

  const cells = useMemo(() => getCalendarCells(month), [month]);

  const eventsByDay = useMemo(() => {
    const result = new Map<
      string,
      {
        food: number;

        bathroom: number;

        medicine: number;
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

        medicine: 0,
      };

      if (event.event_type === "food") {
        current.food += 1;
      }

      if (event.event_type === "bathroom") {
        current.bathroom += 1;
      }

      if (event.event_type === "medicine") {
        current.medicine += 1;
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

  const selectedFoodCount = selectedEvents.filter(
    (event) => event.event_type === "food",
  ).length;

  const selectedBathroomCount = selectedEvents.filter(
    (event) => event.event_type === "bathroom",
  ).length;

  const selectedMedicineCount = selectedEvents.filter(
    (event) => event.event_type === "medicine",
  ).length;

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

  const selectDate = (date: Date) => {
    setSelectedDate(date);

    if (
      date.getMonth() !== month.getMonth() ||
      date.getFullYear() !== month.getFullYear()
    ) {
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const openRegister = (mode: RegisterMode) => {
    setRegisterMode(mode);

    setRegisterOpen(true);
  };

  const selectedDateLabel = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",

    day: "numeric",

    month: "long",
  }).format(selectedDate);

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

              const outside =
                date.getMonth() !== month.getMonth() ||
                date.getFullYear() !== month.getFullYear();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className="calendar-day"
                  data-selected={isSameLocalDay(date, selectedDate)}
                  data-today={isToday(date)}
                  data-outside={outside}
                  onClick={() => selectDate(date)}
                >
                  <span>{date.getDate()}</span>

                  <span className="calendar-day__dots">
                    {counts?.food ? (
                      <i className="calendar-dot calendar-dot--food" />
                    ) : null}

                    {counts?.bathroom ? (
                      <i className="calendar-dot calendar-dot--bathroom" />
                    ) : null}

                    {counts?.medicine ? (
                      <i className="calendar-dot calendar-dot--medicine" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <section className="calendar-selected">
          <div className="calendar-selected__header">
            <div>
              <h2>{selectedDateLabel}</h2>

              <p>
                {selectedFoodCount}{" "}
                {selectedFoodCount === 1 ? "comida" : "comidas"} ·{" "}
                {selectedBathroomCount} Bristol · {selectedMedicineCount}{" "}
                {selectedMedicineCount === 1 ? "medicina" : "medicinas"}
              </p>
            </div>

            <span>
              {selectedEvents.length}{" "}
              {selectedEvents.length === 1 ? "registro" : "registros"}
            </span>
          </div>

          <div className="calendar-register-actions">
            <button
              type="button"
              className="calendar-register-action calendar-register-action--food"
              onClick={() => openRegister("food")}
            >
              <Salad size={18} />

              <span>Comida</span>
            </button>

            <button
              type="button"
              className="calendar-register-action calendar-register-action--bathroom"
              onClick={() => openRegister("bathroom")}
            >
              <Activity size={18} />

              <span>Bristol</span>
            </button>

            <button
              type="button"
              className="calendar-register-action calendar-register-action--medicine"
              onClick={() => openRegister("medicine")}
            >
              <Pill size={18} />

              <span>Medicina</span>
            </button>
          </div>

          {isLoading ? <Card className="calendar-empty">Cargando…</Card> : null}

          {isError ? (
            <Card className="calendar-empty">No pudimos cargar este mes.</Card>
          ) : null}

          {!isLoading && !isError && selectedEvents.length === 0 ? (
            <Card className="calendar-empty">
              <strong>No hay registros este día.</strong>

              <span>
                Puede agregar una comida, Bristol o Medicina sin salir del
                calendario.
              </span>
            </Card>
          ) : null}

          {!isLoading && !isError && selectedEvents.length > 0 ? (
            <TimelineList
              events={selectedEvents}
              onEventAction={setSelectedTimelineEvent}
            />
          ) : null}
        </section>
      </div>

      {user ? (
        <EntryEditorSheet
          open={selectedTimelineEvent !== null}
          event={selectedTimelineEvent}
          userId={user.id}
          onClose={() => setSelectedTimelineEvent(null)}
        />
      ) : null}

      {user ? (
        <RegisterSheet
          open={registerOpen}
          mode={registerMode}
          userId={user.id}
          initialDate={withTimeOfDay(selectedDate)}
          onModeChange={setRegisterMode}
          onClose={() => setRegisterOpen(false)}
        />
      ) : null}
    </main>
  );
}
