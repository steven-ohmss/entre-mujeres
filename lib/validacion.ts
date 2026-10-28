import {
  communityCategories,
  eventTypes,
  localidades,
  organizers,
  productTypes,
} from "@/lib/catalogos";

/**
 * Las reglas de los formularios del panel, en un solo sitio.
 *
 * Las usa el formulario en el navegador, para avisar mientras se escribe, y otra vez la
 * Server Action en el servidor antes de guardar. Esa repetición es a propósito: lo del
 * navegador es una cortesía y se puede saltar; lo que de verdad protege los datos es la
 * comprobación del servidor.
 */

export type Errores = Record<string, string>;

/** Vacío, espacios o nada es lo mismo: no hay dato. En la base va null, nunca "PENDIENTE". */
export function oNulo(valor: FormDataEntryValue | null | undefined): string | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim();
  return limpio.length === 0 ? null : limpio;
}

export function texto(valor: FormDataEntryValue | null | undefined): string {
  return typeof valor === "string" ? valor.trim() : "";
}

// --- Colombia --------------------------------------------------------------

/**
 * Caja que envuelve a Colombia continental e insular. No es la frontera exacta: sirve
 * para cazar el error de verdad, que es pegar la coordenada al revés (lng donde va lat)
 * o de otro país. Un punto dentro de la caja pero fuera del país lo caza después
 * scripts/verificar-marcadores.mjs, que sí compara contra el polígono de la localidad.
 */
export const COLOMBIA = { latMin: -4.3, latMax: 13.6, lngMin: -82.0, lngMax: -66.8 };

export function coordenadaValida(lat: number, lng: number): boolean {
  return (
    lat >= COLOMBIA.latMin &&
    lat <= COLOMBIA.latMax &&
    lng >= COLOMBIA.lngMin &&
    lng <= COLOMBIA.lngMax
  );
}

/** Acepta "4,37" además de "4.37": el teclado en español escribe coma. */
export function aNumero(valor: FormDataEntryValue | null | undefined): number | null {
  const t = texto(valor).replace(",", ".");
  if (t.length === 0) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

// --- WhatsApp --------------------------------------------------------------

/**
 * Deja el número como lo necesita wa.me: solo dígitos, con indicativo.
 *
 * La gente lo escribe de mil formas: "320 123 4567", "+57 320-1234567", "(57) 320…".
 * En vez de pedirle un formato, se acepta lo que escriba y se normaliza. Si son los diez
 * dígitos de un celular colombiano sin indicativo, se le antepone el 57.
 */
export function normalizarWhatsApp(valor: string | null): string | null {
  if (!valor) return null;
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 0) return null;
  if (digitos.length === 10 && digitos.startsWith("3")) return `57${digitos}`;
  return digitos;
}

export function whatsAppValido(normalizado: string | null): boolean {
  if (!normalizado) return true; // vacío es válido: el dato es opcional
  return normalizado.length >= 10 && normalizado.length <= 15;
}

export function urlWaMe(normalizado: string | null): string | null {
  return normalizado ? `https://wa.me/${normalizado}` : null;
}

// --- Enlaces ---------------------------------------------------------------

export function enlaceValido(valor: string | null): boolean {
  if (!valor) return true;
  try {
    const u = new URL(valor);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// --- Listas cerradas -------------------------------------------------------

const enLista = <T extends string>(lista: readonly T[], valor: string | null): valor is T =>
  valor !== null && (lista as readonly string[]).includes(valor);

export const esCategoria = (v: string | null) => enLista(communityCategories, v);
export const esTipoProducto = (v: string | null) => enLista(productTypes, v);
export const esLocalidad = (v: string | null) => enLista(localidades, v);
export const esOrganizador = (v: string | null) => enLista(organizers, v);
export const esTipoEvento = (v: string | null) =>
  enLista(eventTypes.map((t) => t.value), v);
export const esDisponibilidad = (v: string | null) =>
  enLista(["Disponible", "Por encargo", "Por temporada"] as const, v);
export const esTipoNoticia = (v: string | null) =>
  enLista(["Historia", "Noticia", "Actividad reciente", "Proyecto destacado"] as const, v);

// --- Fechas ----------------------------------------------------------------

export function fechaValida(valor: string | null): boolean {
  if (!valor) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const d = new Date(`${valor}T12:00:00`);
  return !Number.isNaN(d.getTime());
}

/** "14:30" -> "2:30 p.m.", que es el formato que ya muestra el sitio. */
export function horaBonita(hhmm: string | null): string | null {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const [h, m] = hhmm.split(":").map(Number);
  const sufijo = h < 12 ? "a.m." : "p.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** El camino de vuelta, para rellenar el <input type="time"> al editar. */
export function horaAInput(bonita: string | null): string {
  if (!bonita) return "";
  const m = bonita.match(/^(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)$/i);
  if (!m) return "";
  let h = Number(m[1]);
  const esPm = /p/i.test(m[3]);
  if (esPm && h !== 12) h += 12;
  if (!esPm && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

// --- Descripción de las fotos ----------------------------------------------

export const MINIMO_ALT = 10;

/**
 * El alt tiene que describir la foto, no repetir el nombre. Es lo que oye quien usa
 * lector de pantalla, así que un "queso" no sirve de nada: por eso se pide una frase.
 */
export function altValido(alt: string | null): boolean {
  return !!alt && alt.trim().length >= MINIMO_ALT;
}
