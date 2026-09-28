"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import SectionHeading from "./SectionHeading";
import EventFilters from "./EventFilters";
import MonthCalendar from "./MonthCalendar";
import EventCard from "./EventCard";
import EventListRow from "./EventListRow";
import EventModal from "./EventModal";
import LeafDecoration from "./LeafDecoration";
import { calendarEvents } from "@/data/data";
import { compareISODates, parseISODate } from "@/lib/date";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { CalendarEvent, EventType, Localidad, Organizer } from "@/types";

const sortedByDateAsc = [...calendarEvents].sort((a, b) => compareISODates(a.date, b.date));
const nearestEvent = sortedByDateAsc[0];
const initialMonth = nearestEvent ? parseISODate(nearestEvent.date) : parseISODate("2026-01-01");

export default function CalendarSection() {
  const isXl = useMediaQuery("(min-width: 1280px)");
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

  // Desde xl se ven 2 tarjetas destacadas; por debajo, 1.
  const featuredVisible = isXl ? 2 : 1;
  const maxFeaturedIndex = Math.max(0, sortedByDateAsc.length - featuredVisible);
  const currentFeaturedIndex = Math.min(featuredIndex, maxFeaturedIndex);
  const featuredEvents = sortedByDateAsc.slice(
    currentFeaturedIndex,
    currentFeaturedIndex + featuredVisible
  );
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
    <section id="calendario" className="bg-crema py-20 sm:py-24">
      <div className="container-page">
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
      </div>

      <div className="container-page mt-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-texto/10 bg-blanco p-6 xl:p-8">
          <LeafDecoration className="pointer-events-none absolute -left-6 -top-6 -z-10 h-24 w-24 -rotate-12 opacity-40" />
          <LeafDecoration className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-28 w-28 rotate-90 opacity-40" />

          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[260px_340px_minmax(0,1fr)]">
            <div className="lg:col-span-2 xl:col-span-1">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen((v) => !v)}
                className="btn-secondary w-full justify-between lg:hidden"
                aria-expanded={isMobileFiltersOpen}
                aria-controls="calendario-filtros"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Filtros
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isMobileFiltersOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id="calendario-filtros"
                className={`h-full ${isMobileFiltersOpen ? "mt-4 lg:mt-0" : "hidden"} lg:block`}
              >
                {filtersPanel}
              </div>
            </div>

            <MonthCalendar
              year={year}
              month={month}
              onPrevMonth={goToPrevMonth}
              onNextMonth={goToNextMonth}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              events={filteredEvents}
            />

            <div className="flex h-full min-w-0 flex-col rounded-2xl bg-crema p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-titulos text-lg text-texto">Eventos destacados</h4>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setFeaturedIndex(Math.max(0, currentFeaturedIndex - 1))}
                    disabled={currentFeaturedIndex === 0}
                    aria-label="Eventos destacados anteriores"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-texto transition hover:bg-blanco disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIndex(Math.min(maxFeaturedIndex, currentFeaturedIndex + 1))
                    }
                    disabled={currentFeaturedIndex >= maxFeaturedIndex}
                    aria-label="Siguientes eventos destacados"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-texto transition hover:bg-blanco disabled:opacity-30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid flex-1 grid-cols-1 gap-3 xl:grid-cols-2">
                {featuredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onOpen={() => setSelectedEventId(event.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-texto/10 pt-8">
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

            {listEvents.length > 0 ? (
              <ul className="mt-4 divide-y divide-texto/10">
                {listEvents.map((event) => (
                  <li key={event.id}>
                    <EventListRow event={event} onOpen={() => setSelectedEventId(event.id)} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-texto/20 p-8 text-center">
                <p className="text-sm text-texto-suave">No hay actividades con estos filtros</p>
                {hasActiveFilters ? (
                  <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
                    Limpiar filtros
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-end justify-end gap-2">
            <p className="script-text script-text--sm text-right text-verde-bosque">
              Más mujeres
              <br />
              Más territorio
              <br />
              Más oportunidades
            </p>
            <LeafDecoration className="h-10 w-10 shrink-0 opacity-80" />
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
