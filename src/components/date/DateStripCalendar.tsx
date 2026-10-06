import { useMemo } from "react";

import { isSameLocalDay, isToday } from "../../utils/date";

import "./DateStripCalendar.css";

interface DateStripCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const weekdayFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
});

function getWeekdayLetter(date: Date) {
  return weekdayFormatter.format(date).replace(".", "").charAt(0).toUpperCase();
}

export function DateStripCalendar({
  selectedDate,
  onSelect,
}: DateStripCalendarProps) {
  const dates = useMemo(() => {
    const result: Date[] = [];

    for (let offset = -3; offset <= 3; offset += 1) {
      const date = new Date(selectedDate);

      date.setDate(selectedDate.getDate() + offset);

      result.push(date);
    }

    return result;
  }, [selectedDate]);

  return (
    <div className="date-strip">
      {dates.map((date) => {
        const selected = isSameLocalDay(date, selectedDate);

        return (
          <button
            key={date.toISOString()}
            type="button"
            className="date-strip__day"
            data-selected={selected}
            onClick={() => onSelect(date)}
          >
            <span className="date-strip__weekday">
              {isToday(date) ? "HOY" : getWeekdayLetter(date)}
            </span>

            <span className="date-strip__number">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
