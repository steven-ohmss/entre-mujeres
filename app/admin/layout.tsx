import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Venus } from "lucide-react";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import { esAdmin, usuarioActual } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Panel · Entre mujeres",
  robots: { index: false, follow: false },
};

/**
 * El panel no se puede preparar de antemano: lo que muestra depende de quién entró, y
 * eso solo se sabe leyendo su cookie en cada petición. `instant = false` le dice a Next
 * que aquí la navegación sí espera al servidor, a diferencia de las páginas públicas.
 */
export const instant = false;

/**
 * La puerta del panel.
 *
 * El proxy (proxy.ts) ya rechazó a quien no ha iniciado sesión. Aquí se responde la otra
 * pregunta, la que solo sabe la base: si esta persona está en la tabla `admins`.
 *
 * Se comprueba en el servidor y en cada carga, no en el navegador. Esconder un botón no
 * protege nada; además, aunque alguien llegara hasta aquí, el RLS no lo dejaría escribir.
 * Esta comprobación es para que vea una explicación clara en vez de un panel que falla
 * en cada clic.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/iniciar-sesion?volver=/admin");

  // Segunda línea, por si algún día el matcher del proxy deja de cubrir una ruta nueva
  // bajo /admin. La que de verdad protege es la del proxy, que corre antes de que se
  // renderice nada; esta llegaría tarde para impedir que el contenido se envíe.
  if (!(await esAdmin())) redirect("/sin-acceso");

  return (
    <div className="min-h-screen bg-crema">
      <header className="border-b border-texto/10 bg-verde-bosque text-crema">
        <div className="container-page flex min-h-[72px] flex-wrap items-center justify-between gap-4 py-3">
          <Link href="/admin" className="flex items-center gap-2 font-titulos text-xl font-semibold">
            <Venus size={20} className="text-rosa-claro" strokeWidth={2.5} aria-hidden="true" />
            Panel · Entre mujeres
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="min-h-12 text-base font-semibold text-crema/80 hover:text-crema">
              Ver el sitio
            </Link>
            <BotonCerrarSesion className="btn-secondary btn-secondary--claro" />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
