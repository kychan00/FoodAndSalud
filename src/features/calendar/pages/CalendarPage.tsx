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

import { EntryEditorSheet } from "../../entries/components/EntryEditorSheet";

import {
  RegisterSheet,
  type RegisterMode,
} from "../../entries/components/RegisterSheet";

import { MedicineScheduleDayList } from "../../medicine/components/MedicineScheduleDayList";

import { MedicineScheduledIntakeSheet } from "../../medicine/components/MedicineScheduledIntakeSheet";

import type { MedicineScheduleCalendarItem } from "../../medicine/medicineSchedule.calendar";

import { useMedicineScheduleCalendar } from "../../medicine/useMedicineScheduleCalendar";

import { TimelineList } from "../../timeline/components/TimelineList";

import type { TimelineEvent } from "../../timeline/timeline.types";

import { useMonthTimeline } from "../../timeline/useMonthTimeline";

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

  const [selectedScheduledItem, setSelectedScheduledItem] =
    useState<MedicineScheduleCalendarItem | null>(null);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useMonthTimeline(user?.id, month);

  const {
    data: scheduleItems = [],
    isLoading: scheduleLoading,
    isError: scheduleError,
  } = useMedicineScheduleCalendar(user?.id, month);

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

  const pendingSchedulesByDay = useMemo(() => {
    const result = new Map<string, number>();

    for (const item of scheduleItems) {
      if (item.status !== "scheduled") {
        continue;
      }

      const key = getDateKey(item.scheduledFor);

      result.set(key, (result.get(key) ?? 0) + 1);
    }

    return result;
  }, [scheduleItems]);

  const selectedEvents = events.filter((event) =>
    event.occurred_at
      ? isSameLocalDay(new Date(event.occurred_at), selectedDate)
      : false,
  );

  const selectedScheduledItems = scheduleItems.filter((item) =>
    isSameLocalDay(new Date(item.scheduledFor), selectedDate),
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

  const selectedPendingCount = selectedScheduledItems.filter(
    (item) => item.status === "scheduled",
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

  const anyLoading = isLoading || scheduleLoading;

  const anyError = isError || scheduleError;

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

              const pendingSchedules = pendingSchedulesByDay.get(key) ?? 0;

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

                    {pendingSchedules ? (
                      <i className="calendar-dot calendar-dot--medicine-scheduled" />
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
                {selectedMedicineCount === 1
                  ? "toma registrada"
                  : "tomas registradas"}
                {selectedPendingCount > 0
                  ? ` · ${selectedPendingCount} programada${
                      selectedPendingCount === 1 ? "" : "s"
                    }`
                  : ""}
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

          {anyLoading ? (
            <Card className="calendar-empty">Cargando…</Card>
          ) : null}

          {anyError ? (
            <Card className="calendar-empty">
              No pudimos cargar completamente este mes.
            </Card>
          ) : null}

          {!anyLoading && !anyError ? (
            <MedicineScheduleDayList
              items={selectedScheduledItems}
              onSelect={(item) => setSelectedScheduledItem(item)}
            />
          ) : null}

          {!anyLoading &&
          !anyError &&
          selectedEvents.length === 0 &&
          selectedScheduledItems.length === 0 ? (
            <Card className="calendar-empty">
              <strong>No hay registros este día.</strong>

              <span>
                Puede agregar una comida, Bristol o Medicina sin salir del
                calendario.
              </span>
            </Card>
          ) : null}

          {!anyLoading &&
          !anyError &&
          selectedEvents.length === 0 &&
          selectedScheduledItems.length > 0 ? (
            <Card className="calendar-empty calendar-empty--recorded">
              <strong>Todavía no hay registros realizados.</strong>

              <span>
                Las tarjetas de arriba son horarios programados, no tomas
                registradas.
              </span>
            </Card>
          ) : null}

          {!anyLoading && !anyError && selectedEvents.length > 0 ? (
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
        <MedicineScheduledIntakeSheet
          item={selectedScheduledItem}
          userId={user.id}
          onClose={() => setSelectedScheduledItem(null)}
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
