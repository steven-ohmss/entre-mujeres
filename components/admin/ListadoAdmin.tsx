"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ImageOff, Pencil, Plus, Search } from "lucide-react";
import Image from "next/image";
import { moverOrden } from "@/app/admin/acciones";
import type { FilaListado } from "@/lib/datos-admin";

/**
 * El listado de cada sección: buscar, ver qué falta, reordenar y entrar a editar.
 *
 * Toda la fila es el enlace a editar, no un botón pequeño al final: en un celular,
 * apuntarle a un botón de 24 px con el pulgar es la diferencia entre poder usar esto y
 * no poder.
 */
export default function ListadoAdmin({
  filas,
  tabla,
  rutaBase,
  etiquetaAgregar,
  conOrden = true,
}: {
  filas: FilaListado[];
  tabla: "communities" | "products" | "events" | "news";
  rutaBase: string;
  etiquetaAgregar: string;
  /** Los eventos y las noticias se ordenan por fecha; moverlos a mano no tiene sentido. */
  conOrden?: boolean;
}) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [moviendo, iniciarMovimiento] = useTransition();

  const visibles = useMemo(() => {
    const t = busqueda
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
    if (!t) return filas;
    return filas.filter((f) =>
      `${f.nombre} ${f.detalle}`
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .includes(t)
    );
  }, [busqueda, filas]);

  const mover = (slug: string, direccion: "subir" | "bajar") => {
    iniciarMovimiento(async () => {
      await moverOrden(tabla, slug, direccion);
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-h-12 flex-1 items-center gap-2 rounded-full border border-texto/20 bg-blanco px-4">
          <Search size={20} className="shrink-0 text-texto-suave" aria-hidden="true" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre"
            aria-label="Buscar en la lista"
            className="w-full min-w-0 bg-transparent py-3 text-lg text-texto placeholder:text-texto-suave focus:outline-none"
          />
        </div>

        <Link href={`${rutaBase}/nuevo`} className="btn-primary shrink-0 justify-center">
          <Plus size={21} aria-hidden="true" />
          {etiquetaAgregar}
        </Link>
      </div>

      <p className="mt-5 text-base text-texto-suave">
        {visibles.length === filas.length
          ? `${filas.length} en total`
          : `${visibles.length} de ${filas.length}`}
      </p>

      {visibles.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-texto/25 bg-blanco p-10 text-center">
          <p className="text-lg text-texto-suave">
            {filas.length === 0
              ? "Todavía no hay nada aquí. Toca el botón de arriba para agregar."
              : "No encontramos nada con esas palabras."}
          </p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {visibles.map((fila, i) => (
            <li key={fila.id}>
              <div className="card flex items-stretch gap-0 overflow-hidden">
                <Link
                  href={`${rutaBase}/${fila.slug}`}
                  className="flex min-w-0 flex-1 items-center gap-4 p-3 transition hover:bg-crema/60 sm:p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-crema sm:h-24 sm:w-24">
                    {fila.imagen ? (
                      <Image
                        src={fila.imagen}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-texto-suave">
                        <ImageOff size={26} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-titulos text-xl font-semibold text-texto">
                      {fila.nombre}
                    </p>
                    <p className="mt-0.5 truncate text-base text-texto-suave">{fila.detalle}</p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {fila.esEjemplo ? (
                        <span className="pill-tag bg-amarillo/25 text-texto">Ejemplo</span>
                      ) : null}
                      {fila.pendientes.length > 0 ? (
                        <span className="pill-tag bg-rosa-palido text-rosa-oscuro">
                          Falta {fila.pendientes.join(", ")}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <Pencil
                    size={22}
                    className="hidden shrink-0 text-texto-suave sm:block"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Editar</span>
                </Link>

                {conOrden ? (
                  <div className="flex shrink-0 flex-col justify-center gap-1 border-l border-texto/10 px-1.5">
                    <button
                      type="button"
                      onClick={() => mover(fila.slug, "subir")}
                      disabled={moviendo || i === 0}
                      aria-label={`Subir ${fila.nombre}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-texto transition hover:bg-crema disabled:opacity-30"
                    >
                      <ChevronUp size={22} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(fila.slug, "bajar")}
                      disabled={moviendo || i === visibles.length - 1}
                      aria-label={`Bajar ${fila.nombre}`}
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-texto transition hover:bg-crema disabled:opacity-30"
                    >
                      <ChevronDown size={22} aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {conOrden && busqueda ? (
        <p className="mt-4 text-base text-texto-suave">
          Para cambiar el orden, borra lo que escribiste en el buscador: el orden se mueve
          sobre la lista completa.
        </p>
      ) : null}
    </>
  );
}
