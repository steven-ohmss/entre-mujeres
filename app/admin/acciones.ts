"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clienteServidor, esAdmin } from "@/lib/sesion";
import { ETIQUETAS } from "@/lib/datos";
import { slugLibre } from "@/lib/slug";
import {
  altValido,
  aNumero,
  coordenadaValida,
  enlaceValido,
  esCategoria,
  esDisponibilidad,
  esLocalidad,
  esOrganizador,
  esTipoEvento,
  esTipoNoticia,
  esTipoProducto,
  fechaValida,
  horaBonita,
  normalizarWhatsApp,
  oNulo,
  texto,
  whatsAppValido,
  type Errores,
} from "@/lib/validacion";

/**
 * Todo lo que el panel escribe pasa por aquí.
 *
 * Tres cosas se repiten en cada acción, y las tres son a propósito:
 *
 * 1. Se vuelve a preguntar si quien llama es administradora. El proxy ya lo comprobó
 *    para dejarla entrar, pero una Server Action es una dirección que se puede llamar
 *    sola, sin pasar por ninguna página. Esconder un botón no protege nada.
 * 2. Se vuelven a validar los datos. Lo que valida el formulario es una cortesía para
 *    avisar mientras se escribe; se puede saltar.
 * 3. Se revalidan las etiquetas de lo que cambió, que es el gancho que quedó listo en
 *    el paso 3. Sin esto el sitio público seguiría mostrando lo viejo hasta una hora.
 *
 * Y lo que NO hay aquí: la clave secret. Se escribe con la sesión de la usuaria, así que
 * es el RLS de la base el que tiene la última palabra.
 */

export interface Resultado {
  ok: boolean;
  errores?: Errores;
  /** Mensaje general, cuando el problema no es de un campo concreto. */
  mensaje?: string;
}

const OK: Resultado = { ok: true };

async function exigirAdmin(): Promise<void> {
  if (!(await esAdmin())) {
    throw new Error("No tienes permiso para hacer este cambio.");
  }
}

/** Traduce los errores de Postgres a algo que se entienda. */
function explicar(error: { message: string; code?: string }, que: string): Resultado {
  if (error.code === "23505") {
    return { ok: false, mensaje: `Ya existe ${que} con ese nombre. Prueba con otro.` };
  }
  if (error.code === "23503") {
    return {
      ok: false,
      mensaje: "No se puede guardar porque algo que estás vinculando ya no existe. Recarga la página.",
    };
  }
  if (error.code === "23514") {
    return { ok: false, mensaje: "Alguno de los datos no cumple las reglas. Revisa el formulario." };
  }
  if (/row-level security/i.test(error.message)) {
    return { ok: false, mensaje: "No tienes permiso para hacer este cambio." };
  }
  return { ok: false, mensaje: `No se pudo guardar: ${error.message}` };
}

/**
 * Refresca el sitio público con lo que se acaba de guardar.
 *
 * Va con updateTag y no con revalidateTag a propósito. revalidateTag sirve lo viejo
 * mientras refresca por detrás, que está bien para un cambio que llega de fuera; aquí no
 * sirve: quien acaba de guardar va a abrir el sitio enseguida para ver cómo quedó, y
 * encontrarse lo de antes parece que no se hubiera guardado. Se probó: con revalidateTag
 * la página de un producto recién creado todavía daba 404. updateTag está hecho para
 * esto, y solo se puede llamar desde una Server Action, que es justo donde estamos.
 */
function refrescar(...etiquetas: string[]) {
  for (const e of etiquetas) updateTag(e);
}

// =========================================================================
// COMUNIDADES
// =========================================================================

interface DatosComunidad {
  name: string;
  category: string | null;
  localidad: string;
  ubicacion: string;
  short_description: string | null;
  who_we_are: string | null;
  what_we_do: string | null;
  image_path: string | null;
  image_alt: string | null;
  lat: number | null;
  lng: number | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  social: string | null;
  catalog_url: string | null;
}

