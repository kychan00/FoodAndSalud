export function toLocalDateTimeInput(date = new Date()): string {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function localDateTimeToIso(value: string): string {
  return new Date(value).toISOString();
}

export function withTimeOfDay(date: Date, timeSource = new Date()) {
  const result = new Date(date);

  result.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0);

  return result;
}

export function getDayRange(date = new Date()) {
  const start = new Date(date);

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);

  end.setDate(end.getDate() + 1);

  return {
    start,
    end,
  };
}

export function getLocalDayRange(date = new Date()) {
  return getDayRange(date);
}

export function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return {
    start,
    end,
  };
}

export function isSameLocalDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isToday(date: Date) {
  return isSameLocalDay(date, new Date());
}

export function getDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",

    minute: "2-digit",
  }).format(new Date(value));
}

export function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",

    month: "long",
  }).format(date);
}

export function formatMonthTitle(date: Date) {
  const text = new Intl.DateTimeFormat("es-MX", {
    month: "long",

    year: "numeric",
  }).format(date);

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatLongDay(date: Date) {
  const text = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
  }).format(date);

  return text.charAt(0).toUpperCase() + text.slice(1);
}
