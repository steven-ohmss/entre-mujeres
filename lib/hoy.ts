"use client";

import { useSyncExternalStore } from "react";

/** Fecha de hoy en el mismo formato que usan los datos: AAAA-MM-DD. */
export function hoyISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** La fecha no cambia mientras alguien mira la página: no hay a qué suscribirse. */
const sinSuscripcion = () => () => {};

const sinFecha = () => null;

/**
 * Fecha de hoy, o null mientras no se ha montado en el navegador.
 *
 * El sitio se genera estático: si la fecha se calculara al construir, "próximos eventos"
 * quedaría congelado en el día del despliegue, así que se resuelve en el navegador. El
 * null del tercer argumento es lo que se usa al generar, y es lo que mantiene igual el
 * HTML generado y el primer render en el navegador; cada pantalla decide qué mostrar
 * mientras tanto.
 */
export function useHoy(): string | null {
  return useSyncExternalStore(sinSuscripcion, hoyISO, sinFecha);
}
