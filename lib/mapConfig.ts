import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";

// Teselas del mapa base. Se pueden cambiar sin tocar código con las variables
// NEXT_PUBLIC_MAP_TILE_URL y NEXT_PUBLIC_MAP_TILE_ATTRIBUTION (ver README).
export const MAP_TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MAP_CENTER: LatLngTuple = [4.6, -74.1];
export const MAP_ZOOM = 10;
export const MAP_MIN_ZOOM = 8;
export const MAP_MAX_ZOOM = 18;

// Límites aproximados de Cundinamarca, para que no se pierdan navegando.
export const MAP_MAX_BOUNDS: LatLngBoundsExpression = [
  [3.6, -75.0],
  [5.95, -72.9],
];

export const LOCALIDADES_GEOJSON_URL = "/data/localidades-bogota.geojson";

// Tonos de relleno de las localidades (tokens rosa, rosa-claro y rosa-palido de globals.css).
// Leaflet pinta en SVG con atributos, que no aceptan var(--...), por eso van en hexadecimal.
export const LOCALIDAD_TONOS = ["#e2507f", "#f29bb5", "#f9d6e0"] as const;
export const LOCALIDAD_BORDE = "#c93d6a";
export const LOCALIDAD_BORDE_SELECCIONADA = "#1e231e";
