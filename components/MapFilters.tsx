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
}: MapFiltersProps) {
  return (
    <div className="card p-6">
      <h3 className="font-titulos text-2xl text-texto">Explora el territorio</h3>
      <p className="mt-2 text-sm leading-relaxed text-texto-suave">
        Descubre iniciativas, productos y comunidades de mujeres que transforman Bogotá y
        Cundinamarca.
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2.5">
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

      <fieldset className="mt-6">
        <legend className="field-label">Filtrar por categoría</legend>
        <div className="flex flex-col gap-2">
          {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onCategoryChange(value)}
              data-active={category === value}
              className="pill-filter"
            >
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="field-label">Filtrar por tipo de producto o servicio</legend>
        <div className="flex flex-col gap-2">
          {PRODUCT_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onProductTypeChange(value)}
              data-active={productType === value}
              className="pill-filter"
            >
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="map-localidad" className="field-label">
          Filtrar por localidad
        </label>
        <div className="flex items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2.5">
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
