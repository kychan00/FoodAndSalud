const shortDateFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: "UTC",
  day: "2-digit",
  month: "short",
});

const longDateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: "UTC",
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: "UTC",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatQaShortDate(value: string) {
  return shortDateFormatter.format(new Date(value)).replace(".", "");
}

export function formatQaDateTime(value: string) {
  return longDateTimeFormatter.format(new Date(value)).replace(".", "");
}

export function formatQaTime(value: string) {
  return timeFormatter.format(new Date(value));
}
