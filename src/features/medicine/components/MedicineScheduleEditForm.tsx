import { useState, type FormEvent } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { CalendarClock } from "lucide-react";

import { Button } from "../../../components/ui/Button";

import { updateMedicineSchedule } from "../medicineSchedule.service";

import type {
  MedicineScheduleDefinition,
  MedicineScheduleType,
} from "../medicineSchedule.engine";

import "../../entries/components/EntryForm.css";
import "./MedicineRegistrationForm.css";
import "./MedicineScheduleForm.css";

interface MedicineScheduleEditFormProps {
  userId: string;

  schedule: MedicineScheduleDefinition;

  onSaved: () => void;

  onCancel: () => void;
}

const units = ["mg", "g", "ml", "tableta", "cápsula"];

function resizeTimes(current: string[], count: number) {
  const safeCount = Math.max(1, Math.min(8, count));

  if (current.length === safeCount) {
    return current;
  }

  if (current.length > safeCount) {
    return current.slice(0, safeCount);
  }

  return [
    ...current,
    ...Array.from(
      {
        length: safeCount - current.length,
      },
      () => "",
    ),
  ];
}

export function MedicineScheduleEditForm({
  userId,
  schedule,
  onSaved,
  onCancel,
}: MedicineScheduleEditFormProps) {
  const queryClient = useQueryClient();

  const [dose, setDose] = useState(
    schedule.dose === null ? "" : String(schedule.dose),
  );

  const [unit, setUnit] = useState(schedule.unit ?? "mg");

  const [reason, setReason] = useState(schedule.reason ?? "");

  const [notes, setNotes] = useState(schedule.notes ?? "");

  const [startDate, setStartDate] = useState(schedule.startDate);

  const [endDate, setEndDate] = useState(schedule.endDate);

  const [scheduleType, setScheduleType] = useState<MedicineScheduleType>(
    schedule.scheduleType,
  );

  const [timesPerDay, setTimesPerDay] = useState(
    Math.max(1, schedule.times.length),
  );

  const [times, setTimes] = useState<string[]>(
    schedule.scheduleType === "specific_times" && schedule.times.length > 0
      ? [...schedule.times]
      : [""],
  );

  const [intervalHours, setIntervalHours] = useState(
    schedule.intervalMinutes ? String(schedule.intervalMinutes / 60) : "",
  );

  const [intervalStartTime, setIntervalStartTime] = useState(
    schedule.intervalStartTime ?? "",
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const updateTimesCount = (value: number) => {
    const count = Math.max(1, Math.min(8, value));

    setTimesPerDay(count);

    setTimes((current) => resizeTimes(current, count));
  };

  const updateTime = (index: number, value: string) => {
    setTimes((current) =>
      current.map((time, currentIndex) =>
        currentIndex === index ? value : time,
      ),
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (endDate < startDate) {
      setError("La fecha de fin no puede ser anterior al inicio.");

      return;
    }

    const parsedDose = dose.trim() ? Number(dose) : undefined;

    if (
      parsedDose !== undefined &&
      (!Number.isFinite(parsedDose) || parsedDose <= 0)
    ) {
      setError("La dosis debe ser mayor a cero.");

      return;
    }

    if (scheduleType === "specific_times") {
      if (times.some((time) => !time)) {
        setError("Indique todas las horas programadas.");

        return;
      }

      if (new Set(times).size !== times.length) {
        setError("Las horas programadas no deben repetirse.");

        return;
      }
    }

    let parsedInterval: number | undefined;

    if (scheduleType === "interval") {
      parsedInterval = Number(intervalHours);

      if (
        !Number.isInteger(parsedInterval) ||
        parsedInterval < 1 ||
        parsedInterval > 24
      ) {
        setError("El intervalo debe ser un número entero entre 1 y 24 horas.");

        return;
      }

      if (!intervalStartTime) {
        setError("Indique la primera hora programada.");

        return;
      }
    }

    setSaving(true);

    setError(null);

    try {
      await updateMedicineSchedule({
        userId,

        scheduleId: schedule.id,

        dose: parsedDose,

        unit: parsedDose === undefined ? undefined : unit,

        reason,

        notes,

        startDate,

        endDate,

        timezone: schedule.timezone,

        scheduleType,

        times: scheduleType === "specific_times" ? times : undefined,

        intervalHours: parsedInterval,

        intervalStartTime:
          scheduleType === "interval" ? intervalStartTime : undefined,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["medicine-schedules"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["medicine-schedule-calendar"],
        }),
      ]);

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos actualizar la programación.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="entry-form medicine-schedule-form"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="medicine-schedule-form__notice">
        <CalendarClock size={21} />

        <div>
          <strong>{schedule.medicineName}</strong>

          <span>
            Está editando la programación. Las tomas ya registradas no se
            reescriben ni se eliminan.
          </span>
        </div>
      </div>

      <section className="entry-form__section">
        <p className="entry-form__label">Dosis programada</p>

        <div className="medicine-dose-row">
          <input
            className="entry-form__input"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={dose}
            onChange={(event) => setDose(event.target.value)}
          />

          <select
            className="entry-form__input"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          >
            {units.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Periodo</p>

        <div className="medicine-schedule-form__dates">
          <label>
            <span>Inicio</span>

            <input
              className="entry-form__input"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Fin</span>

            <input
              className="entry-form__input"
              type="date"
              min={startDate}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </label>
        </div>
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Horario</p>

        <div className="medicine-schedule-form__mode">
          <button
            type="button"
            data-selected={scheduleType === "specific_times"}
            onClick={() => setScheduleType("specific_times")}
          >
            Horas específicas
          </button>

          <button
            type="button"
            data-selected={scheduleType === "interval"}
            onClick={() => setScheduleType("interval")}
          >
            Cada X horas
          </button>
        </div>
      </section>

      {scheduleType === "specific_times" ? (
        <section className="entry-form__section">
          <label className="entry-form__label">Veces al día</label>

          <input
            className="entry-form__input"
            type="number"
            inputMode="numeric"
            min="1"
            max="8"
            step="1"
            value={timesPerDay}
            onChange={(event) =>
              updateTimesCount(Number(event.target.value) || 1)
            }
          />

          <div className="medicine-schedule-form__times">
            {times.map((time, index) => (
              <label key={index}>
                <span>Hora {index + 1}</span>

                <input
                  className="entry-form__input"
                  type="time"
                  value={time}
                  onChange={(event) => updateTime(index, event.target.value)}
                  required
                />
              </label>
            ))}
          </div>
        </section>
      ) : (
        <section className="entry-form__section">
          <label className="entry-form__label">Intervalo</label>

          <div className="medicine-schedule-form__interval">
            <span>Cada</span>

            <input
              className="entry-form__input"
              type="number"
              inputMode="numeric"
              min="1"
              max="24"
              step="1"
              value={intervalHours}
              onChange={(event) => setIntervalHours(event.target.value)}
              required
            />

            <span>horas</span>
          </div>

          <label className="medicine-schedule-form__first-time">
            <span>Primera hora programada</span>

            <input
              className="entry-form__input"
              type="time"
              value={intervalStartTime}
              onChange={(event) => setIntervalStartTime(event.target.value)}
              required
            />
          </label>
        </section>
      )}

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-schedule-reason">
          Motivo
        </label>

        <input
          id="edit-schedule-reason"
          className="entry-form__input"
          type="text"
          value={reason}
          maxLength={300}
          onChange={(event) => setReason(event.target.value)}
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="edit-schedule-notes">
          Notas
        </label>

        <textarea
          id="edit-schedule-notes"
          className="entry-form__textarea"
          value={notes}
          maxLength={2000}
          onChange={(event) => setNotes(event.target.value)}
        />
      </section>

      {error ? (
        <p className="entry-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="entry-form__actions">
        <Button type="submit" fullWidth disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          fullWidth
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
