"use client";

import { Search, MapPin } from "lucide-react";
import LeafDecoration from "./LeafDecoration";
import { localidades, eventTypes, organizers } from "@/data/data";
import type { EventType, Localidad, Organizer } from "@/types";

interface EventFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  localidad: Localidad | "Todas";
  onLocalidadChange: (value: Localidad | "Todas") => void;
  selectedTypes: EventType[];
  onToggleType: (type: EventType) => void;
  selectedOrganizers: Organizer[];
  onToggleOrganizer: (organizer: Organizer) => void;
  onSelectAllOrganizers: () => void;
  onClear: () => void;
}

export default function EventFilters({
  keyword,
  onKeywordChange,
  localidad,
  onLocalidadChange,
  selectedTypes,
  onToggleType,
  selectedOrganizers,
  onToggleOrganizer,
  onSelectAllOrganizers,
  onClear,
}: EventFiltersProps) {
  return (
    <div className="card relative overflow-hidden p-6">
      <h3 className="font-serif text-xl text-texto">Filtrar eventos</h3>

      <div className="mt-5">
        <label htmlFor="event-keyword" className="field-label">
          Buscar por palabra clave
        </label>
        <div className="flex items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2.5">
          <Search size={16} className="shrink-0 text-texto-suave" aria-hidden="true" />
          <input
            id="event-keyword"
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Ej. feria, taller, reunión..."
            className="w-full min-w-0 bg-transparent text-sm text-texto placeholder:text-texto-suave focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="event-localidad" className="field-label">
          Filtrar por localidad
        </label>
        <div className="flex items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2.5">
          <MapPin size={16} className="shrink-0 text-texto-suave" aria-hidden="true" />
          <select
            id="event-localidad"
            value={localidad}
            onChange={(event) => onLocalidadChange(event.target.value as Localidad | "Todas")}
            className="w-full min-w-0 bg-transparent text-sm text-texto focus:outline-none"
          >
            <option value="Todas">Todas las localidades</option>
            {localidades.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="field-label">Tipo de evento</legend>
        <div className="flex flex-col gap-2">
          {eventTypes.map((type) => (
            <label
              key={type.value}
              className="flex min-h-11 items-center gap-2.5 rounded-xl border border-texto/10 px-3 py-2 text-sm text-texto"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.value)}
                onChange={() => onToggleType(type.value)}
                className="h-4 w-4 accent-verde-hoja"
              />
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: type.color }}
                aria-hidden="true"
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="field-label">Organiza</legend>
        <div className="flex flex-col gap-2">
          {organizers.map((organizer) => (
            <label
              key={organizer}
              className="flex min-h-11 items-center gap-2.5 rounded-xl border border-texto/10 px-3 py-2 text-sm text-texto"
            >
              <input
                type="checkbox"
                checked={selectedOrganizers.includes(organizer)}
                onChange={() => onToggleOrganizer(organizer)}
                className="h-4 w-4 accent-verde-hoja"
              />
              {organizer}
            </label>
          ))}
          <label className="flex min-h-11 items-center gap-2.5 rounded-xl border border-texto/10 px-3 py-2 text-sm text-texto">
            <input
              type="checkbox"
              checked={selectedOrganizers.length === 0}
              onChange={onSelectAllOrganizers}
              className="h-4 w-4 accent-verde-hoja"
            />
            Todos
          </label>
        </div>
      </fieldset>

      <button type="button" onClick={onClear} className="btn-secondary mt-6 w-full">
        Limpiar filtros
      </button>

      <div className="mt-8 flex items-end justify-between gap-3">
        <p className="script-text text-verde-bosque">
          Más mujeres
          <br />
          Más territorio
          <br />
          Más oportunidades
        </p>
        <LeafDecoration className="h-16 w-16 shrink-0 opacity-80" />
      </div>
    </div>
  );
}
