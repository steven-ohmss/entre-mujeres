"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { clienteNavegador } from "@/lib/sesion-navegador";

/**
 * "Iniciar sesión" en el header y el pie; con sesión abierta, "Panel" y "Cerrar sesión".
 *
 * La sesión se resuelve en el navegador y no en el servidor, y es a propósito. Las
 * páginas públicas son estáticas: si el servidor tuviera que mirar la cookie para dibujar
 * este enlace, dejarían de serlo y cada visita pasaría por el servidor para decidir una
 * sola palabra. Así el HTML sigue siendo el mismo para todo el mundo, se guarda en caché,
 * y lo único que cambia después es este enlace.
 *
 * Mientras se resuelve se muestra "Iniciar sesión", que es lo que ve quien no ha entrado,
 * es decir casi todo el mundo. Para el equipo el cambio ocurre en un parpadeo.
 */

type Variante = "header" | "header-movil" | "pie";

export default function AccesoCuenta({ variante, onNavegar }: { variante: Variante; onNavegar?: () => void }) {
  const router = useRouter();
  const [correo, setCorreo] = useState<string | null>(null);

  /**
   * Nada de aquí puede tumbar la página.
   *
   * Esto vive en la barra de navegación, o sea en todas las páginas del sitio. Si
   * lanzara, se llevaría por delante la página entera y el visitante vería la pantalla
   * de error por no poder saber si hay una sesión abierta, que es un dato que no
   * necesita para leer el sitio. Si algo falla, el enlace se queda en "Iniciar sesión",
   * que es lo que ve quien no ha entrado: lo correcto para casi todo el mundo.
   */
  useEffect(() => {
    let vigente = true;
    let desuscribir: (() => void) | undefined;

    try {
      const supabase = clienteNavegador();

      supabase.auth
        .getUser()
        .then(({ data }) => {
          if (vigente) setCorreo(data.user?.email ?? null);
        })
        .catch(() => {
          // Sin red o sin sesión válida: se queda como "Iniciar sesión".
        });

      // Mantiene el enlace al día si la persona entra o sale en otra pestaña.
      const { data: suscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) => {
        setCorreo(sesion?.user?.email ?? null);
      });
      desuscribir = () => suscripcion.subscription.unsubscribe();
    } catch {
      // Falta la configuración de Supabase, o el navegador bloquea el almacenamiento.
    }

    return () => {
      vigente = false;
      desuscribir?.();
    };
  }, []);

  const salir = async () => {
    try {
      await clienteNavegador().auth.signOut();
    } catch {
      // Aunque falle el cierre en el servidor, conviene seguir: el router recarga y la
      // sesión local ya quedó limpia.
    }
    setCorreo(null);
    onNavegar?.();
    router.refresh();
  };

  if (variante === "pie") {
    return correo ? (
      <>
        <li>
          <Link href="/admin" className="flex min-h-12 items-center gap-2 transition hover:text-blanco">
            <LayoutDashboard size={17} className="shrink-0" aria-hidden="true" />
            Panel
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={salir}
            className="flex min-h-12 items-center gap-2 text-left transition hover:text-blanco"
          >
            <LogOut size={17} className="shrink-0" aria-hidden="true" />
            Cerrar sesión
          </button>
        </li>
      </>
    ) : (
      <li>
        <Link
          href="/iniciar-sesion"
          className="flex min-h-12 items-center gap-2 transition hover:text-blanco"
        >
          <LogIn size={17} className="shrink-0" aria-hidden="true" />
          Iniciar sesión
        </Link>
      </li>
    );
  }

  if (variante === "header-movil") {
    return correo ? (
      <div className="mt-2 flex flex-col gap-1">
        <Link href="/admin" onClick={onNavegar} className="nav-movil">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
            <LayoutDashboard size={22} aria-hidden="true" />
          </span>
          Panel
        </Link>
        <button type="button" onClick={salir} className="nav-movil text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
            <LogOut size={22} aria-hidden="true" />
          </span>
          Cerrar sesión
        </button>
      </div>
    ) : (
      <Link href="/iniciar-sesion" onClick={onNavegar} className="nav-movil mt-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
          <LogIn size={22} aria-hidden="true" />
        </span>
        Iniciar sesión
      </Link>
    );
  }

  // header (escritorio)
  return correo ? (
    <div className="flex items-center gap-2">
      <Link href="/admin" className="nav-link px-2 py-2">
        <LayoutDashboard size={17} aria-hidden="true" />
        Panel
      </Link>
      <button type="button" onClick={salir} className="nav-link px-2 py-2">
        <LogOut size={17} aria-hidden="true" />
        Cerrar sesión
      </button>
    </div>
  ) : (
    <Link href="/iniciar-sesion" className="nav-link px-2 py-2">
      <LogIn size={17} aria-hidden="true" />
      Iniciar sesión
    </Link>
  );
}
