"use client";

import {
  Search,
  MapPin,
  LayoutGrid,
  Leaf,
  ShoppingBasket,
  BarChart3,
  HandHeart,
  Palette,
  Bus,
  Shirt,
  Gift,
  BookOpen,
  UtensilsCrossed,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { localidades } from "@/data/data";
import type { CommunityCategory, ProductType, Localidad } from "@/types";

const CATEGORY_OPTIONS: { value: CommunityCategory | "Todas"; label: string; icon: typeof Leaf }[] = [
  { value: "Todas", label: "Todas las categorías", icon: LayoutGrid },
  { value: "Comunidades rurales", label: "Comunidades rurales", icon: Leaf },
  { value: "Productoras", label: "Productoras", icon: ShoppingBasket },
  { value: "Emprendimientos", label: "Emprendimientos", icon: BarChart3 },
  { value: "Servicios de apoyo", label: "Servicios de apoyo", icon: HandHeart },
];

const PRODUCT_TYPE_OPTIONS: { value: ProductType | "Todas"; label: string; icon: typeof Leaf }[] = [
  { value: "Todas", label: "Todas las categorías", icon: LayoutGrid },
  { value: "Artesanías", label: "Artesanías", icon: Palette },
  { value: "Turismo rural", label: "Turismo rural", icon: Bus },
  { value: "Ropa y textiles", label: "Ropa y textiles", icon: Shirt },
  { value: "Souvenirs", label: "Souvenirs", icon: Gift },
  { value: "Educación y formación", label: "Educación y formación", icon: BookOpen },
  { value: "Gastronomía", label: "Gastronomía", icon: UtensilsCrossed },
  { value: "Otros", label: "Otros", icon: MoreHorizontal },
];

interface MapFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  category: CommunityCategory | "Todas";
  onCategoryChange: (value: CommunityCategory | "Todas") => void;
  productType: ProductType | "Todas";
  onProductTypeChange: (value: ProductType | "Todas") => void;
  localidad: Localidad | "Todas";
  onLocalidadChange: (value: Localidad | "Todas") => void;
  onClear: () => void;
  alwaysOpen: boolean;
}

// En pantallas pequeñas cada grupo es un panel desplegable; en escritorio siempre está abierto.
function FilterGroup({
  title,
  alwaysOpen,
  children,
}: {
  title: string;
  alwaysOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={alwaysOpen || undefined} className="group mt-5 border-t border-texto/15 pt-4">
      <summary
        onClick={alwaysOpen ? (event) => event.preventDefault() : undefined}
        className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-texto xl:min-h-0 xl:cursor-default [&::-webkit-details-marker]:hidden"
      >
        {title}
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform group-open:rotate-180 xl:hidden"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </details>
  );
}

export default function MapFilters({
  searchTerm,
  onSearchTermChange,
  category,
  onCategoryChange,
  productType,
  onProductTypeChange,
  localidad,
  onLocalidadChange,
  onClear,
  alwaysOpen,
}: MapFiltersProps) {
  return (
    <div className="p-5 xl:p-6">
      <h3 className="font-titulos text-lg font-bold uppercase tracking-wide text-texto">
        Explora el territorio
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-texto-suave">
        Descubre iniciativas, productos y comunidades de mujeres que transforman Bogotá y
        Cundinamarca.
      </p>

      <div className="mt-5 flex min-h-11 items-center gap-2 rounded-lg border border-texto/60 bg-crema px-3 py-2">
        <Search size={16} className="shrink-0 text-texto-suave" aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Buscar una comunidad, producto o lugar"
          aria-label="Buscar una comunidad, producto o lugar"
          className="w-full min-w-0 bg-transparent text-sm text-texto placeholder:text-texto-suave focus:outline-none"
        />
      </div>

      <FilterGroup title="Filtrar por categoría" alwaysOpen={alwaysOpen}>
        {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onCategoryChange(value)}
            data-active={category === value}
            aria-pressed={category === value}
            className="map-filter"
          >
            <Icon size={16} className="shrink-0" aria-hidden="true" />
            {label}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Filtrar por tipo de producto o servicio" alwaysOpen={alwaysOpen}>
        {PRODUCT_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onProductTypeChange(value)}
            data-active={productType === value}
            aria-pressed={productType === value}
            className="map-filter"
          >
            <Icon size={16} className="shrink-0" aria-hidden="true" />
            {label}
          </button>
        ))}
      </FilterGroup>

      <div className="mt-5 border-t border-texto/15 pt-4">
        <label htmlFor="map-localidad" className="field-label">
          Filtrar por localidad
        </label>
        <div className="flex min-h-11 items-center gap-2 rounded-lg border border-texto/60 bg-crema px-3 py-2">
          <MapPin size={16} className="shrink-0 text-texto-suave" aria-hidden="true" />
          <select
            id="map-localidad"
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

      <button type="button" onClick={onClear} className="btn-secondary mt-6 w-full">
        Limpiar filtros
      </button>
    </div>
  );
}
