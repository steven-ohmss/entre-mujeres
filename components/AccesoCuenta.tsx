"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import { clienteNavegador } from "@/lib/sesion-navegador";

/**
 * El acceso a la cuenta en la barra de navegación y en el pie.
 *
 * La sesión se resuelve en el navegador y no en el servidor, y es a propósito. Las
 * páginas públicas son estáticas: si el servidor tuviera que mirar la cookie para dibujar
 * esto, dejarían de serlo y cada visita pasaría por el servidor para decidir una sola
 * palabra. Así el HTML sigue siendo el mismo para todo el mundo y se guarda en caché.
 *
 * El precio de resolverlo en el navegador es que la respuesta llega tarde, y si lo que se
 * dibuja cambia de tamaño, el header se mueve delante de quien lo está mirando. Por eso
 * en la barra esto SIEMPRE ocupa un botón redondo de 48 px: mientras no se sabe, con
 * sesión y sin ella. Lo único que cambia es lo que hay dentro.
 */

type Variante = "header" | "header-movil" | "pie";
type Estado = { fase: "resolviendo" } | { fase: "fuera" } | { fase: "dentro"; correo: string };

/** Hueco del tamaño exacto del botón, para que nada se mueva al resolverse la sesión. */
const TAMANO_BOTON = "h-12 w-12";

