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
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  events: CalendarEvent[];
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
  selectedDate,
  onSelectDate,
  events,
}: MonthCalendarProps) {
  const cells = buildCalendarGrid(year, month);
  const weekdays = getWeekdayHeaders();

  const eventsByDate = new Map<string, Set<string>>();
  events.forEach((event) => {
    const colors = eventsByDate.get(event.date) ?? new Set<string>();
    const typeInfo = eventTypes.find((t) => t.value === event.type);
    if (typeInfo) colors.add(typeInfo.color);
    eventsByDate.set(event.date, colors);
  });

  return (
    <div className="flex h-full flex-col rounded-2xl bg-crema p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-titulos text-lg text-texto">{getMonthLabel(year, month)}</h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Mes anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-texto transition hover:bg-blanco"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Mes siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-texto transition hover:bg-blanco"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-texto-suave">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mb-5 mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const colors = Array.from(eventsByDate.get(cell.iso) ?? []);
          const isSelected = selectedDate === cell.iso;
          return (
            <button
              key={cell.iso}
              type="button"
              disabled={!cell.inCurrentMonth}
              onClick={() => onSelectDate(cell.iso)}
              className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-full text-sm transition ${
                cell.inCurrentMonth ? "text-texto hover:bg-blanco" : "text-texto-suave/40"
              } ${isSelected ? "bg-verde-bosque text-blanco hover:bg-verde-bosque" : ""}`}
            >
              {cell.dayNumber}
              <span className="flex h-1.5 gap-0.5">
                {colors.slice(0, 3).map((color) => (
                  <span
                    key={color}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: isSelected ? "#FFFFFF" : color }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-texto/10 pt-4">
        {eventTypes.map((type) => (
          <span key={type.value} className="flex items-center gap-1.5 text-xs text-texto-suave">
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
