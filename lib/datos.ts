import { cacheLife, cacheTag } from "next/cache";
import { supabase, urlImagen } from "@/lib/supabase";
import type {
  CalendarEvent,
  Community,
  MapMarker,
  NewsItem,
  Product,
} from "@/types";

/**
 * De dónde salen los datos de las páginas públicas.
 *
 * Todo pasa por `use cache`, así que la base no se consulta en cada visita: Next guarda
 * el resultado y lo reusa. Cada función lleva su etiqueta (`cacheTag`), que es el gancho
 * para que el panel de administración pueda refrescar lo que cambió apenas se guarde,
 * llamando a `revalidateTag(ETIQUETAS.productos, "max")` desde una Server Action. Sin ese
 * gancho habría que esperar a que venza el tiempo o volver a publicar el sitio.
 *
 * Las filas de la base vienen en snake_case y con nulos; aquí se traducen a los mismos
 * tipos que ya usaban los componentes, para que nada de lo que hay debajo tenga que
 * cambiar. En particular, los nulos vuelven a ser cadenas vacías: `esPendiente()` y el
 * componente `Foto` ya tratan el vacío como "todavía no hay dato".
 */

export const ETIQUETAS = {
  comunidades: "comunidades",
  productos: "productos",
  eventos: "eventos",
  noticias: "noticias",
} as const;

/** El contenido cambia pocas veces al día y el panel refresca por etiqueta cuando pasa. */
const VIDA_CACHE = "hours";

// --- Traducción de filas ---------------------------------------------------

/** La base guarda null donde falta un dato; los componentes esperan cadena vacía. */
const texto = (v: string | null | undefined): string => v ?? "";

interface FilaComunidad {
  slug: string;
  name: string;
  category: Community["category"] | null;
  localidad: Community["localidad"];
  ubicacion: string;
  short_description: string | null;
  who_we_are: string | null;
  what_we_do: string | null;
  image_path: string | null;
  lat: number | null;
  lng: number | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  social: string | null;
  catalog_url: string | null;
  is_example: boolean;
}

function aComunidad(f: FilaComunidad): Community {
  return {
    // El slug hace de id: es estable, legible y es lo que ya relacionaba los datos entre
    // sí en data/data.ts, así que los componentes siguen comparando lo mismo.
    id: f.slug,
    slug: f.slug,
    name: f.name,
    category: f.category ?? undefined,
    localidad: f.localidad,
    ubicacion: f.ubicacion,
    shortDescription: texto(f.short_description),
    whoWeAre: texto(f.who_we_are),
    whatWeDo: texto(f.what_we_do),
    image: urlImagen(f.image_path),
    contact: {
      whatsapp: texto(f.whatsapp),
      phone: texto(f.phone),
      email: texto(f.email),
      social: texto(f.social),
    },
    catalogUrl: f.catalog_url ?? undefined,
    isExample: f.is_example,
  };
}

interface FilaProducto {
  slug: string;
  name: string;
  type: Product["type"];
  description: string;
  presentation: string | null;
  features: string[] | null;
  availability: Product["availability"] | null;
  catalog_url: string | null;
  is_example: boolean;
  communities: { slug: string } | null;
  product_images: { storage_path: string; alt: string; position: number }[] | null;
}

function aProducto(f: FilaProducto): Product {
  const fotos = [...(f.product_images ?? [])].sort((a, b) => a.position - b.position);
  return {
    id: f.slug,
    slug: f.slug,
    name: f.name,
    type: f.type,
    communityId: f.communities?.slug ?? "",
    description: f.description,
    presentation: texto(f.presentation),
    features: f.features ?? [],
    availability: f.availability ?? undefined,
    images: fotos.map((i) => ({ src: urlImagen(i.storage_path), alt: i.alt })),
    catalogUrl: f.catalog_url ?? undefined,
    isExample: f.is_example,
  };
}

interface FilaEvento {
  slug: string;
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  localidad: CalendarEvent["localidad"];
  type: CalendarEvent["type"];
  organizer: CalendarEvent["organizer"];
  description: string | null;
  image_path: string | null;
  is_example: boolean;
  communities: { slug: string } | null;
}

