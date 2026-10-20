/**
 * Configuración central de Entre mujeres.
 *
 * Red Mujer puede actualizar este archivo sin tocar el diseño ni las páginas.
 *
 * Todo lo que el equipo todavía no entrega queda en PENDIENTE. La interfaz lo detecta
 * con esPendiente() y muestra el marcador en vez de un enlace roto, así que nunca hay
 * que escribir datos inventados aquí: se reemplaza PENDIENTE por el dato real y listo.
 */

export const PENDIENTE = "PENDIENTE";

export type Pendiente = typeof PENDIENTE;

/** Un valor que el equipo todavía no entregó. */
export type ValorPendiente = string | Pendiente;

/**
 * True cuando el valor no sirve para construir un enlace: está vacío, es PENDIENTE, o
 * es un marcador antiguo entre corchetes como "[correo@pendiente.com]".
 */
export function esPendiente(valor: string | null | undefined): boolean {
  if (!valor) return true;
  const limpio = valor.trim();
  if (limpio.length === 0) return true;
  if (limpio.toUpperCase() === PENDIENTE) return true;
  return limpio.startsWith("[") && limpio.endsWith("]");
}

// --- Inicio: video de fondo del hero (4.3) ---------------------------------

/**
 * Video de fondo del inicio. Debe ir comprimido y liviano (menos de 5 MB, MP4 o WebM)
 * para que cargue en conexiones lentas. Mientras sea PENDIENTE el hero muestra solo
 * la imagen del poster.
 */
export const HERO_VIDEO_URL: ValorPendiente = PENDIENTE;

/** Imagen que se ve mientras carga el video, si falla, o si la persona pidió reducir movimiento. */
export const HERO_VIDEO_POSTER = "/images/hero-mujeres.jpg";

export const HERO_VIDEO_POSTER_ALT =
  "Mujeres campesinas con sombrero trabajando en una huerta, con montañas al fondo";

// --- Registro de nuevas iniciativas (4.7) ----------------------------------

/** Formulario de Google que abre el botón "Quiero aparecer en el mapa", en una pestaña nueva. */
export const GOOGLE_FORM_URL: ValorPendiente = PENDIENTE;

// --- Contacto de Red Mujer (4.8) -------------------------------------------

export const contacto = {
  /** Número con indicativo del país, por ejemplo "+57 300 000 0000". */
  whatsapp: PENDIENTE as ValorPendiente,
  telefono: PENDIENTE as ValorPendiente,
  correo: PENDIENTE as ValorPendiente,
  instagram: PENDIENTE as ValorPendiente,
  facebook: PENDIENTE as ValorPendiente,
  /** Este sí es dato confirmado por el equipo. */
  ubicacion: "Usme – Vereda Arrayanes",
};

// --- Enlaces que funcionan -------------------------------------------------

/** Deja solo los dígitos: wa.me no acepta espacios, guiones ni el signo +. */
export function soloDigitos(telefono: string): string {
  return telefono.replace(/\D/g, "");
}

/**
 * Enlace de WhatsApp con un mensaje ya escrito. Devuelve null si todavía no hay número,
 * para que la interfaz pueda mostrar el marcador en vez de un botón que no lleva a nada.
 */
export function urlWhatsApp(telefono: string | null | undefined, mensaje?: string): string | null {
  if (esPendiente(telefono)) return null;
  const numero = soloDigitos(telefono as string);
  if (numero.length === 0) return null;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/${numero}${texto}`;
}

export function urlTelefono(telefono: string | null | undefined): string | null {
  if (esPendiente(telefono)) return null;
  return `tel:+${soloDigitos(telefono as string)}`;
}

export function urlCorreo(correo: string | null | undefined): string | null {
  if (esPendiente(correo)) return null;
  return `mailto:${(correo as string).trim()}`;
}

/** Instagram se guarda como "@usuaria" o como URL completa; aquí sale siempre una URL. */
export function urlInstagram(usuario: string | null | undefined): string | null {
  if (esPendiente(usuario)) return null;
  const limpio = (usuario as string).trim();
  if (limpio.startsWith("http")) return limpio;
  return `https://instagram.com/${limpio.replace(/^@/, "")}`;
}

// --- Mensajes preescritos de WhatsApp --------------------------------------

export function mensajeProducto(nombreProducto: string): string {
  return `Hola, vi su producto ${nombreProducto} en Entre mujeres y quiero más información.`;
}

export function mensajeComunidad(nombreComunidad: string): string {
  return `Hola, vi a ${nombreComunidad} en Entre mujeres y quiero más información.`;
}

export function mensajeGeneral(): string {
  return "Hola, les escribo desde la página de Entre mujeres y quiero más información.";
}
