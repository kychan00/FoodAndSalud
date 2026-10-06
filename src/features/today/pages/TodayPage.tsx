import { useState } from "react";
import { Activity, CalendarDays, Pill, Salad } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DateStripCalendar } from "../../../components/date/DateStripCalendar";
import { Card } from "../../../components/ui/Card";
import { formatFullDate, formatLongDay, isToday } from "../../../utils/date";
import { useAuth } from "../../auth/useAuth";
import {
  RegisterSheet,
  type RegisterMode,
} from "../../entries/components/RegisterSheet";
import { TimelineList } from "../../timeline/components/TimelineList";
import { useDayTimeline } from "../../timeline/useDayTimeline";

import "./TodayPage.css";

export function TodayPage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [registerMode, setRegisterMode] = useState<RegisterMode>("choice");

  const [registerOpen, setRegisterOpen] = useState(false);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useDayTimeline(user?.id, selectedDate);

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Usuario";

  const initial = displayName.charAt(0).toUpperCase();

  const foodCount = events.filter(
    (event) => event.event_type === "food",
  ).length;

  const bathroomCount = events.filter(
    (event) => event.event_type === "bathroom",
  ).length;

  const medicineCount = events.filter(
    (event) => event.event_type === "medicine",
  ).length;

  const openRegister = (mode: RegisterMode) => {
    setRegisterMode(mode);

    setRegisterOpen(true);
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

        <section className="today-focus">
          <p className="today-focus__label">
            {isToday(selectedDate) ? "Su digestión hoy" : "Resumen del día"}
          </p>

          <strong className="today-focus__value">
            {events.length === 0
              ? "Sin registros"
              : `${events.length} ${
                  events.length === 1 ? "registro" : "registros"
                }`}
          </strong>

          <p className="today-focus__description">
            {events.length === 0
              ? "Registre comidas, Bristol y Medicina para comenzar a encontrar patrones."
              : `${foodCount} ${
                  foodCount === 1 ? "comida" : "comidas"
                } · ${bathroomCount} Bristol · ${medicineCount} ${
                  medicineCount === 1 ? "medicina" : "medicinas"
                }`}
          </p>
        </section>

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
            <TimelineList events={events} />
          ) : null}
        </section>
      </div>

      {user ? (
        <RegisterSheet
          open={registerOpen}
          mode={registerMode}
          userId={user.id}
          initialDate={selectedDate}
          onModeChange={setRegisterMode}
          onClose={() => setRegisterOpen(false)}
        />
      ) : null}
    </main>
  );
}
