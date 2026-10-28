// Copia el contenido de supabase/seed/contenido-inicial.ts a Supabase y sube las imágenes de public/images
// al bucket "imagenes".
//
//   node --env-file=.env.local --import ./scripts/alias-arroba.mjs scripts/cargar-supabase.mjs
//
// Opciones:
//   --dry-run   dice qué haría, sin tocar nada
//
// Se puede correr las veces que haga falta: todo va por upsert contra la clave natural
// (el slug de cada fila, la ruta de cada archivo), así que la segunda corrida actualiza
// lo que cambió en vez de duplicarlo.
//
// Usa SUPABASE_SERVICE_ROLE_KEY, la clave secret, que se salta el RLS. Por eso este
// script solo se corre desde un computador de confianza y nunca desde el navegador.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  communities,
  products,
  calendarEvents,
  newsItems,
  mapMarkers,
} from "../supabase/seed/contenido-inicial.ts";

const SECO = process.argv.includes("--dry-run");
const BUCKET = "imagenes";
const RAIZ_IMAGENES = "public/images";

// --- Conexión --------------------------------------------------------------

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

// En seco no se conecta a nada, así que se puede probar antes de tener las claves.
if (!SECO && (!url || !secret)) {
  console.error(
    [
      "Faltan las variables de entorno.",
      "",
      "  NEXT_PUBLIC_SUPABASE_URL   " + (url ? "ok" : "FALTA"),
      "  SUPABASE_SERVICE_ROLE_KEY  " + (secret ? "ok" : "FALTA"),
      "",
      "Se leen de .env.local. Hay que correr el script con --env-file:",
      "  node --env-file=.env.local --import ./scripts/alias-arroba.mjs scripts/cargar-supabase.mjs",
      "",
      "Para ver qué haría sin tener todavía las claves: agrega --dry-run",
    ].join("\n")
  );
  process.exit(1);
}

const db = SECO ? null : createClient(url, secret, { auth: { persistSession: false } });

// --- Ayudas ----------------------------------------------------------------

/** "PENDIENTE", "" y undefined son lo mismo: todavía no hay dato. En la base, null. */
function oNulo(valor) {
  if (typeof valor !== "string") return valor ?? null;
  const limpio = valor.trim();
  if (limpio.length === 0 || limpio.toUpperCase() === "PENDIENTE") return null;
  return limpio;
}

/** "/images/productos/queso.jpg" -> "productos/queso.jpg" (la ruta dentro del bucket). */
function rutaEnBucket(src) {
  const limpio = oNulo(src);
  if (!limpio) return null;
  return limpio.replace(/^\/?images\//, "");
}

const TIPOS_MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/** Todos los archivos bajo public/images, con su ruta relativa a esa carpeta. */
async function listarImagenes(dir = RAIZ_IMAGENES, prefijo = "") {
  const encontrados = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const relativa = prefijo ? `${prefijo}/${entrada.name}` : entrada.name;
    if (entrada.isDirectory()) {
      encontrados.push(...(await listarImagenes(path.join(dir, entrada.name), relativa)));
    } else if (TIPOS_MIME[path.extname(entrada.name).toLowerCase()]) {
      encontrados.push(relativa);
    }
  }
  return encontrados;
}

function fallar(paso, error) {
  console.error(`\n✗ ${paso}\n  ${error.message ?? error}`);
  process.exit(1);
}

// --- 1. Imágenes -----------------------------------------------------------

async function subirImagenes() {
  const archivos = (await listarImagenes()).sort();
  console.log(`\n1. Imágenes -> bucket "${BUCKET}" (${archivos.length} archivos)`);

  if (SECO) {
    for (const a of archivos) console.log(`   [seco] subiría ${a}`);
    return archivos.length;
  }

  for (const relativa of archivos) {
    const cuerpo = readFileSync(path.join(RAIZ_IMAGENES, relativa));
    // upsert: la segunda corrida sobrescribe el mismo archivo en vez de crear otro.
    const { error } = await db.storage.from(BUCKET).upload(relativa, cuerpo, {
      contentType: TIPOS_MIME[path.extname(relativa).toLowerCase()],
      upsert: true,
    });
    if (error) fallar(`subiendo ${relativa}`, error);
    console.log(`   ✓ ${relativa}`);
  }
  return archivos.length;
}

