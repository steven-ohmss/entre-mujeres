"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Camera, Loader2, Star, Trash2, TriangleAlert } from "lucide-react";
import { ErrorDeImagen, borrarFoto, subirFoto } from "@/lib/imagenes";
import { urlImagen } from "@/lib/supabase";
import { MINIMO_ALT } from "@/lib/validacion";

export interface FotoProducto {
  storage_path: string;
  alt: string;
}

/**
 * Las fotos de un producto: varias, ordenables, cada una con su descripción.
 *
 * La primera es la que sale en la tarjeta y en el buscador, así que se marca con una
 * estrella y se puede mover. El orden importa de verdad, no es decoración.
 *
 * Todo viaja al servidor en un campo oculto con JSON, porque las fotos ya están subidas
 * al bucket: lo único que falta guardar es cuál va con cuál y en qué orden.
 */
export default function CampoFotosProducto({
  slug,
  inicial,
  error,
}: {
  slug: string;
  inicial: FotoProducto[];
  error?: string;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<FotoProducto[]>(inicial);
  const [subiendo, setSubiendo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const agregar = async (archivo: File | undefined) => {
    if (!archivo) return;
    setAviso(null);
    setSubiendo(true);
    try {
      const { ruta } = await subirFoto(archivo, "productos", slug || "nuevo", fotos.length);
      if (fotos.some((f) => f.storage_path === ruta)) {
        setAviso("Esa foto ya está en la lista.");
        return;
      }
      setFotos((f) => [...f, { storage_path: ruta, alt: "" }]);
    } catch (e) {
      setAviso(e instanceof ErrorDeImagen ? e.message : "No pudimos subir la foto.");
    } finally {
      setSubiendo(false);
      if (entrada.current) entrada.current.value = "";
    }
  };

  const quitar = async (i: number) => {
    const fuera = fotos[i];
    setFotos((f) => f.filter((_, k) => k !== i));
    // Solo se borra del bucket si no quedó otra fila usando el mismo archivo.
    if (!fotos.some((f, k) => k !== i && f.storage_path === fuera.storage_path)) {
      await borrarFoto(fuera.storage_path);
    }
  };

  const mover = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= fotos.length) return;
    setFotos((f) => {
      const copia = [...f];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });
  };

  const cambiarAlt = (i: number, valor: string) =>
    setFotos((f) => f.map((foto, k) => (k === i ? { ...foto, alt: valor } : foto)));

  return (
    <div>
      <span className="field-label">Fotos del producto</span>

      <input type="hidden" name="fotos" value={JSON.stringify(fotos)} />

      <div className="mt-1 rounded-3xl border border-texto/20 bg-blanco p-4">
        {fotos.length === 0 ? (
          <p className="rounded-2xl bg-crema p-5 text-center text-base text-texto-suave">
            Todavía no hay fotos. Mientras no haya, en el sitio sale un recuadro que dice
            &ldquo;Foto próximamente&rdquo;.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {fotos.map((foto, i) => (
              <li key={foto.storage_path} className="rounded-2xl bg-crema p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-blanco sm:w-44">
                    <Image
                      src={urlImagen(foto.storage_path)}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                    {i === 0 ? (
                      <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-verde-bosque px-2.5 py-1 text-xs font-semibold text-crema">
                        <Star size={13} fill="currentColor" aria-hidden="true" />
                        Principal
                      </span>
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <label htmlFor={`alt-${i}`} className="field-label">
                      ¿Qué se ve en esta foto?
                    </label>
                    <input
                      id={`alt-${i}`}
                      value={foto.alt}
                      onChange={(e) => cambiarAlt(i, e.target.value)}
                      className="field-input"
                      placeholder="El frasco de mermelada sobre una mesa de madera, con fruta al lado"
                    />
                    {foto.alt.trim().length > 0 && foto.alt.trim().length < MINIMO_ALT ? (
                      <p className="mt-2 text-base text-texto-suave">Un poco más larga, por favor.</p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => mover(i, -1)}
                        disabled={i === 0}
                        className="btn-secondary disabled:opacity-40"
                      >
                        <ArrowLeft size={18} aria-hidden="true" />
                        Antes
                      </button>
                      <button
                        type="button"
                        onClick={() => mover(i, 1)}
                        disabled={i === fotos.length - 1}
                        className="btn-secondary disabled:opacity-40"
                      >
                        <ArrowRight size={18} aria-hidden="true" />
                        Después
                      </button>
                      <button type="button" onClick={() => quitar(i)} className="btn-secondary">
                        <Trash2 size={18} aria-hidden="true" />
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => agregar(e.target.files?.[0])}
          className="sr-only"
          id="archivo-producto"
        />

        <label htmlFor="archivo-producto" className="btn-secondary mt-4 w-full cursor-pointer justify-center">
          {subiendo ? (
            <Loader2 size={19} className="animate-spin" aria-hidden="true" />
          ) : (
            <Camera size={19} aria-hidden="true" />
          )}
          {subiendo ? "Subiendo…" : "Agregar una foto"}
        </label>

        <p className="mt-3 text-base leading-relaxed text-texto-suave">
          La primera foto es la que se ve en la lista de productos y en el buscador. Las
          achicamos solas. Una misma foto no puede estar en dos productos distintos.
        </p>

        {aviso ? (
          <p className="mt-3 flex items-start gap-2 text-base text-rosa-oscuro">
            <TriangleAlert size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
            {aviso}
          </p>
        ) : null}

        {error ? <p className="field-error mt-3">{error}</p> : null}
      </div>
    </div>
  );
}
