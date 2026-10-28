"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Save } from "lucide-react";
import type { Resultado } from "@/app/admin/acciones";
import type { Errores } from "@/lib/validacion";

/**
 * Lo que rodea a todos los formularios del panel: el envío, los errores y los botones.
 *
 * Cuando algo falla NO se recarga la página ni se vacían los campos. Quien acaba de
 * escribir tres párrafos sobre su comunidad no debería perderlos porque olvidó elegir
 * una localidad.
 */
export default function MarcoFormulario({
  accion,
  volverA,
  etiquetaGuardar = "Guardar",
  children,
  extra,
}: {
  accion: (datos: FormData) => Promise<Resultado>;
  volverA: string;
  etiquetaGuardar?: string;
  /** Recibe los errores por campo para poder mostrarlos junto a cada uno. */
  children: (errores: Errores) => React.ReactNode;
  /** Por ejemplo el botón de eliminar, que solo existe al editar. */
  extra?: React.ReactNode;
}) {
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, iniciar] = useTransition();

  const enviar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    setErrores({});
    setMensaje(null);

    iniciar(async () => {
      try {
        const r = await accion(datos);
        // Si sale bien, la acción redirige y nada de esto corre.
        if (r && !r.ok) {
          setErrores(r.errores ?? {});
          setMensaje(r.mensaje ?? null);
          // Lleva la vista al primer problema: en un formulario largo, un error
          // allá arriba pasa desapercibido.
          requestAnimationFrame(() => {
            document
              .querySelector("[data-error='true'], [role='alert']")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
      } catch (e) {
        // redirect() funciona lanzando; eso no es un fallo.
        if (e instanceof Error && /NEXT_REDIRECT/.test(e.message)) throw e;
        setMensaje(
          e instanceof Error ? e.message : "No se pudo guardar. Vuelve a intentarlo."
        );
      }
    });
  };

  const hayErrores = Object.keys(errores).length > 0;

  return (
    <form onSubmit={enviar} noValidate className="mt-8">
      {mensaje || hayErrores ? (
        <p
          role="alert"
          className="mb-7 flex items-start gap-3 rounded-2xl bg-rosa-palido p-4 text-base text-texto"
        >
          <AlertCircle size={22} className="mt-0.5 shrink-0 text-rosa-oscuro" aria-hidden="true" />
          {mensaje ?? "Revisa los campos marcados: falta algo o hay algo que corregir."}
        </p>
      ) : null}

      <div className="flex flex-col gap-7">{children(errores)}</div>

      <div className="sticky bottom-0 mt-9 flex flex-wrap gap-3 border-t border-texto/10 bg-crema py-5">
        <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-60">
          {guardando ? (
            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={20} aria-hidden="true" />
          )}
          {guardando ? "Guardando…" : etiquetaGuardar}
        </button>

        <Link href={volverA} className="btn-secondary">
          Cancelar
        </Link>

        {extra ? <div className="w-full sm:ml-auto sm:w-auto">{extra}</div> : null}
      </div>
    </form>
  );
}

/** Un campo con su etiqueta, su ayuda y su error, para no repetirlo en cada formulario. */
export function Campo({
  id,
  etiqueta,
  ayuda,
  error,
  children,
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-error={error ? "true" : undefined}>
      <label htmlFor={id} className="field-label">
        {etiqueta}
      </label>
      {ayuda ? <p className="mb-2 text-base text-texto-suave">{ayuda}</p> : null}
      {children}
      {error ? <p className="field-error mt-2">{error}</p> : null}
    </div>
  );
}
