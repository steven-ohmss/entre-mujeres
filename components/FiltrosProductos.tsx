"use client";

import { MapPin, Users, X } from "lucide-react";
import { communityCategories, localidades, productTypes } from "@/data/data";
import { ICONO_PRODUCTO, ICONO_TODAS } from "@/lib/categorias";
import type { CommunityCategory, Localidad, ProductType } from "@/types";

export interface EstadoFiltros {
  categoria: ProductType | "Todas";
  localidad: Localidad | "Todas";
  tipoComunidad: CommunityCategory | "Todas";
  texto: string;
}

interface FiltrosProductosProps {
  filtros: EstadoFiltros;
  onCategoria: (valor: ProductType | "Todas") => void;
  onLocalidad: (valor: Localidad | "Todas") => void;
  onTipoComunidad: (valor: CommunityCategory | "Todas") => void;
  onLimpiarTexto: () => void;
  onLimpiarTodo: () => void;
  hayFiltros: boolean;
}

/**
 * Filtros de la pestaña Productos (4.4.2).
 *
 * Las categorías son botones horizontales con icono y no una lista vertical: la lista
 * ocupaba casi toda la altura de la pantalla antes de dejar ver un solo producto.
 */
export default function FiltrosProductos({
  filtros,
  onCategoria,
  onLocalidad,
  onTipoComunidad,
  onLimpiarTexto,
  onLimpiarTodo,
  hayFiltros,
}: FiltrosProductosProps) {
  return (
    <div className="flex flex-col gap-6">
      {filtros.texto ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg text-texto">
            Resultados para <strong>“{filtros.texto}”</strong>
          </p>
          <button
            type="button"
            onClick={onLimpiarTexto}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-texto/25 px-5 text-base font-semibold text-texto transition hover:bg-blanco"
          >
            <X size={18} aria-hidden="true" />
            Quitar el filtro
          </button>
        </div>
      ) : null}

      <div>
        <h2 className="field-label">Categoría</h2>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onCategoria("Todas")}
            data-active={filtros.categoria === "Todas"}
            aria-pressed={filtros.categoria === "Todas"}
            className="pill-filter"
          >
            <ICONO_TODAS size={19} className="shrink-0" aria-hidden="true" />
            Todas
          </button>

          {productTypes.map((categoria) => {
            const Icono = ICONO_PRODUCTO[categoria];
            return (
              <button
                key={categoria}
                type="button"
                onClick={() => onCategoria(categoria)}
                data-active={filtros.categoria === categoria}
                aria-pressed={filtros.categoria === categoria}
                className="pill-filter"
              >
                <Icono size={19} className="shrink-0" aria-hidden="true" />
                {categoria}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <div className="min-w-[240px] flex-1">
          <label htmlFor="filtro-localidad" className="field-label">
            Localidad
          </label>
          <div className="flex min-h-12 items-center gap-2 rounded-full border border-texto/20 bg-blanco px-4">
            <MapPin size={19} className="shrink-0 text-texto-suave" aria-hidden="true" />
            <select
              id="filtro-localidad"
              value={filtros.localidad}
              onChange={(e) => onLocalidad(e.target.value as Localidad | "Todas")}
              className="w-full min-w-0 bg-transparent py-3 text-base text-texto focus:outline-none"
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

        <div className="min-w-[240px] flex-1">
          <label htmlFor="filtro-tipo-comunidad" className="field-label">
            Tipo de comunidad
          </label>
          <div className="flex min-h-12 items-center gap-2 rounded-full border border-texto/20 bg-blanco px-4">
            <Users size={19} className="shrink-0 text-texto-suave" aria-hidden="true" />
            <select
              id="filtro-tipo-comunidad"
              value={filtros.tipoComunidad}
              onChange={(e) => onTipoComunidad(e.target.value as CommunityCategory | "Todas")}
              className="w-full min-w-0 bg-transparent py-3 text-base text-texto focus:outline-none"
            >
              <option value="Todas">Todos los tipos</option>
              {communityCategories.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {hayFiltros ? (
        <button type="button" onClick={onLimpiarTodo} className="btn-secondary self-start">
          <X size={18} aria-hidden="true" />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
