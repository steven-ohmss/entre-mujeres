import { clienteServidor } from "@/lib/sesion";
import { urlImagen } from "@/lib/supabase";

/**
 * Lo que lee el panel.
 *
 * Es deliberadamente distinto de lib/datos.ts. Allí todo pasa por `use cache` porque el
 * sitio público puede mostrar algo de hace un rato; aquí no: quien acaba de guardar
 * tiene que ver su cambio al volver al listado, no la versión de hace una hora.
 *
 * Además lee con la sesión de la usuaria, así que es el RLS quien decide qué puede ver.
 */

export interface FilaListado {
  id: string;
  slug: string;
  nombre: string;
  imagen: string;
  orden: number;
  esEjemplo: boolean;
  /** Lo que falta por llenar, para marcarlo como "Pendiente" en el listado. */
  pendientes: string[];
  /** Línea pequeña bajo el nombre. */
  detalle: string;
}

export interface ComunidadAdmin {
  id: string;
  slug: string;
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
  is_example: boolean;
  orden: number;
}

export interface ProductoAdmin {
  id: string;
  slug: string;
  name: string;
  type: string;
  community_id: string;
  description: string;
  presentation: string | null;
  features: string[];
  availability: string | null;
  catalog_url: string | null;
  is_example: boolean;
  orden: number;
  product_images: { id: string; storage_path: string; alt: string; position: number }[];
}

export interface EventoAdmin {
  id: string;
  slug: string;
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  localidad: string;
  type: string;
  organizer: string;
  community_id: string | null;
  description: string | null;
  image_path: string | null;
  image_alt: string | null;
  is_example: boolean;
  orden: number;
}

export interface NoticiaAdmin {
  id: string;
  slug: string;
  type: string;
  title: string;
  date: string;
  summary: string | null;
  full_text: string | null;
  image_path: string | null;
  image_alt: string | null;
  is_example: boolean;
  orden: number;
}

function fallar(que: string, error: { message: string } | null): never {
  throw new Error(`No se pudo leer ${que}: ${error?.message ?? "error desconocido"}`);
}

// --- Comunidades -----------------------------------------------------------

export async function comunidadesAdmin(): Promise<ComunidadAdmin[]> {
  const { data, error } = await clienteServidor()
    .from("communities")
    .select("*")
    .order("orden")
    .order("slug");
  if (error) fallar("las comunidades", error);
  return data as ComunidadAdmin[];
}

export async function comunidadPorSlug(slug: string): Promise<ComunidadAdmin | null> {
  const { data } = await clienteServidor().from("communities").select("*").eq("slug", slug).maybeSingle();
  return (data as ComunidadAdmin) ?? null;
}

export function listadoComunidades(filas: ComunidadAdmin[], conteos: Map<string, number>): FilaListado[] {
  return filas.map((c) => {
    const pendientes: string[] = [];
    if (!c.category) pendientes.push("categoría");
    if (!c.short_description) pendientes.push("descripción");
    if (!c.image_path) pendientes.push("foto");
    if (!c.whatsapp) pendientes.push("WhatsApp");
    if (c.lat === null) pendientes.push("ubicación en el mapa");

    const cuantos = conteos.get(c.id) ?? 0;
    return {
      id: c.id,
      slug: c.slug,
      nombre: c.name,
      imagen: urlImagen(c.image_path),
      orden: c.orden,
      esEjemplo: c.is_example,
      pendientes,
      detalle: `${c.localidad} · ${cuantos === 1 ? "1 producto" : `${cuantos} productos`}`,
    };
  });
}

// --- Productos -------------------------------------------------------------

export async function productosAdmin(): Promise<ProductoAdmin[]> {
  const { data, error } = await clienteServidor()
    .from("products")
    .select("*, product_images(id, storage_path, alt, position)")
    .order("orden")
    .order("slug");
  if (error) fallar("los productos", error);
  return (data as ProductoAdmin[]).map((p) => ({
    ...p,
    product_images: [...(p.product_images ?? [])].sort((a, b) => a.position - b.position),
  }));
}

export async function productoPorSlug(slug: string): Promise<ProductoAdmin | null> {
  const { data } = await clienteServidor()
    .from("products")
    .select("*, product_images(id, storage_path, alt, position)")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  const p = data as ProductoAdmin;
  return { ...p, product_images: [...(p.product_images ?? [])].sort((a, b) => a.position - b.position) };
}

export function listadoProductos(
  filas: ProductoAdmin[],
  comunidades: Map<string, string>
): FilaListado[] {
  return filas.map((p) => {
    const pendientes: string[] = [];
    if (p.product_images.length === 0) pendientes.push("foto");
    if (!p.availability) pendientes.push("disponibilidad");
    if (!p.presentation) pendientes.push("presentación");

    return {
      id: p.id,
      slug: p.slug,
      nombre: p.name,
      imagen: urlImagen(p.product_images[0]?.storage_path),
      orden: p.orden,
      esEjemplo: p.is_example,
      pendientes,
      detalle: `${p.type} · ${comunidades.get(p.community_id) ?? "sin comunidad"}`,
    };
  });
}

// --- Eventos ---------------------------------------------------------------

export async function eventosAdmin(): Promise<EventoAdmin[]> {
  const { data, error } = await clienteServidor()
    .from("events")
    .select("*")
    .order("date", { ascending: false });
  if (error) fallar("los eventos", error);
  return data as EventoAdmin[];
}

export async function eventoPorSlug(slug: string): Promise<EventoAdmin | null> {
  const { data } = await clienteServidor().from("events").select("*").eq("slug", slug).maybeSingle();
  return (data as EventoAdmin) ?? null;
}

// --- Noticias --------------------------------------------------------------

export async function noticiasAdmin(): Promise<NoticiaAdmin[]> {
  const { data, error } = await clienteServidor()
    .from("news")
    .select("*")
    .order("date", { ascending: false });
  if (error) fallar("las noticias", error);
  return data as NoticiaAdmin[];
}

export async function noticiaPorSlug(slug: string): Promise<NoticiaAdmin | null> {
  const { data } = await clienteServidor().from("news").select("*").eq("slug", slug).maybeSingle();
  return (data as NoticiaAdmin) ?? null;
}

/** Cuántos productos cuelgan de cada comunidad, para avisar antes de borrarla. */
export async function productosPorComunidad(): Promise<Map<string, number>> {
  const { data } = await clienteServidor().from("products").select("community_id");
  const conteo = new Map<string, number>();
  for (const { community_id } of (data ?? []) as { community_id: string }[]) {
    conteo.set(community_id, (conteo.get(community_id) ?? 0) + 1);
  }
  return conteo;
}
