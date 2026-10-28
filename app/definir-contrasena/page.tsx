import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PantallaSesion from "@/components/PantallaSesion";
import FormularioDefinirContrasena from "@/components/FormularioDefinirContrasena";
import { usuarioActual } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Define tu contraseña · Entre mujeres",
  robots: { index: false, follow: false },
};

/** Depende de la sesión que creó el enlace del correo, así que no se prepara de antemano. */
export const instant = false;

/**
 * Solo se llega aquí con una sesión abierta, que es la que crea /auth/confirm al canjear
 * el enlace del correo.
 *
 * De eso se encarga proxy.ts, antes de que esto se renderice. La comprobación de abajo
 * es la segunda línea: aquí llegaría tarde para impedir que la página se envíe, pero
 * mantiene la página correcta por sí sola y le dice a TypeScript que hay usuario.
 */
export default async function PaginaDefinirContrasena() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/iniciar-sesion?error=sin-sesion");

  return (
    <PantallaSesion
      titulo="Define tu contraseña"
      descripcion="Es la que usarás de ahora en adelante para entrar al panel. Elige una que puedas recordar y no la compartas."
    >
      <FormularioDefinirContrasena correo={usuario.email ?? ""} />
    </PantallaSesion>
  );
}