// --- 2. Comunidades --------------------------------------------------------

function filaComunidad(c, orden) {
  const marcador = mapMarkers.find((m) => m.communityId === c.id);
  return {
    orden,
    slug: c.slug,
    name: c.name,
    category: c.category ?? null,
    localidad: c.localidad,
    ubicacion: c.ubicacion,
    short_description: oNulo(c.shortDescription),
    who_we_are: oNulo(c.whoWeAre),
    what_we_do: oNulo(c.whatWeDo),
    image_path: rutaEnBucket(c.image),
    // Las comunidades todavía no guardan una descripción de su foto; cuando la tengan,
    // sale de aquí (ver 11.2 de docs/guia-material.md).
    image_alt: null,
    lat: marcador?.lat ?? null,
    lng: marcador?.lng ?? null,
    whatsapp: oNulo(c.contact.whatsapp),
    phone: oNulo(c.contact.phone),
    email: oNulo(c.contact.email),
    social: oNulo(c.contact.social),
    catalog_url: oNulo(c.catalogUrl),
    is_example: c.isExample,
  };
}

async function cargarComunidades() {
  const filas = communities.map((c, i) => filaComunidad(c, i));
  console.log(`\n2. Comunidades (${filas.length})`);
  if (SECO) {
    for (const f of filas) console.log(`   [seco] upsert ${f.slug}`);
    return new Map();
  }

  const { data, error } = await db
    .from("communities")
    .upsert(filas, { onConflict: "slug" })
    .select("id, slug");
  if (error) fallar("cargando comunidades", error);

  for (const f of filas) console.log(`   ✓ ${f.slug}`);
  return new Map(data.map((c) => [c.slug, c.id]));
}

// --- 3. Productos y sus fotos ----------------------------------------------

async function cargarProductos(idPorSlugComunidad) {
  const slugPorId = new Map(communities.map((c) => [c.id, c.slug]));
  const filas = products.map((p, orden) => {
    const slugComunidad = slugPorId.get(p.communityId);
    const idComunidad = idPorSlugComunidad.get(slugComunidad);
    if (!SECO && !idComunidad) {
      fallar(`producto ${p.slug}`, new Error(`su comunidad "${p.communityId}" no existe`));
    }
    return {
      orden,
      slug: p.slug,
      name: p.name,
      type: p.type,
      community_id: idComunidad ?? null,
      description: p.description,
      presentation: oNulo(p.presentation),
      features: p.features,
      availability: p.availability ?? null,
      catalog_url: oNulo(p.catalogUrl),
      is_example: p.isExample,
    };
  });

  console.log(`\n3. Productos (${filas.length})`);

  let idPorSlug = new Map();
  if (SECO) {
    for (const f of filas) console.log(`   [seco] upsert ${f.slug}`);
  } else {
    const { data, error } = await db
      .from("products")
      .upsert(filas, { onConflict: "slug" })
      .select("id, slug");
    if (error) fallar("cargando productos", error);
    idPorSlug = new Map(data.map((p) => [p.slug, p.id]));
    for (const f of filas) console.log(`   ✓ ${f.slug}`);
  }

  // Fotos de producto
  const fotos = products.flatMap((p) =>
    p.images.map((img, i) => ({
      product_id: idPorSlug.get(p.slug) ?? null,
      storage_path: rutaEnBucket(img.src),
      alt: img.alt,
      position: i,
    }))
  );

  console.log(`\n4. Fotos de producto (${fotos.length})`);
  if (SECO) {
    for (const f of fotos) console.log(`   [seco] upsert ${f.storage_path}`);
    return;
  }

  if (fotos.length > 0) {
    const { error: errorFotos } = await db
      .from("product_images")
      .upsert(fotos, { onConflict: "storage_path" });
    if (errorFotos) fallar("cargando fotos de producto", errorFotos);
  }

  // Si una foto dejó de estar en supabase/seed/contenido-inicial.ts, su fila sobra: sin esto la base se
  // quedaría mostrando una foto que el sitio ya no usa.
  const vigentes = fotos.map((f) => f.storage_path);
  const limpieza = db.from("product_images").delete();
  // Sin fotos vigentes la lista "in ()" no es SQL válido, así que ahí sobran todas.
  const { data: sobrantes, error: errorSobras } = await (vigentes.length > 0
    ? limpieza.not("storage_path", "in", `(${vigentes.map((v) => `"${v}"`).join(",")})`)
    : limpieza.not("storage_path", "is", null)
  ).select("storage_path");
  if (errorSobras) fallar("limpiando fotos que ya no se usan", errorSobras);

  for (const f of fotos) console.log(`   ✓ ${f.storage_path}`);
  for (const s of sobrantes ?? []) console.log(`   − ${s.storage_path} (ya no se usa)`);
}

