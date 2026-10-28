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
 * su contenido viajaría en la respuesta. Hoy eso solo serían cuatro títulos, pero en el
 * paso 5 el panel va a mostrar datos reales, y entonces sería una filtración. Sacando el
 * aviso aquí, el layout redirige y lo de adentro no llega a ejecutarse.
 */
export default async function PaginaSinAcceso() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/iniciar-sesion");

  // Si en el entretanto sí le dieron acceso, que entre en vez de quedarse atascada aquí.
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
