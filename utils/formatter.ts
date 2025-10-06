import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatDateAndTime(isoString: string, use12h: boolean = false) {
  const date = new Date(isoString);

  const formattedDate = format(date, "d 'of' MMMM 'of' yyyy", { locale: enUS });

  const formattedTime = use12h
    ? format(date, "hh:mm a", { locale: enUS }) // 12h con AM/PM
    : format(date, "HH:mm", { locale: enUS }); // 24h

  return { date: formattedDate, time: formattedTime };
}

export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: enUS });
}

export function formatTime(isoString: string, use12h: boolean = false) {
  const date = new Date(isoString);
  return use12h
    ? format(date, "hh:mm a", { locale: enUS }) // 12h con AM/PM
    : format(date, "HH:mm", { locale: enUS }); // 24h
}

export function formatHour(isoString: string, use12h: boolean = false) {
  const date = new Date(isoString);
  return use12h
    ? format(date, "hh a", { locale: enUS }) // 12h con AM/PM
    : format(date, "HH", { locale: enUS }); // 24h
}

export function formatDayOfWeek(isoString: string) {
  const date = new Date(isoString);
  const dayName = format(date, "EEEE", { locale: enUS }); // Ejemplo: "Saturday"
  const dayNumber = format(date, "dd"); // Ejemplo: "05"
  return `${dayName} ${dayNumber}`;
}
