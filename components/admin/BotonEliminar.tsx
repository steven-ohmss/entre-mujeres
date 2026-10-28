"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import type { Resultado } from "@/app/admin/acciones";

/**
 * Eliminar, con una confirmación que dice qué se va a borrar y qué se pierde.
 *
 * No usa el confirm() del navegador a propósito: en celular sale como un cuadro del
 * sistema, sin contexto, y es fácil darle aceptar por reflejo. Aquí hay que leer el
 * nombre de lo que se va a borrar antes de tocar el botón rojo.
 */
export default function BotonEliminar({
  nombre,
  queSePierde,
  alEliminar,
}: {
  nombre: string;
  /** Lo que conviene saber antes: "También se borrará su foto." */
  queSePierde?: string;
  alEliminar: () => Promise<Resultado>;
}) {
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [borrando, iniciar] = useTransition();

  const confirmar = () => {
    setError(null);
    iniciar(async () => {
      const r = await alEliminar();
      // Si todo va bien la acción redirige y esto no llega a ejecutarse.
      if (!r?.ok) setError(r?.mensaje ?? "No se pudo eliminar.");
    });
  };

  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className="btn-secondary">
        <Trash2 size={19} aria-hidden="true" />
        Eliminar
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-label={`Confirmar eliminar ${nombre}`} className="rounded-3xl bg-rosa-palido p-5">
      <p className="flex items-start gap-2.5 font-titulos text-xl font-semibold text-texto">
        <TriangleAlert size={23} className="mt-0.5 shrink-0 text-rosa-oscuro" aria-hidden="true" />
        ¿Seguro que quieres eliminar {nombre}?
      </p>

      <p className="mt-3 text-base leading-relaxed text-texto">
        {queSePierde ? `${queSePierde} ` : ""}
        Esto no se puede deshacer.
      </p>

      {error ? (
        <p role="alert" className="mt-4 rounded-2xl bg-blanco p-4 text-base text-texto">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={confirmar}
          disabled={borrando}
          className="btn-primary bg-rosa-oscuro hover:bg-rosa disabled:opacity-60"
        >
          {borrando ? (
            <Loader2 size={19} className="animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 size={19} aria-hidden="true" />
          )}
          {borrando ? "Eliminando…" : "Sí, eliminar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setAbierto(false);
            setError(null);
          }}
          disabled={borrando}
          className="btn-secondary"
        >
          No, dejarlo como está
        </button>
      </div>
    </div>
  );
}
