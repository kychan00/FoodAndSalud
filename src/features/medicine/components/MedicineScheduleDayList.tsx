import { CalendarClock, CheckCircle2, Clock3 } from "lucide-react";

import { formatEventTime } from "../../../utils/date";

import type { MedicineScheduleCalendarItem } from "../medicineSchedule.calendar";

import "./MedicineScheduleDayList.css";

interface MedicineScheduleDayListProps {
  items: MedicineScheduleCalendarItem[];

  onSelect: (item: MedicineScheduleCalendarItem) => void;
}

function doseText(item: MedicineScheduleCalendarItem) {
  if (item.dose === null) {
    return null;
  }

  return [item.dose, item.unit].filter(Boolean).join(" ");
}

export function MedicineScheduleDayList({
  items,
  onSelect,
}: MedicineScheduleDayListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="medicine-day-schedule">
      <div className="medicine-day-schedule__heading">
        <div>
          <CalendarClock size={17} />

          <strong>Medicina programada</strong>
        </div>

        <span>
          {items.filter((item) => item.status === "scheduled").length}{" "}
          pendientes
        </span>
      </div>

      <div className="medicine-day-schedule__list">
        {items.map((item) => {
          const dose = doseText(item);

          if (item.status === "recorded") {
            return (
              <article
                key={item.id}
                className="medicine-day-item medicine-day-item--recorded"
              >
                <span className="medicine-day-item__icon">
                  <CheckCircle2 size={20} />
                </span>

                <div className="medicine-day-item__body">
                  <span className="medicine-day-item__status">Registrada</span>

                  <strong>{item.medicineName}</strong>

                  <small>
                    Programada {formatEventTime(item.scheduledFor)}
                    {item.takenAt
                      ? ` · registrada ${formatEventTime(item.takenAt)}`
                      : ""}
                    {dose ? ` · ${dose}` : ""}
                  </small>
                </div>
              </article>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className="medicine-day-item medicine-day-item--scheduled"
              onClick={() => onSelect(item)}
            >
              <span className="medicine-day-item__icon">
                <Clock3 size={20} />
              </span>

              <div className="medicine-day-item__body">
                <span className="medicine-day-item__status">Programado</span>

                <strong>{item.medicineName}</strong>

                <small>
                  {formatEventTime(item.scheduledFor)}
                  {dose ? ` · ${dose}` : ""}
                </small>
              </div>

              <span className="medicine-day-item__action">Registrar</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
