import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Sesión del lado del servidor.
 *
 * Es una conexión distinta de la de lib/supabase.ts. Aquella lee el contenido público y
 * no sabe quién está mirando, por eso se puede cachear. Esta lee las cookies de la
 * persona que hizo la petición, así que nunca puede ir dentro de un `use cache`: por
 * definición cambia según quién entre.
 *
 * Siempre con la clave publishable. La secret no entra a la aplicación.
 */

export function clienteServidor(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !clave) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para la sesión."
    );
  }

  return createServerClient(url, clave, {
    cookies: {
      async getAll() {
        return (await cookies()).getAll();
      },
      async setAll(aGuardar) {
        try {
          const tarro = await cookies();
          for (const { name, value, options } of aGuardar) {
            tarro.set(name, value, options);
          }
        } catch {
          // Desde un Server Component no se pueden escribir cookies. No es un problema:
          // el proxy ya refrescó la sesión antes de llegar aquí, así que lo único que se
          // pierde es una reescritura que ya ocurrió.
        }
      },
    },
  });
}

/**
 * Quién está en sesión, o null.
 *
 * Usa getUser() y no getSession(): getSession lee la cookie y se fía de lo que diga,
 * mientras que getUser le pregunta a Supabase si el token es válido de verdad. Para
 * decidir quién entra al panel, la diferencia importa.
 */
export async function usuarioActual(): Promise<User | null> {
  const { data, error } = await clienteServidor().auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

/**
 * Si la persona está en la tabla admins.
 *
 * La consulta la hace ella misma, no la clave secret: el RLS de admins no deja leer la
 * tabla, así que se pregunta por la función is_admin(), que responde sí o no sin
 * enseñar la lista de administradores.
 */
export async function esAdmin(): Promise<boolean> {
  const { data, error } = await clienteServidor().rpc("is_admin");
  if (error) return false;
  return data === true;
}
