import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Conexión de solo lectura a Supabase, para las páginas públicas.
 *
 * Usa la clave publishable a propósito, no la secret: lo único que el sitio necesita es
 * leer lo que cualquier visitante puede leer, y de eso se encarga el RLS (ver la
 * migración de rls en supabase/migrations/). Si alguna vez esta clave se filtrara, lo
 * que alguien podría hacer con ella es exactamente lo que ya puede hacer entrando a la
 * página: leer. La clave secret no entra a la aplicación; vive solo en el script de
 * carga, que se corre a mano.
 */

export class SupabaseNoConfigurado extends Error {
  constructor(faltantes: string[]) {
    super(`Faltan variables de entorno de Supabase: ${faltantes.join(", ")}`);
    this.name = "SupabaseNoConfigurado";
  }
}

let cliente: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const faltantes = [
    !url && "NEXT_PUBLIC_SUPABASE_URL",
    !clave && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ].filter(Boolean) as string[];

  if (faltantes.length > 0) throw new SupabaseNoConfigurado(faltantes);

  cliente = createClient(url as string, clave as string, {
    auth: { persistSession: false },
  });
  return cliente;
}

/** Nombre del bucket donde viven las fotos. */
export const BUCKET = "imagenes";

/**
 * De la ruta guardada en la base ("productos/queso-campesino.jpg") a la URL pública
 * completa que puede pedir el navegador.
 *
 * Devuelve "" cuando no hay foto, que es lo que el componente Foto entiende como
 * "todavía no hay": muestra el recuadro de "Foto próximamente" en vez de un hueco.
 */
export function urlImagen(ruta: string | null | undefined): string {
  const limpia = ruta?.trim();
  if (!limpia) return "";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "";
  return `${url}/storage/v1/object/public/${BUCKET}/${limpia}`;
}
