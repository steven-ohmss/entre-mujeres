"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import SectionHeading from "./SectionHeading";
import EventFilters from "./EventFilters";
import MonthCalendar from "./MonthCalendar";
import EventCard from "./EventCard";
import EventListRow from "./EventListRow";
import EventModal from "./EventModal";
import LeafDecoration from "./LeafDecoration";
import { calendarEvents } from "@/data/data";
import { compareISODates, parseISODate } from "@/lib/date";
import type { CalendarEvent, EventType, Localidad, Organizer } from "@/types";

const sortedByDateAsc = [...calendarEvents].sort((a, b) => compareISODates(a.date, b.date));
const nearestEvent = sortedByDateAsc[0];
const initialMonth = nearestEvent ? parseISODate(nearestEvent.date) : parseISODate("2026-01-01");

export default function CalendarSection() {
  const [keyword, setKeyword] = useState("");
  const [localidad, setLocalidad] = useState<Localidad | "Todas">("Todas");
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState<Organizer[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [year, setYear] = useState(initialMonth.year);
  const [month, setMonth] = useState(initialMonth.month);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return calendarEvents.filter((event) => {
      const matchesKeyword =
        term.length === 0 ||
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term);
      const matchesLocalidad = localidad === "Todas" || event.localidad === localidad;
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type);
      const matchesOrganizer =
        selectedOrganizers.length === 0 || selectedOrganizers.includes(event.organizer);
      return matchesKeyword && matchesLocalidad && matchesType && matchesOrganizer;
    });
  }, [keyword, localidad, selectedTypes, selectedOrganizers]);

  const listEvents = useMemo(() => {
    const withDate = selectedDate
      ? filteredEvents.filter((event) => event.date === selectedDate)
      : filteredEvents;
    return [...withDate].sort((a, b) =>
      sortOrder === "asc" ? compareISODates(a.date, b.date) : compareISODates(b.date, a.date)
    );
  }, [filteredEvents, selectedDate, sortOrder]);

  const featuredPair = sortedByDateAsc.slice(featuredIndex, featuredIndex + 2);
  const selectedEvent: CalendarEvent | null =
    calendarEvents.find((event) => event.id === selectedEventId) ?? null;

  const hasActiveFilters =
    keyword.trim().length > 0 ||
    localidad !== "Todas" ||
    selectedTypes.length > 0 ||
    selectedOrganizers.length > 0 ||
    selectedDate !== null;

  const clearFilters = () => {
    setKeyword("");
    setLocalidad("Todas");
    setSelectedTypes([]);
    setSelectedOrganizers([]);
    setSelectedDate(null);
  };

  const toggleType = (type: EventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleOrganizer = (organizer: Organizer) => {
    setSelectedOrganizers((prev) =>
      prev.includes(organizer) ? prev.filter((o) => o !== organizer) : [...prev, organizer]
    );
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const goToPrevMonth = () => {
    setMonth((prev) => {
      if (prev === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setMonth((prev) => {
      if (prev === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };

  const filtersPanel = (
    <EventFilters
      keyword={keyword}
      onKeywordChange={setKeyword}
      localidad={localidad}
      onLocalidadChange={setLocalidad}
      selectedTypes={selectedTypes}
      onToggleType={toggleType}
      selectedOrganizers={selectedOrganizers}
      onToggleOrganizer={toggleOrganizer}
      onSelectAllOrganizers={() => setSelectedOrganizers([])}
      onClear={clearFilters}
    />
  );

  return (
    <section id="calendario" className="relative overflow-hidden bg-crema py-20 sm:py-24">
      <LeafDecoration className="pointer-events-none absolute -left-6 top-10 h-24 w-24 -rotate-12 opacity-60" />
      <LeafDecoration className="pointer-events-none absolute -right-8 bottom-10 h-28 w-28 rotate-90 opacity-50" />

      <div className="container-page">
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen((v) => !v)}
            className="btn-secondary w-full justify-between"
            aria-expanded={isMobileFiltersOpen}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filtros
            </span>
          </button>
          {isMobileFiltersOpen ? <div className="mt-4">{filtersPanel}</div> : null}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_3fr]">
          <div className="hidden lg:block">{filtersPanel}</div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <SectionHeading
                title="Calendario"
                subtitle="Próximas ferias, eventos y actividades"
                description="Conoce y participa en los eventos, ferias, encuentros y actividades de Red Mujer y otras iniciativas de mujeres en Bogotá y Cundinamarca."
              />
              <p className="script-text flex items-center gap-2 text-verde-bosque">
                Nos encontramos en el territorio
                <LeafDecoration className="h-8 w-8" />
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <MonthCalendar
                year={year}
                month={month}
                onPrevMonth={goToPrevMonth}
                onNextMonth={goToNextMonth}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                events={filteredEvents}
              />

              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-titulos text-lg text-texto">Eventos destacados</h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFeaturedIndex((prev) => Math.max(0, prev - 1))}
                      disabled={featuredIndex === 0}
                      aria-label="Eventos destacados anteriores"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-texto transition hover:bg-crema disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFeaturedIndex((prev) =>
                          Math.min(sortedByDateAsc.length - 2, prev + 1)
                        )
                      }
                      disabled={featuredIndex >= sortedByDateAsc.length - 2}
                      aria-label="Siguientes eventos destacados"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-texto transition hover:bg-crema disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {featuredPair.map((event, index) => (
                    <div key={event.id} className={index === 1 ? "hidden sm:block" : ""}>
                      <EventCard event={event} onOpen={() => setSelectedEventId(event.id)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-titulos text-xl text-texto">Próximos eventos</h4>
                <label className="flex items-center gap-2 text-sm text-texto-suave">
                  Ordenar por:
                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value as "asc" | "desc")}
                    className="rounded-full border border-texto/15 bg-blanco px-3 py-2 text-sm text-texto focus:outline-none"
                  >
                    <option value="asc">Fecha (más próximos)</option>
                    <option value="desc">Fecha (más lejanos)</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 space-y-3">
                {listEvents.map((event) => (
                  <EventListRow
                    key={event.id}
                    event={event}
                    onOpen={() => setSelectedEventId(event.id)}
                  />
                ))}
              </div>

              {listEvents.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-texto/20 p-8 text-center">
                  <p className="text-sm text-texto-suave">No hay actividades con estos filtros</p>
                  {hasActiveFilters ? (
                    <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
                      Limpiar filtros
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEventId(null)}
      />
    </section>
  );
}