export default function AccesoCuenta({
  variante,
  onNavegar,
}: {
  variante: Variante;
  onNavegar?: () => void;
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>({ fase: "resolviendo" });
  const [abierto, setAbierto] = useState(false);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const idMenu = useId();

  /**
   * Nada de aquí puede tumbar la página.
   *
   * Esto vive en la barra de navegación, o sea en todas las páginas del sitio. Si
   * lanzara, se llevaría por delante la página entera y el visitante vería la pantalla
   * de error por no poder saber si hay una sesión abierta, que es un dato que no
   * necesita para leer el sitio. Si algo falla, queda como si no hubiera sesión, que es
   * lo correcto para casi todo el mundo.
   */
  useEffect(() => {
    let vigente = true;
    let desuscribir: (() => void) | undefined;

    const aplicar = (correo: string | null | undefined) =>
      setEstado(correo ? { fase: "dentro", correo } : { fase: "fuera" });

    // Todo lo que puede fallar va dentro de una promesa, así cualquier tropiezo llega
    // por un callback y no hay forma de que una excepción se escape de aquí.
    Promise.resolve()
      .then(async () => {
        const supabase = clienteNavegador();

        // Mantiene esto al día si la persona entra o sale en otra pestaña.
        const { data: suscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) => {
          aplicar(sesion?.user?.email);
        });
        desuscribir = () => suscripcion.subscription.unsubscribe();

        const { data } = await supabase.auth.getUser();
        if (vigente) aplicar(data.user?.email);
      })
      .catch(() => {
        // Sin red, sin configuración, o el navegador bloquea el almacenamiento: se
        // queda como si no hubiera sesión, que es lo correcto para casi todo el mundo.
        if (vigente) setEstado({ fase: "fuera" });
      });

    return () => {
      vigente = false;
      desuscribir?.();
    };
  }, []);

  // Cerrar el menú al tocar fuera o al presionar Escape, devolviendo el foco al botón:
  // quien navega con teclado no debe quedarse sin saber dónde está.
  useEffect(() => {
    if (!abierto) return;

    const alTocarFuera = (evento: MouseEvent) => {
      if (!contenedorRef.current?.contains(evento.target as Node)) setAbierto(false);
    };
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", alTocarFuera);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("mousedown", alTocarFuera);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  const salir = async () => {
    setAbierto(false);
    try {
      await clienteNavegador().auth.signOut();
    } catch {
      // Aunque falle en el servidor conviene seguir: la sesión local ya quedó limpia.
    }
    setEstado({ fase: "fuera" });
    onNavegar?.();
    router.push("/");
    router.refresh();
  };

  // --- El pie: aquí sí hay sitio para texto, y no hay nada que se mueva -------

  if (variante === "pie") {
    if (estado.fase === "dentro") {
      return (
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
      );
    }

    // Mientras se resuelve se muestra "Iniciar sesión": es lo que verá casi todo el mundo.
    return (
      <li>
        <Link href="/iniciar-sesion" className="flex min-h-12 items-center gap-2 transition hover:text-blanco">
          <LogIn size={17} className="shrink-0" aria-hidden="true" />
          Iniciar sesión
        </Link>
      </li>
    );
  }

  // --- El menú de celular: con texto, que ahí el espacio sobra ----------------

  if (variante === "header-movil") {
    if (estado.fase === "dentro") {
      return (
        <div className="mt-5 border-t border-crema/15 pt-5">
          <p className="px-2 text-sm text-crema/60">Sesión iniciada como</p>
          <p className="mb-2 break-words px-2 text-base font-semibold text-crema">{estado.correo}</p>

          <Link href="/admin" onClick={onNavegar} className="nav-movil">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
              <LayoutDashboard size={22} aria-hidden="true" />
            </span>
            Panel
          </Link>

          <button type="button" onClick={salir} className="nav-movil w-full text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
              <LogOut size={22} aria-hidden="true" />
            </span>
            Cerrar sesión
          </button>
        </div>
      );
    }

    return (
      <div className="mt-5 border-t border-crema/15 pt-5">
        <Link href="/iniciar-sesion" onClick={onNavegar} className="nav-movil">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
            <LogIn size={22} aria-hidden="true" />
          </span>
          Iniciar sesión
        </Link>
      </div>
    );
  }

  // --- La barra en pantalla de computador ------------------------------------
  //
  // Siempre el mismo botón redondo, pase lo que pase con la sesión. Antes había aquí
  // uno o dos enlaces de texto según el caso, y con la sesión abierta ("Panel" y
  // "Cerrar sesión") el botón "Sé parte" se salía de la pantalla.

  const claseBoton =
    `flex ${TAMANO_BOTON} shrink-0 items-center justify-center rounded-full border border-crema/35 ` +
    "text-crema transition hover:bg-crema/15 focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-rosa-claro";

  if (estado.fase === "resolviendo") {
    // Un hueco del tamaño exacto del botón. aria-hidden porque no hay nada que anunciar
    // todavía: el lector de pantalla lo leerá cuando sepamos qué es.
    return <div aria-hidden="true" className={`${TAMANO_BOTON} shrink-0`} />;
  }

  if (estado.fase === "fuera") {
    return (
      <Link href="/iniciar-sesion" aria-label="Iniciar sesión" title="Iniciar sesión" className={claseBoton}>
        <LogIn size={20} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <div ref={contenedorRef} className="relative shrink-0">
      <button
        ref={botonRef}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label={`Cuenta de ${estado.correo}`}
        title={estado.correo}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={abierto ? idMenu : undefined}
        className={claseBoton}
      >
        <UserRound size={20} aria-hidden="true" />
      </button>

      {abierto ? (
        <div
          id={idMenu}
          role="menu"
          aria-label="Opciones de la cuenta"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-blanco py-2 shadow-[0_10px_30px_rgba(30,35,30,0.2)]"
        >
          <p className="px-4 pb-2 pt-1 text-sm text-texto-suave">Sesión iniciada como</p>
          <p className="break-words px-4 pb-2 text-base font-semibold text-texto">{estado.correo}</p>

          <div className="my-1 border-t border-texto/10" />

          <Link
            href="/admin"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="flex min-h-12 items-center gap-3 px-4 text-base text-texto transition hover:bg-crema"
          >
            <LayoutDashboard size={19} className="shrink-0 text-verde-bosque" aria-hidden="true" />
            Panel
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={salir}
            className="flex min-h-12 w-full items-center gap-3 px-4 text-left text-base text-texto transition hover:bg-crema"
          >
            <LogOut size={19} className="shrink-0 text-rosa-oscuro" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}
