import { useMemo, useState, type FormEvent } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { CalendarClock, Clock3 } from "lucide-react";

import { Button } from "../../../components/ui/Button";

import { QuickSuggestionChips } from "../../entries/components/QuickSuggestionChips";

import { normalizeSuggestionText } from "../../entries/dailySuggestions";

import { getDateKey } from "../../../utils/date";

import { createMedicineSchedule } from "../medicineSchedule.service";

import type { MedicineScheduleType } from "../medicineSchedule.engine";

import { useMedicineSchedules } from "../useMedicineSchedules";

import { useMedicineSuggestions } from "../useMedicineSuggestions";

import "../../entries/components/EntryForm.css";
import "./MedicineRegistrationForm.css";
import "./MedicineScheduleForm.css";

interface MedicineScheduleFormProps {
  userId: string;

  initialDate: Date;

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

function formatScheduleSummary(
  schedule: ReturnType<typeof useMedicineSchedules>["data"] extends infer T
    ? T extends Array<infer U>
      ? U
      : never
    : never,
) {
  if (!schedule) {
    return "";
  }

  if (schedule.scheduleType === "specific_times") {
    return schedule.times.join(" · ");
  }

  if (schedule.intervalMinutes) {
    return `Cada ${schedule.intervalMinutes / 60} h · desde ${
      schedule.intervalStartTime ?? "—"
    }`;
  }

  return "";
}

export function MedicineScheduleForm({
  userId,
  initialDate,
  onSaved,
  onCancel,
}: MedicineScheduleFormProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");

  const [dose, setDose] = useState("");

  const [unit, setUnit] = useState("mg");

  const [reason, setReason] = useState("");

  const [notes, setNotes] = useState("");

  const [startDate, setStartDate] = useState(getDateKey(initialDate));

  const [endDate, setEndDate] = useState(getDateKey(initialDate));

  const [scheduleType, setScheduleType] =
    useState<MedicineScheduleType>("specific_times");

  const [timesPerDay, setTimesPerDay] = useState(1);

  const [times, setTimes] = useState<string[]>([""]);

  const [intervalHours, setIntervalHours] = useState("");

  const [intervalStartTime, setIntervalStartTime] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const { data: suggestions = [] } = useMedicineSuggestions(userId);

  const { data: schedules = [] } = useMedicineSchedules(userId);

  const visibleSuggestions = useMemo(() => {
    const query = normalizeSuggestionText(name);

    return suggestions
      .filter(
        (suggestion) =>
          !query || normalizeSuggestionText(suggestion.name).includes(query),
      )
      .slice(0, 8);
  }, [name, suggestions]);

  const selectSuggestion = (id: string) => {
    const suggestion = suggestions.find((item) => item.id === id);

    if (!suggestion) {
      return;
    }

    setName(suggestion.name);

    if (suggestion.lastDose !== null) {
      setDose(String(suggestion.lastDose));
    }

    const nextUnit = suggestion.lastUnit ?? suggestion.defaultUnit;

    if (nextUnit) {
      setUnit(nextUnit);
    }

    setError(null);
  };

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

    const cleanName = name.trim().replace(/\s+/g, " ");

    if (!cleanName) {
      setError("Escriba el nombre del medicamento.");

      return;
    }

    if (!startDate || !endDate) {
      setError("Seleccione fecha de inicio y fin.");

      return;
    }

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
        setError("Indique la hora de la primera toma programada.");

        return;
      }
    }

    setSaving(true);

    setError(null);

    try {
      await createMedicineSchedule({
        userId,

        name: cleanName,

        dose: parsedDose,

        unit: parsedDose === undefined ? undefined : unit,

        reason,

        notes,

        startDate,

        endDate,

        timezone,

        scheduleType,

        times: scheduleType === "specific_times" ? times : undefined,

        intervalHours: parsedInterval,

        intervalStartTime:
          scheduleType === "interval" ? intervalStartTime : undefined,
      });

      await queryClient.invalidateQueries({
        queryKey: ["medicine-schedules"],
      });

      onSaved();
    } catch (saveError) {
      console.error(saveError);

      setError("No pudimos guardar la programación.");
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
          <strong>Horario personal</strong>

          <span>
            Copie aquí el horario que usted ya tiene indicado. FoodAndSalud no
            calcula ni recomienda una pauta médica.
          </span>
        </div>
      </div>

      {schedules.length > 0 ? (
        <section className="medicine-schedule-existing">
          <div className="medicine-schedule-existing__heading">
            <strong>Programaciones existentes</strong>

            <span>{schedules.length}</span>
          </div>

          <div className="medicine-schedule-existing__list">
            {schedules.slice(0, 4).map((schedule) => (
              <article
                key={schedule.id}
                className="medicine-schedule-existing__card"
              >
                <Clock3 size={17} />

                <div>
                  <strong>{schedule.medicineName}</strong>

                  <span>{formatScheduleSummary(schedule)}</span>

                  <small>
                    {schedule.startDate} → {schedule.endDate}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <QuickSuggestionChips
        label="Medicamento"
        hint="Historial personal"
        items={visibleSuggestions.map((suggestion) => ({
          id: suggestion.id,

          label: suggestion.name,

          meta:
            suggestion.lastDose !== null
              ? `${suggestion.lastDose} ${
                  suggestion.lastUnit ?? suggestion.defaultUnit ?? ""
                }`.trim()
              : suggestion.defaultUnit,

          favorite: suggestion.isFavorite,
        }))}
        onSelect={selectSuggestion}
      />

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="schedule-medicine-name">
          Nombre
        </label>

        <input
          id="schedule-medicine-name"
          className="entry-form__input"
          type="text"
          value={name}
          maxLength={120}
          autoComplete="off"
          placeholder="Ej. Omeprazol"
          onChange={(event) => setName(event.target.value)}
          required
        />
      </section>

      <section className="entry-form__section">
        <p className="entry-form__label">Dosis</p>

        <div className="medicine-dose-row">
          <input
            className="entry-form__input"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={dose}
            placeholder="20"
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

        <p className="entry-form__hint">Opcional.</p>
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
        <p className="entry-form__label">¿Cómo está indicado el horario?</p>

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
          <label className="entry-form__label" htmlFor="medicine-times-per-day">
            Veces al día
          </label>

          <input
            id="medicine-times-per-day"
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
          <label
            className="entry-form__label"
            htmlFor="medicine-interval-hours"
          >
            Intervalo
          </label>

          <div className="medicine-schedule-form__interval">
            <span>Cada</span>

            <input
              id="medicine-interval-hours"
              className="entry-form__input"
              type="number"
              inputMode="numeric"
              min="1"
              max="24"
              step="1"
              value={intervalHours}
              placeholder="8"
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

          <p className="entry-form__hint">
            El intervalo continúa de forma consecutiva entre días hasta la fecha
            de fin.
          </p>
        </section>
      )}

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="schedule-reason">
          Motivo
        </label>

        <input
          id="schedule-reason"
          className="entry-form__input"
          type="text"
          value={reason}
          maxLength={300}
          placeholder="Opcional"
          onChange={(event) => setReason(event.target.value)}
        />
      </section>

      <section className="entry-form__section">
        <label className="entry-form__label" htmlFor="schedule-notes">
          Notas
        </label>

        <textarea
          id="schedule-notes"
          className="entry-form__textarea"
          value={notes}
          maxLength={2000}
          placeholder="Opcional"
          onChange={(event) => setNotes(event.target.value)}
        />
      </section>

      <p className="medicine-schedule-form__timezone">
        Zona horaria guardada: <strong>{timezone}</strong>
      </p>

      {error ? (
        <p className="entry-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="entry-form__actions">
        <Button type="submit" fullWidth disabled={saving}>
          {saving ? "Guardando…" : "Guardar programación"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          fullWidth
          disabled={saving}
          onClick={onCancel}
        >
          Volver
        </Button>
      </div>
    </form>
  );
}
