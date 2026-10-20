"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import SectionHeading from "./SectionHeading";
import EventFilters from "./EventFilters";
import MonthCalendar from "./MonthCalendar";
import EventListRow from "./EventListRow";
import EventModal from "./EventModal";
import LeafDecoration from "./LeafDecoration";
import { calendarEvents } from "@/data/data";
import { compareISODates, formatEventDate, parseISODate } from "@/lib/date";
import { useHoy } from "@/lib/hoy";
import type { CalendarEvent, EventType, Localidad, Organizer } from "@/types";

const ordenadosPorFecha = [...calendarEvents].sort((a, b) => compareISODates(a.date, b.date));

/**
 * Calendario (4.6).
 *
 * Fuera "Eventos destacados", que repetía lo mismo que la lista de abajo. En su lugar
 * manda lo que la gente viene a averiguar: cuál es el próximo evento, calculado desde hoy.
 * Los que ya pasaron no se muestran.
 */
export default function CalendarSection() {
  const hoy = useHoy();

  const [localidad, setLocalidad] = useState<Localidad | "Todas">("Todas");
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState<Organizer[]>([]);
  const [diaElegido, setDiaElegido] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Mientras no se conoce la fecha se encuadra el mes del primer evento; al resolverse,
  // el mes actual.
  const mesInicial = parseISODate(hoy ?? ordenadosPorFecha[0]?.date ?? "2026-01-01");
  const [mesManual, setMesManual] = useState<{ year: number; month: number } | null>(null);
  const mesVisible = mesManual ?? { year: mesInicial.year, month: mesInicial.month };

  /** Eventos que todavía no han pasado. Antes de montar se muestran todos. */
  const proximos = useMemo(
    () => ordenadosPorFecha.filter((e) => (hoy ? compareISODates(e.date, hoy) >= 0 : true)),
    [hoy]
  );

  const filtrados = useMemo(() => {
    const termino = keyword.trim().toLowerCase();
    return proximos.filter((event) => {
      const coincideTexto =
        termino.length === 0 ||
        event.title.toLowerCase().includes(termino) ||
        event.description.toLowerCase().includes(termino);
      const coincideLocalidad = localidad === "Todas" || event.localidad === localidad;
      const coincideTipo = selectedTypes.length === 0 || selectedTypes.includes(event.type);
      const coincideOrganiza =
        selectedOrganizers.length === 0 || selectedOrganizers.includes(event.organizer);
      return coincideTexto && coincideLocalidad && coincideTipo && coincideOrganiza;
    });
  }, [keyword, localidad, proximos, selectedOrganizers, selectedTypes]);

  // Al tocar un día, la lista muestra solo los eventos de ese día.
  const lista = useMemo(
    () => (diaElegido ? filtrados.filter((e) => e.date === diaElegido) : filtrados),
    [diaElegido, filtrados]
  );

  const proximoEvento = filtrados[0] ?? null;
  const eventoAbierto: CalendarEvent | null =
    calendarEvents.find((e) => e.id === selectedEventId) ?? null;

  const hayFiltros =
    keyword.trim().length > 0 ||
    localidad !== "Todas" ||
    selectedTypes.length > 0 ||
    selectedOrganizers.length > 0 ||
    diaElegido !== null;

  const limpiarFiltros = () => {
    setKeyword("");
    setLocalidad("Todas");
    setSelectedTypes([]);
    setSelectedOrganizers([]);
    setDiaElegido(null);
  };

  // El mes puede no haberse tocado todavía (mesManual en null); ahí se parte del visible.
  const irAlMesAnterior = () =>
    setMesManual((prev) => {
      const { year, month } = prev ?? mesVisible;
      return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
    });

  const irAlMesSiguiente = () =>
    setMesManual((prev) => {
      const { year, month } = prev ?? mesVisible;
      return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
    });

  const irAHoy = () => {
    const referencia = parseISODate(hoy ?? ordenadosPorFecha[0]?.date ?? "2026-01-01");
    setMesManual({ year: referencia.year, month: referencia.month });
    setDiaElegido(null);
  };

  const panelFiltros = (
    <EventFilters
      keyword={keyword}
      onKeywordChange={setKeyword}
      localidad={localidad}
      onLocalidadChange={setLocalidad}
      selectedTypes={selectedTypes}
      onToggleType={(tipo) =>
        setSelectedTypes((prev) =>
          prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
        )
      }
      selectedOrganizers={selectedOrganizers}
      onToggleOrganizer={(quien) =>
        setSelectedOrganizers((prev) =>
          prev.includes(quien) ? prev.filter((o) => o !== quien) : [...prev, quien]
        )
      }
      onSelectAllOrganizers={() => setSelectedOrganizers([])}
      onClear={limpiarFiltros}
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

        {/* Lo primero que se ve, y en celular va antes que la grilla: cuál es el próximo. */}
        {proximoEvento ? (
          <button
            type="button"
            onClick={() => setSelectedEventId(proximoEvento.id)}
            className="mt-8 flex w-full flex-wrap items-center gap-x-5 gap-y-2 rounded-3xl bg-verde-bosque p-6 text-left text-crema transition hover:bg-verde-bosque-oscuro sm:p-7"
          >
            <CalendarCheck size={34} className="shrink-0 text-rosa-claro" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-base uppercase tracking-widest text-crema/75">
                El próximo evento
              </span>
              <span className="mt-1 block font-titulos text-2xl font-semibold sm:text-3xl">
                {proximoEvento.title}
              </span>
              <span className="mt-1 block text-lg text-crema/90">
                {formatEventDate(proximoEvento.date)} · {proximoEvento.startTime} ·{" "}
                {proximoEvento.location}
              </span>
            </span>
            <span className="text-lg font-semibold text-rosa-claro">Ver →</span>
          </button>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            className="btn-secondary"
            aria-expanded={filtrosAbiertos}
            aria-controls="calendario-filtros"
          >
            <SlidersHorizontal size={19} aria-hidden="true" />
            Filtros
            <ChevronDown
              size={19}
              className={`transition-transform ${filtrosAbiertos ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {hayFiltros ? (
            <button type="button" onClick={limpiarFiltros} className="btn-secondary">
              <X size={19} aria-hidden="true" />
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {filtrosAbiertos ? (
          <div id="calendario-filtros" className="mt-5 rounded-3xl bg-blanco p-5 sm:p-6">
            {panelFiltros}
          </div>
        ) : null}

        {/* En celular la lista va primero; desde lg la grilla se pone al lado. */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-titulos text-2xl font-semibold text-texto">
                {diaElegido ? `Eventos del ${formatEventDate(diaElegido)}` : "Próximos eventos"}
              </h3>
              {diaElegido ? (
                <button
                  type="button"
                  onClick={() => setDiaElegido(null)}
                  className="min-h-12 text-base font-semibold text-rosa-oscuro hover:underline"
                >
                  Ver todos
                </button>
              ) : null}
            </div>

            {lista.length > 0 ? (
              <ul className="mt-4 divide-y divide-texto/10">
                {lista.map((event) => (
                  <li key={event.id}>
                    <EventListRow event={event} onOpen={() => setSelectedEventId(event.id)} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-texto/25 p-8 text-center">
                <p className="text-base text-texto-suave">
                  {diaElegido
                    ? "Ese día no hay nada programado."
                    : "No hay eventos próximos con estos filtros."}
                </p>
                {hayFiltros ? (
                  <button type="button" onClick={limpiarFiltros} className="btn-secondary mt-4">
                    Limpiar filtros
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <MonthCalendar
              year={mesVisible.year}
              month={mesVisible.month}
              onPrevMonth={irAlMesAnterior}
              onNextMonth={irAlMesSiguiente}
              onToday={irAHoy}
              selectedDate={diaElegido}
              onSelectDate={(fecha) => setDiaElegido((prev) => (prev === fecha ? null : fecha))}
              events={filtrados}
              hoy={hoy}
            />
          </div>
        </div>
      </div>

      <EventModal
        event={eventoAbierto}
        isOpen={Boolean(eventoAbierto)}
        onClose={() => setSelectedEventId(null)}
      />
    </section>
  );
}