function leerComunidad(datos: FormData): { valores: DatosComunidad; errores: Errores } {
  const errores: Errores = {};

  const name = texto(datos.get("name"));
  if (name.length < 2) errores.name = "Escribe el nombre de la comunidad.";

  const localidad = texto(datos.get("localidad"));
  if (!esLocalidad(localidad)) errores.localidad = "Elige una localidad de la lista.";

  const ubicacion = texto(datos.get("ubicacion"));
  if (ubicacion.length < 3) errores.ubicacion = "Escribe dónde están, por ejemplo: Vereda El Hato, Usme.";

  const category = oNulo(datos.get("category"));
  if (category !== null && !esCategoria(category)) errores.category = "Elige una categoría de la lista.";

  const lat = aNumero(datos.get("lat"));
  const lng = aNumero(datos.get("lng"));
  // O van las dos o no va ninguna: media coordenada no ubica nada, y la base lo exige.
  if ((lat === null) !== (lng === null)) {
    errores.lat = "Faltó una de las dos coordenadas. Pon las dos, o ninguna.";
  } else if (lat !== null && lng !== null && !coordenadaValida(lat, lng)) {
    errores.lat = "Esa coordenada no cae dentro de Colombia. Revisa que no estén al revés.";
  }

  const whatsapp = normalizarWhatsApp(oNulo(datos.get("whatsapp")));
  if (!whatsAppValido(whatsapp)) errores.whatsapp = "Ese número no parece completo.";

  const catalog_url = oNulo(datos.get("catalog_url"));
  if (!enlaceValido(catalog_url)) errores.catalog_url = "El enlace debe empezar por https://";

  const image_path = oNulo(datos.get("image_path"));
  const image_alt = oNulo(datos.get("image_alt"));
  if (image_path && !altValido(image_alt)) {
    errores.image_alt = "Escribe una frase que diga lo que se ve en la foto.";
  }

  return {
    valores: {
      name,
      category,
      localidad,
      ubicacion,
      short_description: oNulo(datos.get("short_description")),
      who_we_are: oNulo(datos.get("who_we_are")),
      what_we_do: oNulo(datos.get("what_we_do")),
      image_path,
      image_alt: image_path ? image_alt : null,
      lat,
      lng,
      whatsapp,
      phone: oNulo(datos.get("phone")),
      email: oNulo(datos.get("email")),
      social: oNulo(datos.get("social")),
      catalog_url,
    },
    errores,
  };
}

