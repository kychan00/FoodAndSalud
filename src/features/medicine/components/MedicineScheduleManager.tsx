import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  CalendarClock,
  ChevronLeft,
  Clock3,
  Download,
  Pencil,
  Square,
  Trash2,
} from "lucide-react";

import {
  archiveMedicineSchedule,
  stopMedicineSchedule,
} from "../medicineSchedule.service";

import { downloadMedicineScheduleIcs } from "../medicineSchedule.download";

import {
  formatMedicineScheduleRule,
  getMedicineScheduleLifecycle,
  getMedicineScheduleLifecycleLabel,
} from "../medicineSchedule.management";

import { useMedicineSchedules } from "../useMedicineSchedules";

import { MedicineScheduleEditForm } from "./MedicineScheduleEditForm";

import "./MedicineScheduleManager.css";

interface MedicineScheduleManagerProps {
  userId: string;

  onCancel: () => void;
}

type ConfirmMode = "stop" | "archive" | null;

export function MedicineScheduleManager({
  userId,
  onCancel,
}: MedicineScheduleManagerProps) {
  const queryClient = useQueryClient();

  const {
    data: schedules = [],
    isLoading,
    isError,
  } = useMedicineSchedules(userId);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);

  const [confirmMode, setConfirmMode] = useState<ConfirmMode>(null);

  const [working, setWorking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const selected = selectedId
    ? (schedules.find((schedule) => schedule.id === selectedId) ?? null)
    : null;

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["medicine-schedules"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["medicine-schedule-calendar"],
      }),
    ]);
  };

  const backToList = () => {
    setSelectedId(null);

    setEditing(false);

    setConfirmMode(null);

    setError(null);
  };

  if (isLoading) {
    return (
      <div className="medicine-schedule-manager__state">
        Cargando programaciones…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="medicine-schedule-manager__state medicine-schedule-manager__state--error">
        No pudimos cargar sus programaciones.
      </div>
    );
  }

  if (editing && selected) {
    return (
      <MedicineScheduleEditForm
        key={selected.id}
        userId={userId}
        schedule={selected}
        onSaved={async () => {
          await invalidate();

          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (!selected) {
    return (
      <section className="medicine-schedule-manager">
        <div className="medicine-schedule-manager__intro">
          <CalendarClock size={22} />

          <div>
            <strong>Sus programaciones</strong>

            <span>
              Edite, exporte o retire una programación sin borrar las tomas que
              ya registró.
            </span>
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="medicine-schedule-manager__empty">
            No hay programaciones para administrar.
          </div>
        ) : (
          <div className="medicine-schedule-manager__list">
            {schedules.map((schedule) => {
              const lifecycle = getMedicineScheduleLifecycle(schedule);

              return (
                <button
                  key={schedule.id}
                  type="button"
                  className="medicine-schedule-manager__card"
                  data-lifecycle={lifecycle}
                  onClick={() => {
                    setError(null);

                    setSelectedId(schedule.id);
                  }}
                >
                  <span className="medicine-schedule-manager__icon">
                    <Clock3 size={18} />
                  </span>

                  <span className="medicine-schedule-manager__body">
                    <small>
                      {getMedicineScheduleLifecycleLabel(lifecycle)}
                    </small>

                    <strong>{schedule.medicineName}</strong>

                    <span>{formatMedicineScheduleRule(schedule)}</span>

                    <span>
                      {schedule.startDate} → {schedule.endDate}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="medicine-schedule-manager__back"
          onClick={onCancel}
        >
          <ChevronLeft size={16} />
          Volver
        </button>
      </section>
    );
  }

  const lifecycle = getMedicineScheduleLifecycle(selected);

  const canEdit = lifecycle !== "stopped";

  const canStop = lifecycle === "active";

  const exportCalendar = () => {
    try {
      const filename = downloadMedicineScheduleIcs(selected);

      setError(null);

      console.info(`Calendario exportado: ${filename}`);
    } catch (exportError) {
      console.error(exportError);

      setError(
        exportError instanceof Error
          ? exportError.message
          : "No pudimos exportar esta programación.",
      );
    }
  };

  const performStop = async () => {
    setWorking(true);

    setError(null);

    try {
      await stopMedicineSchedule(userId, selected.id);

      await invalidate();

      setConfirmMode(null);
    } catch (actionError) {
      console.error(actionError);

      setError("No pudimos finalizar la programación.");
    } finally {
      setWorking(false);
    }
  };

  const performArchive = async () => {
    setWorking(true);

    setError(null);

    try {
      await archiveMedicineSchedule(userId, selected.id);

      await invalidate();

      backToList();
    } catch (actionError) {
      console.error(actionError);

      setError("No pudimos quitar la programación.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <section className="medicine-schedule-manager">
      <button
        type="button"
        className="medicine-schedule-manager__back medicine-schedule-manager__back--top"
        onClick={backToList}
      >
        <ChevronLeft size={16} />
        Programaciones
      </button>

      <article className="medicine-schedule-manager__detail">
        <div className="medicine-schedule-manager__detail-header">
          <div>
            <span>{getMedicineScheduleLifecycleLabel(lifecycle)}</span>

            <h3>{selected.medicineName}</h3>
          </div>

          <CalendarClock size={24} />
        </div>

        <dl>
          <div>
            <dt>Horario</dt>

            <dd>{formatMedicineScheduleRule(selected)}</dd>
          </div>

          <div>
            <dt>Periodo</dt>

            <dd>
              {selected.startDate} → {selected.endDate}
            </dd>
          </div>

          <div>
            <dt>Dosis</dt>

            <dd>
              {selected.dose === null
                ? "Sin dosis"
                : `${selected.dose} ${selected.unit ?? ""}`.trim()}
            </dd>
          </div>

          <div>
            <dt>Zona</dt>

            <dd>{selected.timezone}</dd>
          </div>
        </dl>
      </article>

      {confirmMode === null ? (
        <>
          <div className="medicine-schedule-manager__actions">
            <button type="button" onClick={exportCalendar}>
              <Download size={18} />

              <span>
                <strong>Exportar calendario</strong>

                <small>
                  Descargar archivo .ics para Apple o Google Calendar
                </small>
              </span>
            </button>

            {canEdit ? (
              <button type="button" onClick={() => setEditing(true)}>
                <Pencil size={18} />

                <span>
                  <strong>Editar programación</strong>

                  <small>Horario, periodo, dosis y notas</small>
                </span>
              </button>
            ) : null}

            {canStop ? (
              <button type="button" onClick={() => setConfirmMode("stop")}>
                <Square size={18} />

                <span>
                  <strong>Finalizar ahora</strong>

                  <small>Detener futuras ocurrencias desde este momento</small>
                </span>
              </button>
            ) : null}

            <button
              type="button"
              className="medicine-schedule-manager__danger"
              onClick={() => setConfirmMode("archive")}
            >
              <Trash2 size={18} />

              <span>
                <strong>Quitar programación</strong>

                <small>Ocultarla del calendario y de esta lista</small>
              </span>
            </button>
          </div>

          {error ? (
            <p className="entry-form__error" role="alert">
              {error}
            </p>
          ) : null}
        </>
      ) : (
        <div className="medicine-schedule-manager__confirm">
          <strong>
            {confirmMode === "stop"
              ? "¿Finalizar esta programación ahora?"
              : "¿Quitar esta programación?"}
          </strong>

          <p>
            {confirmMode === "stop"
              ? "Las ocurrencias posteriores a este momento dejarán de aparecer. Las tomas ya registradas permanecen intactas."
              : "La programación dejará de aparecer en el calendario. Las tomas que ya registró permanecen en su historial."}
          </p>

          {error ? (
            <p className="entry-form__error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            className={
              confirmMode === "archive"
                ? "medicine-schedule-manager__confirm-danger"
                : "medicine-schedule-manager__confirm-primary"
            }
            disabled={working}
            onClick={() =>
              void (confirmMode === "stop" ? performStop() : performArchive())
            }
          >
            {working
              ? "Guardando…"
              : confirmMode === "stop"
                ? "Sí, finalizar ahora"
                : "Sí, quitar programación"}
          </button>

          <button
            type="button"
            className="medicine-schedule-manager__confirm-cancel"
            disabled={working}
            onClick={() => {
              setConfirmMode(null);

              setError(null);
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </section>
  );
}
