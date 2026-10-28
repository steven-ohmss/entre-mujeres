// Hook de resolución que corre en el hilo de carga de módulos de node. No se ejecuta
// directamente: lo registra scripts/alias-arroba.mjs.

import { pathToFileURL } from "node:url";

const RAIZ = pathToFileURL(`${import.meta.dirname}/../`).href;

export function resolve(especificador, contexto, siguiente) {
  if (!especificador.startsWith("@/")) return siguiente(especificador, contexto);

  // TypeScript importa sin extensión ("@/config/site"), pero node la exige.
  const ruta = especificador.slice(2);
  const conExtension = /\.[a-z]+$/.test(ruta) ? ruta : `${ruta}.ts`;

  return siguiente(new URL(conExtension, RAIZ).href, contexto);
}