export async function crearComunidad(datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerComunidad(datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const db = clienteServidor();
  const { data: existentes } = await db.from("communities").select("slug, orden");
  const slug = slugLibre(valores.name, (existentes ?? []).map((c) => c.slug));
  if (!slug) return { ok: false, errores: { name: "Ese nombre no sirve para armar una dirección." } };

  const orden = Math.max(0, ...(existentes ?? []).map((c) => c.orden)) + 1;

  const { error } = await db.from("communities").insert({ ...valores, slug, orden, is_example: false });
  if (error) return explicar(error, "una comunidad");

  refrescar(ETIQUETAS.comunidades);
  redirect(`/admin/comunidades?guardado=${encodeURIComponent(valores.name)}`);
}

export async function editarComunidad(slug: string, datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerComunidad(datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const { error } = await clienteServidor().from("communities").update(valores).eq("slug", slug);
  if (error) return explicar(error, "una comunidad");

  // También los productos y los eventos: muestran el nombre y la ubicación de la comunidad.
  refrescar(ETIQUETAS.comunidades, ETIQUETAS.productos, ETIQUETAS.eventos);
  redirect(`/admin/comunidades?guardado=${encodeURIComponent(valores.name)}`);
}

export async function eliminarComunidad(slug: string): Promise<Resultado> {
  await exigirAdmin();
  const db = clienteServidor();

  const { data: comunidad } = await db.from("communities").select("id, name, image_path").eq("slug", slug).maybeSingle();
  if (!comunidad) return { ok: false, mensaje: "Esa comunidad ya no existe." };

  const { count } = await db
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("community_id", comunidad.id);

  // La base lo impide igual (on delete restrict), pero aquí se puede explicar por qué.
  if ((count ?? 0) > 0) {
    return {
      ok: false,
      mensaje: `No se puede eliminar ${comunidad.name} porque todavía tiene ${count} ${
        count === 1 ? "producto" : "productos"
      }. Elimina o cambia de comunidad esos productos primero.`,
    };
  }

  const { error } = await db.from("communities").delete().eq("slug", slug);
  if (error) return explicar(error, "esa comunidad");

  if (comunidad.image_path) {
    await db.storage.from("imagenes").remove([comunidad.image_path]);
  }

  refrescar(ETIQUETAS.comunidades, ETIQUETAS.productos, ETIQUETAS.eventos);
  redirect(`/admin/comunidades?eliminado=${encodeURIComponent(comunidad.name)}`);
}

// =========================================================================
// PRODUCTOS
// =========================================================================

interface FotoEnviada {
  storage_path: string;
  alt: string;
}

/** Las fotos llegan como JSON en un campo oculto, ya subidas al bucket. */
function leerFotos(datos: FormData): { fotos: FotoEnviada[]; error?: string } {
  const bruto = texto(datos.get("fotos"));
  if (!bruto) return { fotos: [] };
  try {
    const lista = JSON.parse(bruto) as FotoEnviada[];
    if (!Array.isArray(lista)) return { fotos: [], error: "No entendimos las fotos." };
    for (const f of lista) {
      if (!f?.storage_path) return { fotos: [], error: "Una de las fotos quedó sin archivo." };
      if (!altValido(f.alt)) {
        return { fotos: [], error: "Cada foto necesita una frase que diga lo que se ve." };
      }
    }
    return { fotos: lista };
  } catch {
    return { fotos: [], error: "No entendimos las fotos. Vuelve a subirlas." };
  }
}

interface DatosProducto {
  name: string;
  type: string;
  community_id: string;
  description: string;
  presentation: string | null;
  features: string[];
  availability: string | null;
  catalog_url: string | null;
}

function leerProducto(datos: FormData): { valores: DatosProducto; errores: Errores } {
  const errores: Errores = {};

  const name = texto(datos.get("name"));
  if (name.length < 2) errores.name = "Escribe el nombre del producto.";

  const type = texto(datos.get("type"));
  if (!esTipoProducto(type)) errores.type = "Elige una categoría de la lista.";

  const community_id = texto(datos.get("community_id"));
  if (!community_id) errores.community_id = "Elige de qué comunidad es.";

  const description = texto(datos.get("description"));
  if (description.length < 10) errores.description = "Escribe una descripción de al menos 10 caracteres.";

  const availability = oNulo(datos.get("availability"));
  if (availability !== null && !esDisponibilidad(availability)) {
    errores.availability = "Elige una opción de la lista.";
  }

  const catalog_url = oNulo(datos.get("catalog_url"));
  if (!enlaceValido(catalog_url)) errores.catalog_url = "El enlace debe empezar por https://";

  // Las características llegan como un campo repetido, una por línea del formulario.
  const features = datos
    .getAll("features")
    .map((f) => texto(f))
    .filter((f) => f.length > 0);

  return {
    valores: {
      name,
      type,
      community_id,
      description,
      presentation: oNulo(datos.get("presentation")),
      features,
      availability,
      catalog_url,
    },
    errores,
  };
}

/** Deja las filas de product_images igual a lo que mandó el formulario. */
async function sincronizarFotos(productoId: string, fotos: FotoEnviada[]): Promise<string | null> {
  const db = clienteServidor();

  const { data: actuales } = await db
    .from("product_images")
    .select("id, storage_path")
    .eq("product_id", productoId);

  const vigentes = new Set(fotos.map((f) => f.storage_path));
  const sobrantes = (actuales ?? []).filter((a) => !vigentes.has(a.storage_path));

  // Primero se borra lo que sobra: si no, al reordenar chocaría la pareja
  // (product_id, position), que es única.
  if (sobrantes.length > 0) {
    await db.from("product_images").delete().in("id", sobrantes.map((s) => s.id));
    await db.storage.from("imagenes").remove(sobrantes.map((s) => s.storage_path));
  }

  // Posiciones fuera de rango para no chocar mientras se reordena.
  await db.from("product_images").update({ position: -1 }).eq("product_id", productoId);

  for (const [i, foto] of fotos.entries()) {
    const { error } = await db
      .from("product_images")
      .upsert(
        { product_id: productoId, storage_path: foto.storage_path, alt: foto.alt.trim(), position: i },
        { onConflict: "storage_path" }
      );
    if (error) {
      if (error.code === "23505") {
        return "Esa foto ya está usada en otro producto. Cada producto lleva su propia foto.";
      }
      return `No se pudieron guardar las fotos: ${error.message}`;
    }
  }

  return null;
}

export async function crearProducto(datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerProducto(datos);
  const { fotos, error: errorFotos } = leerFotos(datos);
  if (errorFotos) errores.fotos = errorFotos;
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const db = clienteServidor();
  const { data: existentes } = await db.from("products").select("slug, orden");
  const slug = slugLibre(valores.name, (existentes ?? []).map((p) => p.slug));
  if (!slug) return { ok: false, errores: { name: "Ese nombre no sirve para armar una dirección." } };

  const orden = Math.max(0, ...(existentes ?? []).map((p) => p.orden)) + 1;

  const { data: creado, error } = await db
    .from("products")
    .insert({ ...valores, slug, orden, is_example: false })
    .select("id")
    .single();
  if (error) return explicar(error, "un producto");

  const fallo = await sincronizarFotos(creado.id, fotos);
  if (fallo) return { ok: false, mensaje: fallo };

  refrescar(ETIQUETAS.productos);
  redirect(`/admin/productos?guardado=${encodeURIComponent(valores.name)}`);
}

export async function editarProducto(slug: string, datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerProducto(datos);
  const { fotos, error: errorFotos } = leerFotos(datos);
  if (errorFotos) errores.fotos = errorFotos;
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const db = clienteServidor();
  const { data: producto } = await db.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!producto) return { ok: false, mensaje: "Ese producto ya no existe." };

  const { error } = await db.from("products").update(valores).eq("id", producto.id);
  if (error) return explicar(error, "un producto");

  const fallo = await sincronizarFotos(producto.id, fotos);
  if (fallo) return { ok: false, mensaje: fallo };

  refrescar(ETIQUETAS.productos);
  redirect(`/admin/productos?guardado=${encodeURIComponent(valores.name)}`);
}

export async function eliminarProducto(slug: string): Promise<Resultado> {
  await exigirAdmin();
  const db = clienteServidor();

  const { data: producto } = await db
    .from("products")
    .select("id, name, product_images(storage_path)")
    .eq("slug", slug)
    .maybeSingle();
  if (!producto) return { ok: false, mensaje: "Ese producto ya no existe." };

  const rutas = (producto.product_images ?? []).map((f: { storage_path: string }) => f.storage_path);

  // Las filas de product_images se van solas (on delete cascade); los archivos no.
  const { error } = await db.from("products").delete().eq("id", producto.id);
  if (error) return explicar(error, "ese producto");

  if (rutas.length > 0) await db.storage.from("imagenes").remove(rutas);

  refrescar(ETIQUETAS.productos);
  redirect(`/admin/productos?eliminado=${encodeURIComponent(producto.name)}`);
}

// =========================================================================
// EVENTOS
// =========================================================================

function leerEvento(datos: FormData): { valores: Record<string, unknown>; errores: Errores } {
  const errores: Errores = {};

  const title = texto(datos.get("title"));
  if (title.length < 2) errores.title = "Escribe el nombre del evento.";

  const date = texto(datos.get("date"));
  if (!fechaValida(date)) errores.date = "Elige una fecha.";

  const location = texto(datos.get("location"));
  if (location.length < 3) errores.location = "Escribe dónde es.";

  const localidad = texto(datos.get("localidad"));
  if (!esLocalidad(localidad)) errores.localidad = "Elige una localidad de la lista.";

  const type = texto(datos.get("type"));
  if (!esTipoEvento(type)) errores.type = "Elige un tipo de evento.";

  const organizer = texto(datos.get("organizer"));
  if (!esOrganizador(organizer)) errores.organizer = "Elige quién organiza.";

  const start_time = horaBonita(oNulo(datos.get("start_time")));
  const end_time = horaBonita(oNulo(datos.get("end_time")));

  const image_path = oNulo(datos.get("image_path"));
  const image_alt = oNulo(datos.get("image_alt"));
  if (image_path && !altValido(image_alt)) {
    errores.image_alt = "Escribe una frase que diga lo que se ve en la foto.";
  }

  return {
    valores: {
      title,
      date,
      start_time,
      end_time,
      location,
      localidad,
      type,
      organizer,
      community_id: oNulo(datos.get("community_id")),
      description: oNulo(datos.get("description")),
      image_path,
      image_alt: image_path ? image_alt : null,
    },
    errores,
  };
}

export async function crearEvento(datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerEvento(datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const db = clienteServidor();
  const { data: existentes } = await db.from("events").select("slug, orden");
  const slug = slugLibre(valores.title as string, (existentes ?? []).map((e) => e.slug));
  const orden = Math.max(0, ...(existentes ?? []).map((e) => e.orden)) + 1;

  const { error } = await db.from("events").insert({ ...valores, slug, orden, is_example: false });
  if (error) return explicar(error, "un evento");

  refrescar(ETIQUETAS.eventos);
  redirect(`/admin/eventos?guardado=${encodeURIComponent(valores.title as string)}`);
}

export async function editarEvento(slug: string, datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerEvento(datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const { error } = await clienteServidor().from("events").update(valores).eq("slug", slug);
  if (error) return explicar(error, "un evento");

  refrescar(ETIQUETAS.eventos);
  redirect(`/admin/eventos?guardado=${encodeURIComponent(valores.title as string)}`);
}

export async function eliminarEvento(slug: string): Promise<Resultado> {
  await exigirAdmin();
  const db = clienteServidor();

  const { data: evento } = await db.from("events").select("title, image_path").eq("slug", slug).maybeSingle();
  if (!evento) return { ok: false, mensaje: "Ese evento ya no existe." };

  const { error } = await db.from("events").delete().eq("slug", slug);
  if (error) return explicar(error, "ese evento");

  if (evento.image_path) await db.storage.from("imagenes").remove([evento.image_path]);

  refrescar(ETIQUETAS.eventos);
  redirect(`/admin/eventos?eliminado=${encodeURIComponent(evento.title)}`);
}

// =========================================================================
// NOTICIAS
// =========================================================================

function leerNoticia(datos: FormData): { valores: Record<string, unknown>; errores: Errores } {
  const errores: Errores = {};

  const title = texto(datos.get("title"));
  if (title.length < 2) errores.title = "Escribe el título.";

  const type = texto(datos.get("type"));
  if (!esTipoNoticia(type)) errores.type = "Elige un tipo de publicación.";

  const date = texto(datos.get("date"));
  if (!fechaValida(date)) errores.date = "Elige una fecha.";

  const image_path = oNulo(datos.get("image_path"));
  const image_alt = oNulo(datos.get("image_alt"));
  if (image_path && !altValido(image_alt)) {
    errores.image_alt = "Escribe una frase que diga lo que se ve en la foto.";
  }

  return {
    valores: {
      title,
      type,
      date,
      summary: oNulo(datos.get("summary")),
      full_text: oNulo(datos.get("full_text")),
      image_path,
      image_alt: image_path ? image_alt : null,
    },
    errores,
  };
}

export async function crearNoticia(datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerNoticia(datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const db = clienteServidor();
  const { data: existentes } = await db.from("news").select("slug, orden");
  const slug = slugLibre(valores.title as string, (existentes ?? []).map((n) => n.slug));
  const orden = Math.max(0, ...(existentes ?? []).map((n) => n.orden)) + 1;

  const { error } = await db.from("news").insert({ ...valores, slug, orden, is_example: false });
  if (error) return explicar(error, "una publicación");

  refrescar(ETIQUETAS.noticias);
  redirect(`/admin/noticias?guardado=${encodeURIComponent(valores.title as string)}`);
}

export async function editarNoticia(slug: string, datos: FormData): Promise<Resultado> {
  await exigirAdmin();
  const { valores, errores } = leerNoticia(datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const { error } = await clienteServidor().from("news").update(valores).eq("slug", slug);
  if (error) return explicar(error, "una publicación");

  refrescar(ETIQUETAS.noticias);
  redirect(`/admin/noticias?guardado=${encodeURIComponent(valores.title as string)}`);
}

export async function eliminarNoticia(slug: string): Promise<Resultado> {
  await exigirAdmin();
  const db = clienteServidor();

  const { data: noticia } = await db.from("news").select("title, image_path").eq("slug", slug).maybeSingle();
  if (!noticia) return { ok: false, mensaje: "Esa publicación ya no existe." };

  const { error } = await db.from("news").delete().eq("slug", slug);
  if (error) return explicar(error, "esa publicación");

  if (noticia.image_path) await db.storage.from("imagenes").remove([noticia.image_path]);

  refrescar(ETIQUETAS.noticias);
  redirect(`/admin/noticias?eliminado=${encodeURIComponent(noticia.title)}`);
}

// =========================================================================
// ORDEN
// =========================================================================

const TABLA_A_ETIQUETA: Record<string, string> = {
  communities: ETIQUETAS.comunidades,
  products: ETIQUETAS.productos,
  events: ETIQUETAS.eventos,
  news: ETIQUETAS.noticias,
};

/**
 * Sube o baja un elemento intercambiando su `orden` con el del vecino.
 *
 * Intercambiar y no reescribir toda la lista: así dos personas moviendo cosas a la vez
 * no se pisan más allá del par que tocaron.
 */
export async function moverOrden(
  tabla: "communities" | "products" | "events" | "news",
  slug: string,
  direccion: "subir" | "bajar"
): Promise<Resultado> {
  await exigirAdmin();
  const db = clienteServidor();

  const { data: filas } = await db.from(tabla).select("slug, orden").order("orden").order("slug");
  if (!filas) return { ok: false, mensaje: "No pudimos leer el orden actual." };

  const i = filas.findIndex((f) => f.slug === slug);
  const j = direccion === "subir" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= filas.length) return OK; // ya está en la punta

  // Si dos comparten número, intercambiarlos no movería nada: se usan las posiciones.
  await db.from(tabla).update({ orden: j }).eq("slug", filas[i].slug);
  await db.from(tabla).update({ orden: i }).eq("slug", filas[j].slug);

  refrescar(TABLA_A_ETIQUETA[tabla]);
  return OK;
}
