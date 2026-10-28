"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CloudOff, RotateCw } from "lucide-react";

/**
 * Lo que se ve cuando algo falla del lado del servidor, casi siempre porque no se pudo
 * leer el contenido de Supabase.
 *
 * La intención es que nadie se encuentre una pantalla en blanco ni un error técnico: el
 * público de esta página son mujeres del campo, muchas con señal lenta, y lo que
 * necesitan saber es que el problema no es suyo y que pueden volver a intentar. El
 * detalle técnico va a la consola, para quien tenga que arreglarlo.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Entre mujeres: fallo al cargar la página", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-crema px-6 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rosa-palido">
          <CloudOff size={38} strokeWidth={1.5} className="text-rosa-oscuro" aria-hidden="true" />
        </div>

        <h1 className="mt-7 font-titulos text-3xl font-semibold leading-tight text-texto sm:text-4xl">
          No pudimos cargar el contenido
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-texto-suave">
          Es un problema nuestro, no tuyo, y suele durar poco. Puedes volver a intentarlo
          en un momento.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            <RotateCw size={19} aria-hidden="true" />
            Volver a intentar
          </button>
          <Link href="/" className="btn-secondary">
            Ir al inicio
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-8 text-sm text-texto-suave">
            Si vuelve a pasar, cuéntanos y menciona este código:{" "}
            <code className="rounded bg-blanco px-1.5 py-0.5">{error.digest}</code>
          </p>
        ) : null}
      </div>
    </main>
  );
}
