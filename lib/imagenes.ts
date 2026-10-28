"use client";

import { clienteNavegador } from "@/lib/sesion-navegador";
import { BUCKET } from "@/lib/supabase";
import { aSlug } from "@/lib/slug";

/**
 * Preparar y subir fotos desde el panel.
 *
 * La foto se achica en el propio navegador antes de salir. El público de este sitio son
 * mujeres del campo con datos limitados, y una foto de celular pesa entre 3 y 8 MB: si
 * se subiera tal cual, cada visita a la página pagaría ese peso. Reducirla aquí ahorra
 * esa subida y, sobre todo, esa descarga.
 *
 * Sube directo al bucket con la sesión de quien está en el panel, no a través del
 * servidor. Dos razones: las Server Actions tienen un límite de cuerpo pequeño y una
 * foto no cabe cómoda, y así es el RLS del bucket el que autoriza, con la misma regla
 * que protege todo lo demás. La clave secret no aparece por ningún lado.
 */

export const ANCHO_MAXIMO = 1600;
export const PESO_MAXIMO = 300 * 1024;
export const CALIDAD_INICIAL = 0.8;

export const CARPETAS = {
  productos: "productos",
  comunidades: "comunidades",
  eventos: "eventos",
  noticias: "noticias",
} as const;

export type Carpeta = (typeof CARPETAS)[keyof typeof CARPETAS];

const TIPOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export class ErrorDeImagen extends Error {}

/** Lee el archivo como imagen, o explica por qué no se puede. */
async function cargarImagen(archivo: File): Promise<HTMLImageElement> {
  if (!TIPOS_ACEPTADOS.includes(archivo.type)) {
    throw new ErrorDeImagen(
      "Ese archivo no es una foto. Sirven archivos .jpg, .png o .webp."
    );
  }

  const url = URL.createObjectURL(archivo);
  try {
    return await new Promise((resolver, rechazar) => {
      const img = new Image();
      img.onload = () => resolver(img);
      img.onerror = () =>
        rechazar(new ErrorDeImagen("No pudimos abrir esa foto. Puede estar dañada."));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** El ancho más pequeño al que se está dispuesto a llegar antes que dejarla pesada. */
const ANCHO_MINIMO = 900;

function dibujar(img: HTMLImageElement, ancho: number): HTMLCanvasElement {
  const alto = Math.round((img.naturalHeight / img.naturalWidth) * ancho);
  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new ErrorDeImagen("Tu navegador no pudo preparar la foto.");
  ctx.drawImage(img, 0, 0, ancho, alto);
  return lienzo;
}

/**
 * Achica y comprime hasta cumplir el peso.
 *
 * Primero baja la calidad por pasos, porque es lo que menos se nota. Si aun al mínimo
 * razonable sigue pesando, entonces reduce también el ancho. Hace falta el segundo paso:
 * una foto con mucho detalle (un mercado lleno, una tela estampada) puede seguir pasada
 * de peso a calidad 0,4, y ahí lo que sobra son píxeles, no calidad. Sin esta parte, la
 * prueba con una imagen muy detallada terminaba en 351 KB.
 */
export async function prepararFoto(archivo: File): Promise<Blob> {
  const img = await cargarImagen(archivo);

  let ancho = Math.min(ANCHO_MAXIMO, img.naturalWidth);
  let mejor: Blob | null = null;

  while (ancho >= ANCHO_MINIMO) {
    const lienzo = dibujar(img, ancho);

    let calidad = CALIDAD_INICIAL;
    let blob = await aBlob(lienzo, calidad);
    while (blob.size > PESO_MAXIMO && calidad > 0.4) {
      calidad = Math.round((calidad - 0.1) * 10) / 10;
      blob = await aBlob(lienzo, calidad);
    }

    mejor = blob;
    if (blob.size <= PESO_MAXIMO) return blob;

    ancho = Math.round(ancho * 0.8);
  }

  // Ni al ancho mínimo cabe. Se devuelve lo más liviano que se logró: una foto algo
  // pesada es mejor que no poder subirla, y el aviso del peso queda visible en pantalla.
  return mejor as Blob;
}

function aBlob(lienzo: HTMLCanvasElement, calidad: number): Promise<Blob> {
  return new Promise((resolver, rechazar) => {
    lienzo.toBlob(
      (b) => (b ? resolver(b) : rechazar(new ErrorDeImagen("No pudimos preparar la foto."))),
      "image/jpeg",
      calidad
    );
  });
}

/**
 * La ruta dentro del bucket. Se basa en el slug, como pide la guía de material, así que
 * al reemplazar la foto real basta con sobrescribir ese archivo.
 *
 * El sufijo numérico solo aparece de la segunda foto en adelante, para que la principal
 * conserve el nombre limpio.
 */
export function rutaDeFoto(carpeta: Carpeta, slug: string, posicion = 0): string {
  const base = aSlug(slug) || "foto";
  return `${carpeta}/${base}${posicion > 0 ? `-${posicion + 1}` : ""}.jpg`;
}

export interface FotoSubida {
  ruta: string;
  bytes: number;
}

/** Sube la foto ya preparada y devuelve su ruta dentro del bucket. */
export async function subirFoto(
  archivo: File,
  carpeta: Carpeta,
  slug: string,
  posicion = 0
): Promise<FotoSubida> {
  const listo = await prepararFoto(archivo);
  const ruta = rutaDeFoto(carpeta, slug, posicion);

  const { error } = await clienteNavegador().storage.from(BUCKET).upload(ruta, listo, {
    contentType: "image/jpeg",
    // upsert: reemplazar la foto de algo que ya existe no debe crear un archivo nuevo.
    upsert: true,
  });

  if (error) {
    if (/row-level security|unauthorized|403/i.test(error.message)) {
      throw new ErrorDeImagen("No tienes permiso para subir fotos. Vuelve a iniciar sesión.");
    }
    throw new ErrorDeImagen(`No pudimos subir la foto: ${error.message}`);
  }

  return { ruta, bytes: listo.size };
}

/** Borra una foto del bucket. Se usa al reemplazarla o quitarla, para no dejar basura. */
export async function borrarFoto(ruta: string): Promise<void> {
  if (!ruta) return;
  await clienteNavegador().storage.from(BUCKET).remove([ruta]);
}
