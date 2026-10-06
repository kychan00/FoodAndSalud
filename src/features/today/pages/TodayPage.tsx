import { useState } from "react";

import { Activity, CalendarDays, Pill, Salad } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { DateStripCalendar } from "../../../components/date/DateStripCalendar";

import { Card } from "../../../components/ui/Card";

import {
  formatFullDate,
  formatLongDay,
  isToday,
  withTimeOfDay,
} from "../../../utils/date";

import { useAuth } from "../../auth/useAuth";

import { EntryEditorSheet } from "../../entries/components/EntryEditorSheet";

import {
  RegisterSheet,
  type RegisterMode,
} from "../../entries/components/RegisterSheet";

import { TimelineList } from "../../timeline/components/TimelineList";

import type { TimelineEvent } from "../../timeline/timeline.types";

import { useDayTimeline } from "../../timeline/useDayTimeline";

import { DailyOverview } from "../components/DailyOverview";

import "./TodayPage.css";

export function TodayPage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [registerMode, setRegisterMode] = useState<RegisterMode>("choice");

  const [registerOpen, setRegisterOpen] = useState(false);

  const [selectedTimelineEvent, setSelectedTimelineEvent] =
    useState<TimelineEvent | null>(null);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useDayTimeline(user?.id, selectedDate);

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Usuario";

  const initial = displayName.charAt(0).toUpperCase();

  const openRegister = (mode: RegisterMode) => {
    setRegisterMode(mode);

    setRegisterOpen(true);
  };

  const goToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <main className="today-page">
      <div className="today-page__background" />

      <div className="today-page__content">
        <header className="today-topbar">
          <div
            className="today-avatar"
            aria-label={`Perfil de ${displayName}`}
            title={displayName}
          >
            {initial}
          </div>

          <div className="today-brand">
            Food
            <span>&</span>
            Salud
          </div>

          <button
            type="button"
            className="today-calendar-button"
            aria-label="Abrir calendario"
            onClick={() => navigate("/calendar")}
          >
            <CalendarDays size={23} />
          </button>
        </header>

        <section className="today-date">
          <p>{formatLongDay(selectedDate)}</p>

          <h1>{formatFullDate(selectedDate)}</h1>
        </section>

        <DateStripCalendar
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {isLoading ? (
          <Card className="today-state-card today-state-card--summary">
            Cargando resumen…
          </Card>
        ) : null}

        {isError ? (
          <Card className="today-state-card today-state-card--summary">
            No pudimos cargar el resumen de este día.
          </Card>
        ) : null}

        {!isLoading && !isError ? (
          <DailyOverview
            events={events}
            selectedIsToday={isToday(selectedDate)}
            onReturnToday={goToday}
          />
        ) : null}

        <section className="today-actions">
          <button
            type="button"
            className="today-action today-action--food"
            onClick={() => openRegister("food")}
          >
            <span className="today-action__circle">
              <Salad size={29} />
            </span>

            <span>
              Registrar
              <br />
              comida
            </span>
          </button>

          <button
            type="button"
            className="today-action today-action--bathroom"
            onClick={() => openRegister("bathroom")}
          >
            <span className="today-action__circle">
              <Activity size={29} />
            </span>

            <span>
              Registrar
              <br />
              Bristol
            </span>
          </button>

          <button
            type="button"
            className="today-action today-action--medicine"
            onClick={() => openRegister("medicine")}
          >
            <span className="today-action__circle">
              <Pill size={29} />
            </span>

            <span>Medicina</span>
          </button>
        </section>

        <section className="today-timeline">
          <div className="today-section-title">
            <h2>Su día</h2>

            <span>
              {events.length} {events.length === 1 ? "registro" : "registros"}
            </span>
          </div>

          {isLoading ? (
            <Card className="today-state-card">Cargando…</Card>
          ) : null}

          {isError ? (
            <Card className="today-state-card">
              No pudimos cargar sus registros.
            </Card>
          ) : null}

          {!isLoading && !isError && events.length === 0 ? (
            <Card className="today-state-card">
              <strong>Todavía no hay registros</strong>

              <span>
                Sus comidas, Bristol y Medicina aparecerán aquí en orden
                cronológico.
              </span>
            </Card>
          ) : null}

          {!isLoading && !isError && events.length > 0 ? (
            <TimelineList
              events={events}
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
