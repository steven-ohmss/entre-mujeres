import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";

// Teselas del mapa base. Se pueden cambiar sin tocar código con las variables
// NEXT_PUBLIC_MAP_TILE_URL y NEXT_PUBLIC_MAP_TILE_ATTRIBUTION (ver README).
export const MAP_TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Vista de respaldo mientras carga el GeoJSON de localidades (ya muestra Bogotá completa,
// incluido Sumapaz). Al cargar, el mapa se ajusta con fitBounds a los límites de Bogotá.
export const MAP_CENTER: LatLngTuple = [4.3, -74.15];
export const MAP_ZOOM = 9;
export const MAP_ZOOM_SNAP = 0.25;
export const MAP_MIN_ZOOM = 8;
export const MAP_MAX_ZOOM = 18;

// Límites de navegación con margen generoso alrededor de Cundinamarca, para que no se
// pierdan navegando sin empujar la vista inicial.
export const MAP_MAX_BOUNDS: LatLngBoundsExpression = [
  [2.3, -76.5],
  [6.8, -71.8],
];

export const LOCALIDADES_GEOJSON_URL = "/data/localidades-bogota.geojson";

// Tonos de relleno de las localidades (tokens rosa, rosa-claro y rosa-palido de globals.css).
// Leaflet pinta en SVG con atributos, que no aceptan var(--...), por eso van en hexadecimal.
export const LOCALIDAD_TONOS = ["#e2507f", "#f29bb5", "#f9d6e0"] as const;
export const LOCALIDAD_BORDE = "#c93d6a";
export const LOCALIDAD_BORDE_SELECCIONADA = "#1e231e";

/**
 * Opacidad del relleno rosado de las localidades (4.5).
 *
 * El rosado estaba tan cargado que al acercar el zoom tapaba las calles y los nombres de
 * las veredas, que es justo lo que la gente necesita leer cuando se acerca. Ahora el
 * relleno es suave y además se va retirando a medida que se entra: lejos sirve para
 * distinguir una localidad de otra, de cerca estorba.
 */
export const LOCALIDAD_RELLENO = 0.28;

/** Al pasar el mouse o tocar, la localidad se resalta un poco. */
export const LOCALIDAD_RELLENO_RESALTADA = 0.45;

/** La localidad elegida en el filtro se mantiene visible. */
export const LOCALIDAD_RELLENO_ELEGIDA = 0.5;

/** Las demás, cuando hay una elegida, se apagan para que resalte la escogida. */
export const LOCALIDAD_RELLENO_APAGADA = 0.16;

/** Desde este zoom el relleno empieza a desvanecerse para dejar ver el mapa base. */
export const ZOOM_DESVANECER_DESDE = 12;

/** A partir de este zoom el relleno queda en su mínimo. */
export const ZOOM_DESVANECER_HASTA = 15;

/** Qué proporción del relleno queda con el zoom más alto. */
export const RELLENO_MINIMO_PROPORCION = 0.25;

/**
 * Factor por el que se multiplica el relleno según el zoom: 1 mientras se ve la ciudad
 * completa, y bajando hasta RELLENO_MINIMO_PROPORCION cuando ya se ven las calles.
 */
export function factorPorZoom(zoom: number): number {
  if (zoom <= ZOOM_DESVANECER_DESDE) return 1;
  if (zoom >= ZOOM_DESVANECER_HASTA) return RELLENO_MINIMO_PROPORCION;
  const avance =
    (zoom - ZOOM_DESVANECER_DESDE) / (ZOOM_DESVANECER_HASTA - ZOOM_DESVANECER_DESDE);
  return 1 - avance * (1 - RELLENO_MINIMO_PROPORCION);
}
