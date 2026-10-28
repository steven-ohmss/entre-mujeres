import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { clienteServidor } from "@/lib/sesion";

/**
 * A donde apuntan los enlaces de los correos de Supabase.
 *
 * El correo trae un `token_hash` de un solo uso. Aquí se canjea por una sesión con
 * verifyOtp y, si todo va bien, la persona sigue a donde corresponda. El token nunca
 * queda en el historial del navegador porque esta ruta redirige enseguida.
 *
 * Dos tipos de correo llegan aquí:
 *   invite    la invitación inicial  -> a definir su contraseña
 *   recovery  "olvidé mi contraseña" -> a definir una nueva
 *
 * Las plantillas de los dos correos se configuran en el panel de Supabase y tienen que
 * apuntar justo aquí (ver docs/supabase.md).
 */

const TIPOS_VALIDOS: EmailOtpType[] = ["invite", "recovery", "email_change", "signup", "magiclink"];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  // A dónde ir después. Solo se aceptan rutas de este sitio: un "next" con una
  // dirección externa convertiría este enlace en un salto a cualquier parte.
  const siguienteCrudo = searchParams.get("next") ?? "/definir-contrasena";
  const siguiente = siguienteCrudo.startsWith("/") ? siguienteCrudo : "/definir-contrasena";

  const alError = (motivo: string) =>
    NextResponse.redirect(`${origin}/iniciar-sesion?error=${motivo}`);

  if (!tokenHash || !tipo || !TIPOS_VALIDOS.includes(tipo)) {
    return alError("enlace-invalido");
  }

  const { error } = await clienteServidor().auth.verifyOtp({
    type: tipo,
    token_hash: tokenHash,
  });

  if (error) {
    // Casi siempre es que el enlace ya venció o ya se usó: son de un solo uso.
    return alError("enlace-vencido");
  }

  return NextResponse.redirect(`${origin}${siguiente}`);
}
