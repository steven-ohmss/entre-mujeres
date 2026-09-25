const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const MONTH_ABBR = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const WEEKDAY_ABBR = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKDAY_ABBR_UPPER = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export interface DateParts {
  year: number;
  month: number;
  day: number;
  weekdayIndex: number;
}

export function parseISODate(iso: string): DateParts {
  const [yearStr, monthStr, dayStr] = iso.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const referenceDate = new Date(Date.UTC(year, month - 1, day));
  const weekdayFromSunday = referenceDate.getUTCDay();
  const weekdayIndex = (weekdayFromSunday + 6) % 7;

  return { year, month, day, weekdayIndex };
}

export function formatEventDate(iso: string): string {
  const { year, month, day, weekdayIndex } = parseISODate(iso);
  return `${WEEKDAY_ABBR[weekdayIndex]} ${day} de ${MONTH_NAMES[month - 1]} de ${year}`;
}

export function getDateBlockParts(iso: string) {
  const { month, day, weekdayIndex } = parseISODate(iso);
  return {
    dayAbbrev: WEEKDAY_ABBR_UPPER[weekdayIndex],
    dayNumber: day,
    monthAbbrev: MONTH_ABBR[month - 1],
  };
}

export function getMonthLabel(year: number, month: number): string {
  const name = MONTH_NAMES[month - 1];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

export function getWeekdayHeaders(): string[] {
  return WEEKDAY_ABBR;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function firstWeekdayOfMonth(year: number, month: number): number {
  const referenceDate = new Date(Date.UTC(year, month - 1, 1));
  const weekdayFromSunday = referenceDate.getUTCDay();
  return (weekdayFromSunday + 6) % 7;
}

export function compareISODates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isSameISODate(a: string, b: string): boolean {
  return a === b;
}
