import type { NextConfig } from "next";

/**
 * El host de Supabase sale de la misma variable que usa el resto del sitio, para que no
 * haya dos sitios donde cambiar el proyecto. Si falta, no se agrega ningún patrón: las
 * fotos no cargarán, pero el build no se rompe por eso.
 */
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  // Habilita `use cache`, `cacheTag` y `cacheLife` (ver lib/datos.ts). Es lo que
  // reemplaza a unstable_cache en Next 16.
  cacheComponents: true,

  images: {
    // Las fotos ya no están en public/: viven en el bucket "imagenes" de Supabase, y
    // next/image solo optimiza imágenes de hosts declarados aquí.
    remotePatterns: supabase
      ? [new URL(`${supabase}/storage/v1/object/public/imagenes/**`)]
      : [],
  },
};

export default nextConfig;
