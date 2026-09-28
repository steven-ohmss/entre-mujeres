// Script de un solo uso: optimiza las fotos de public/images/ para la web.
// Lee los originales de referencias/originales/ (ignorada por git) y escribe en
// public/images/ con el mismo nombre. Respeta la orientación EXIF y elimina los
// metadatos (incluida la ubicación GPS), porque sharp no los copia por defecto.
//   node scripts/optimizar-fotos.mjs

import { readdirSync, statSync } from "node:fs";
import sharp from "sharp";

const ORIGEN = "referencias/originales";
const DESTINO = "public/images";

const reglas = (nombre) =>
  nombre === "hero-mujeres.jpg"
    ? { ancho: 2400, objetivo: 600 * 1024 }
    : { ancho: 1600, objetivo: 350 * 1024 };

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const filas = [];

for (const nombre of readdirSync(ORIGEN).filter((n) => n.endsWith(".jpg")).sort()) {
  const { ancho, objetivo } = reglas(nombre);
  const entrada = `${ORIGEN}/${nombre}`;
  const salida = `${DESTINO}/${nombre}`;

  let calidad = 80;
  let info = await convertir(entrada, salida, ancho, calidad);
  if (info.size > objetivo) {
    calidad = 75;
    info = await convertir(entrada, salida, ancho, calidad);
  }

  filas.push({
    nombre,
    antes: kb(statSync(entrada).size),
    despues: kb(info.size),
    dimensiones: `${info.width}×${info.height}`,
    calidad,
    objetivo: info.size > objetivo ? "SUPERA" : "ok",
  });
}

console.table(filas);

async function convertir(entrada, salida, ancho, calidad) {
  return sharp(entrada)
    .rotate()
    .resize({ width: ancho, withoutEnlargement: true })
    .jpeg({ quality: calidad, mozjpeg: true })
    .toFile(salida);
}
