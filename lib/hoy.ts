"use client";

import { useEffect, useState } from "react";

/** Fecha de hoy en el mismo formato que usan los datos: AAAA-MM-DD. */
export function hoyISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/**
 * Fecha de hoy, o null mientras el componente no se ha montado en el navegador.
 *
 * El sitio se genera estático: si la fecha se calculara al construir, "próximos eventos"
 * quedaría congelado en el día del despliegue. Por eso se resuelve en el navegador. El
 * null inicial no es un descuido: es lo que mantiene igual lo que se genera y lo que
 * aparece al cargar, y cada pantalla decide qué mostrar mientras tanto.
 */
export function useHoy(): string | null {
  const [hoy, setHoy] = useState<string | null>(null);
  useEffect(() => setHoy(hoyISO()), []);
  return hoy;
}
