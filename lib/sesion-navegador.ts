"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Conexión del navegador, para las pantallas de sesión (entrar, salir, definir
 * contraseña) y para que el header sepa si hay alguien dentro.
 *
 * Va con la clave publishable, que es pública por diseño: lo único que permite es lo que
 * cualquier visitante puede hacer. La clave secret nunca llega al navegador.
 */

let cliente: SupabaseClient | null = null;

export function clienteNavegador(): SupabaseClient {
  if (cliente) return cliente;

  cliente = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  return cliente;
}

/** Traduce los errores de Supabase, que vienen en inglés y en jerga técnica. */
export function mensajeDeError(error: { message?: string; code?: string } | null): string {
  const bruto = (error?.message ?? "").toLowerCase();

  if (bruto.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (bruto.includes("email not confirmed")) {
    return "Todavía no has confirmado tu correo. Busca el mensaje de invitación que te enviamos.";
  }
  if (bruto.includes("user not found")) return "No encontramos una cuenta con ese correo.";
  if (bruto.includes("email rate limit") || bruto.includes("too many requests")) {
    return "Lo intentaste varias veces seguidas. Espera un minuto y vuelve a probar.";
  }
  if (bruto.includes("password should be at least")) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (bruto.includes("same as the old password") || bruto.includes("should be different")) {
    return "La contraseña nueva tiene que ser distinta de la anterior.";
  }
  if (bruto.includes("token has expired") || bruto.includes("expired")) {
    return "El enlace del correo ya venció. Pide uno nuevo.";
  }
  if (bruto.includes("failed to fetch") || bruto.includes("network")) {
    return "No pudimos conectarnos. Revisa tu conexión y vuelve a intentar.";
  }

  return "Algo no salió bien. Vuelve a intentarlo en un momento.";
}
