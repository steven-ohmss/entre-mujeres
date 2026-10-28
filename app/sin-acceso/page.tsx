import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldX } from "lucide-react";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import PantallaSesion from "@/components/PantallaSesion";
import { esAdmin, usuarioActual } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Sin acceso · Entre mujeres",
  robots: { index: false, follow: false },
};

export const instant = false;

/**
 * Para quien inició sesión pero no está en la tabla `admins`.
 *
 * Vive fuera de /admin a propósito. Si el aviso se dibujara dentro del layout del panel,
 * Next renderizaría igualmente la página de adentro en paralelo —aunque no se viera— y
 * el contenido del panel viajaría en la respuesta.
 *
 * Quién puede ver esta pantalla lo decide proxy.ts antes de renderizarla. Lo de abajo es
 * la segunda línea, por si algún día cambia el matcher.
 */
export default async function PaginaSinAcceso() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/iniciar-sesion");

  if (await esAdmin()) redirect("/admin");

  return (
    <PantallaSesion
      titulo="No tienes acceso"
      descripcion="Tu cuenta existe, pero todavía no tiene permiso para entrar al panel. Si crees que es un error, escríbele a quien te invitó."
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <ShieldX size={46} strokeWidth={1.5} className="text-rosa-oscuro" aria-hidden="true" />
        <p className="break-words text-base text-texto-suave">
          Entraste como <strong className="text-texto">{usuario.email}</strong>
        </p>
        <BotonCerrarSesion className="btn-primary w-full" />
        <Link href="/" className="min-h-12 text-base font-semibold text-rosa-oscuro hover:underline">
          Ir al sitio
        </Link>
      </div>
    </PantallaSesion>
  );
}