function aEvento(f: FilaEvento): CalendarEvent {
  return {
    id: f.slug,
    title: f.title,
    date: f.date,
    startTime: texto(f.start_time),
    endTime: texto(f.end_time),
    location: f.location,
    localidad: f.localidad,
    type: f.type,
    organizer: f.organizer,
    communityId: f.communities?.slug ?? "",
    description: texto(f.description),
    image: urlImagen(f.image_path),
    isExample: f.is_example,
  };
}

interface FilaNoticia {
  slug: string;
  type: NewsItem["type"];
  title: string;
  date: string;
  summary: string | null;
  full_text: string | null;
  image_path: string | null;
  is_example: boolean;
}

function aNoticia(f: FilaNoticia): NewsItem {
  return {
    id: f.slug,
    type: f.type,
    title: f.title,
    date: f.date,
    summary: texto(f.summary),
    fullText: texto(f.full_text),
    image: urlImagen(f.image_path),
    isExample: f.is_example,
  };
}

// --- Consultas -------------------------------------------------------------

/** Cualquier fallo de la base sale como este error, para distinguirlo de un bug. */
export class SupabaseCaido extends Error {
  constructor(que: string, causa: unknown) {
    super(`No se pudo leer ${que} de Supabase: ${(causa as Error)?.message ?? causa}`);
    this.name = "SupabaseCaido";
  }
}

export async function obtenerComunidades(): Promise<Community[]> {
  "use cache";
  cacheTag(ETIQUETAS.comunidades);
  cacheLife(VIDA_CACHE);

  const { data, error } = await supabase()
    .from("communities")
    .select(
      "slug, name, category, localidad, ubicacion, short_description, who_we_are, what_we_do, image_path, lat, lng, whatsapp, phone, email, social, catalog_url, is_example"
    )
    .order("orden")
    .order("slug");

  if (error) throw new SupabaseCaido("las comunidades", error);
  return (data as FilaComunidad[]).map(aComunidad);
}

export async function obtenerProductos(): Promise<Product[]> {
  "use cache";
  cacheTag(ETIQUETAS.productos, ETIQUETAS.comunidades);
  cacheLife(VIDA_CACHE);

  const { data, error } = await supabase()
    .from("products")
    .select(
      "slug, name, type, description, presentation, features, availability, catalog_url, is_example, communities(slug), product_images(storage_path, alt, position)"
    )
    .order("orden")
    .order("slug");

  if (error) throw new SupabaseCaido("los productos", error);
  return (data as unknown as FilaProducto[]).map(aProducto);
}

export async function obtenerEventos(): Promise<CalendarEvent[]> {
  "use cache";
  cacheTag(ETIQUETAS.eventos, ETIQUETAS.comunidades);
  cacheLife(VIDA_CACHE);

  const { data, error } = await supabase()
    .from("events")
    .select(
      "slug, title, date, start_time, end_time, location, localidad, type, organizer, description, image_path, is_example, communities(slug)"
    )
    .order("orden")
    .order("slug");

  if (error) throw new SupabaseCaido("los eventos", error);
  return (data as unknown as FilaEvento[]).map(aEvento);
}

export async function obtenerNoticias(): Promise<NewsItem[]> {
  "use cache";
  cacheTag(ETIQUETAS.noticias);
  cacheLife(VIDA_CACHE);

  const { data, error } = await supabase()
    .from("news")
    .select("slug, type, title, date, summary, full_text, image_path, is_example")
    .order("orden")
    .order("slug");

  if (error) throw new SupabaseCaido("las noticias", error);
  return (data as FilaNoticia[]).map(aNoticia);
}

/**
 * Los puntos del mapa salen de las comunidades que tienen coordenada. Antes eran una
 * lista aparte; la relación siempre fue de una a una, así que ahora viven en la misma
 * fila y aquí se vuelven a presentar con la forma que espera el mapa.
 */
export async function obtenerMarcadores(): Promise<MapMarker[]> {
  "use cache";
  cacheTag(ETIQUETAS.comunidades);
  cacheLife(VIDA_CACHE);

  const { data, error } = await supabase()
    .from("communities")
    .select("slug, lat, lng")
    .not("lat", "is", null)
    .order("orden")
    .order("slug");

  if (error) throw new SupabaseCaido("los puntos del mapa", error);

  return (data as { slug: string; lat: number; lng: number }[]).map((f) => ({
    id: `marker-${f.slug}`,
    communityId: f.slug,
    lat: f.lat,
    lng: f.lng,
  }));
}
