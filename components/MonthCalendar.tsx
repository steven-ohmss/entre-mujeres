"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  daysInMonth,
  firstWeekdayOfMonth,
  getMonthLabel,
  getWeekdayHeaders,
} from "@/lib/date";
import { eventTypes } from "@/data/data";
import type { CalendarEvent } from "@/types";

interface MonthCalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  events: CalendarEvent[];
  /** Fecha de hoy, o null mientras no se conoce en el navegador. */
  hoy: string | null;
}

interface DayCell {
  iso: string;
  dayNumber: number;
  inCurrentMonth: boolean;
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildCalendarGrid(year: number, month: number): DayCell[] {
  const total = daysInMonth(year, month);
  const firstWeekday = firstWeekdayOfMonth(year, month);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevTotal = daysInMonth(prevYear, prevMonth);

  const cells: DayCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = prevTotal - i;
    cells.push({ iso: toISO(prevYear, prevMonth, day), dayNumber: day, inCurrentMonth: false });
  }

  for (let day = 1; day <= total; day++) {
    cells.push({ iso: toISO(year, month, day), dayNumber: day, inCurrentMonth: true });
  }

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      iso: toISO(nextYear, nextMonth, nextDay),
      dayNumber: nextDay,
      inCurrentMonth: false,
    });
    nextDay++;
  }

  return cells;
}

export default function MonthCalendar({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  selectedDate,
  onSelectDate,
  events,
  hoy,
}: MonthCalendarProps) {
  const cells = buildCalendarGrid(year, month);
  const weekdays = getWeekdayHeaders();

  // Los días con eventos llevan un punto del color de su tipo.
  const coloresPorDia = new Map<string, Set<string>>();
  events.forEach((event) => {
    const colores = coloresPorDia.get(event.date) ?? new Set<string>();
    const info = eventTypes.find((t) => t.value === event.type);
    if (info) colores.add(info.color);
    coloresPorDia.set(event.date, colores);
  });

  return (
    <div className="rounded-3xl bg-blanco p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-titulos text-xl font-semibold text-texto">
          {getMonthLabel(year, month)}
        </h4>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className="min-h-12 rounded-full border border-texto/20 px-5 text-base font-semibold text-texto transition hover:bg-crema"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Mes anterior"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-texto/20 text-texto transition hover:bg-crema"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Mes siguiente"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-texto/20 text-texto transition hover:bg-crema"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center text-sm font-semibold text-texto-suave">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const colores = Array.from(coloresPorDia.get(cell.iso) ?? []);
          const elegido = selectedDate === cell.iso;
          const esHoy = hoy === cell.iso;
          const tieneEventos = colores.length > 0;

          return (
            <button
              key={cell.iso}
              type="button"
              disabled={!cell.inCurrentMonth}
              onClick={() => onSelectDate(cell.iso)}
              aria-pressed={elegido}
              aria-label={
                tieneEventos
                  ? `${cell.dayNumber}, con eventos`
                  : `${cell.dayNumber}, sin eventos`
              }
              className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-base transition ${
                cell.inCurrentMonth ? "text-texto hover:bg-crema" : "text-texto-suave/35"
              } ${elegido ? "bg-verde-bosque text-blanco hover:bg-verde-bosque" : ""} ${
                esHoy && !elegido ? "ring-2 ring-rosa ring-inset font-bold" : ""
              }`}
            >
              {cell.dayNumber}
              <span className="flex h-1.5 gap-0.5">
                {colores.slice(0, 3).map((color) => (
                  <span
                    key={color}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: elegido ? "#FFFFFF" : color }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-texto/10 pt-4">
        {eventTypes.map((type) => (
          <span key={type.value} className="flex items-center gap-1.5 text-sm text-texto-suave">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: type.color }}
              aria-hidden="true"
            />
            {type.label}
          </span>
        ))}
      </div>
    </div>
  );
}
