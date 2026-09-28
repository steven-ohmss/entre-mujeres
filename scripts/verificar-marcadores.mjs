// Script de un solo uso: verifica que cada marcador del mapa (data/data.ts) cae dentro del
// polígono de la localidad que declara su comunidad.
//   node scripts/verificar-marcadores.mjs

import { readFileSync } from "node:fs";
import { mapMarkers, communities } from "../data/data.ts";

const geojson = JSON.parse(readFileSync("public/data/localidades-bogota.geojson", "utf8"));

const puntoEnAnillo = ([x, y], anillo) => {
  let dentro = false;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    const [xi, yi] = anillo[i];
    const [xj, yj] = anillo[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
};

const puntoEnLocalidad = (punto, feature) => {
  const { type, coordinates } = feature.geometry;
  const poligonos = type === "Polygon" ? [coordinates] : coordinates;
  return poligonos.some(
    ([exterior, ...huecos]) =>
      puntoEnAnillo(punto, exterior) && !huecos.some((h) => puntoEnAnillo(punto, h))
  );
};

let errores = 0;
for (const marker of mapMarkers) {
  const community = communities.find((c) => c.id === marker.communityId);
  const punto = [marker.lng, marker.lat];
  const encontrada = geojson.features.find((f) => puntoEnLocalidad(punto, f))?.properties.nombre;
  const ok = encontrada === community.localidad;
  if (!ok) errores++;
  console.log(
    `${ok ? "OK   " : "ERROR"} ${community.name}: declara ${community.localidad}, cae en ${encontrada ?? "fuera de Bogotá"}`
  );
}
process.exit(errores ? 1 : 0);