// --- 4. Eventos y noticias -------------------------------------------------

async function cargarEventos(idPorSlugComunidad) {
  const slugPorId = new Map(communities.map((c) => [c.id, c.slug]));
  const filas = calendarEvents.map((e, orden) => ({
    orden,
    // Los eventos ya se identifican con un texto tipo slug ("feria-campesina-usme").
    slug: e.id,
    title: e.title,
    date: e.date,
    start_time: oNulo(e.startTime),
    end_time: oNulo(e.endTime),
    location: e.location,
    localidad: e.localidad,
    type: e.type,
    organizer: e.organizer,
    community_id: idPorSlugComunidad.get(slugPorId.get(e.communityId)) ?? null,
    description: oNulo(e.description),
    image_path: rutaEnBucket(e.image),
    image_alt: null,
    is_example: e.isExample,
  }));

  console.log(`\n5. Eventos (${filas.length})`);
  if (SECO) {
    for (const f of filas) console.log(`   [seco] upsert ${f.slug}`);
    return;
  }
  const { error } = await db.from("events").upsert(filas, { onConflict: "slug" });
  if (error) fallar("cargando eventos", error);
  for (const f of filas) console.log(`   ✓ ${f.slug}`);
}

async function cargarNoticias() {
  const filas = newsItems.map((n, orden) => ({
    orden,
    slug: n.id,
    type: n.type,
    title: n.title,
    date: n.date,
    summary: oNulo(n.summary),
    full_text: oNulo(n.fullText),
    image_path: rutaEnBucket(n.image),
    image_alt: null,
    is_example: n.isExample,
  }));

  console.log(`\n6. Noticias (${filas.length})`);
  if (SECO) {
    for (const f of filas) console.log(`   [seco] upsert ${f.slug}`);
    return;
  }
  const { error } = await db.from("news").upsert(filas, { onConflict: "slug" });
  if (error) fallar("cargando noticias", error);
  for (const f of filas) console.log(`   ✓ ${f.slug}`);
}

// --- Orden -----------------------------------------------------------------

console.log(
  SECO
    ? "Corrida en seco: no se escribe nada."
    : `Cargando en ${url}`
);

await subirImagenes();
const idPorSlugComunidad = await cargarComunidades();
await cargarProductos(idPorSlugComunidad);
await cargarEventos(idPorSlugComunidad);
await cargarNoticias();

console.log(
  SECO
    ? "\nListo (en seco). Quita --dry-run para escribir de verdad."
    : "\nListo. Se puede volver a correr cuando cambie supabase/seed/contenido-inicial.ts."
);
