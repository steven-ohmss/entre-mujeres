"use client";

import { Search, MapPin } from "lucide-react";
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

// Filas compactas: en xl cada columna mide ~110px, así que el texto puede partirse.
const CHECKBOX_ROW =
  "flex min-h-11 items-center gap-1.5 rounded-lg bg-blanco px-1.5 py-1 text-xs leading-tight text-texto hyphens-auto [overflow-wrap:anywhere] xl:min-h-10";

// En xl es una columna angosta; entre lg y xl se reparte en 3 columnas a todo el ancho.
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
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-crema p-5 lg:grid lg:grid-cols-3 lg:gap-x-6 xl:flex xl:gap-3 xl:p-4">
      <div className="flex flex-col gap-3">
        <h3 className="font-titulos text-lg text-texto">Filtrar eventos</h3>

        <div>
          <label htmlFor="event-keyword" className="field-label">
            Buscar por palabra clave
          </label>
          <div className="flex min-h-11 items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2 xl:min-h-10">
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

        <div>
          <label htmlFor="event-localidad" className="field-label">
            Filtrar por localidad
          </label>
          <div className="flex min-h-11 items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2 xl:min-h-10">
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
      </div>

      <fieldset>
        <legend className="field-label">Tipo de evento</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {eventTypes.map((type) => (
            <label key={type.value} className={CHECKBOX_ROW}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.value)}
                onChange={() => onToggleType(type.value)}
                className="h-4 w-4 shrink-0 accent-verde-hoja"
              />
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: type.color }}
                aria-hidden="true"
              />
              <span className="min-w-0">{type.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 xl:flex-1">
        <fieldset>
          <legend className="field-label">Organiza</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {organizers.map((organizer) => (
              <label key={organizer} className={CHECKBOX_ROW}>
                <input
                  type="checkbox"
                  checked={selectedOrganizers.includes(organizer)}
                  onChange={() => onToggleOrganizer(organizer)}
                  className="h-4 w-4 shrink-0 accent-verde-hoja"
                />
                <span className="min-w-0">{organizer}</span>
              </label>
            ))}
            <label className={CHECKBOX_ROW}>
              <input
                type="checkbox"
                checked={selectedOrganizers.length === 0}
                onChange={onSelectAllOrganizers}
                className="h-4 w-4 shrink-0 accent-verde-hoja"
              />
              <span className="min-w-0">Todos</span>
            </label>
          </div>
        </fieldset>

        <button type="button" onClick={onClear} className="btn-secondary w-full xl:mt-auto">
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
