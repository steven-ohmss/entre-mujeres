"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { ErrorDeImagen, borrarFoto, subirFoto, type Carpeta } from "@/lib/imagenes";
import { urlImagen } from "@/lib/supabase";
import { MINIMO_ALT } from "@/lib/validacion";

/**
 * Una foto, con su descripción.
 *
 * La foto se sube apenas se elige, no al guardar el formulario: así la persona ve de
 * una vez si quedó bien, en vez de enterarse al final de que no se pudo. El precio es
 * que si abandona el formulario queda un archivo suelto en el bucket; se asume porque
 * el archivo lleva el nombre del slug y la próxima vez lo sobrescribe.
 *
 * El campo de descripción no es opcional. Es lo que oye quien usa lector de pantalla y
 * lo que se lee si la foto no carga por mala señal.
 */
export default function CampoFoto({
  carpeta,
  slug,
  rutaInicial,
  altInicial,
  error,
}: {
  carpeta: Carpeta;
  /** Con qué nombre se guarda el archivo. Si el nombre aún no existe, se usa "nuevo". */
  slug: string;
  rutaInicial: string | null;
  altInicial: string | null;
  error?: string;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [ruta, setRuta] = useState(rutaInicial ?? "");
  const [alt, setAlt] = useState(altInicial ?? "");
  const [subiendo, setSubiendo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [peso, setPeso] = useState<number | null>(null);

  const elegir = async (archivo: File | undefined) => {
    if (!archivo) return;
    setAviso(null);
    setSubiendo(true);
    try {
      const anterior = ruta;
      const { ruta: nueva, bytes } = await subirFoto(archivo, carpeta, slug || "nuevo");
      setRuta(nueva);
      setPeso(bytes);
      // Si el archivo nuevo tiene otro nombre, el viejo ya no lo usa nadie.
      if (anterior && anterior !== nueva) await borrarFoto(anterior);
    } catch (e) {
      setAviso(e instanceof ErrorDeImagen ? e.message : "No pudimos subir la foto.");
    } finally {
      setSubiendo(false);
      if (entrada.current) entrada.current.value = "";
    }
  };

  const quitar = async () => {
    if (ruta) await borrarFoto(ruta);
    setRuta("");
    setAlt("");
    setPeso(null);
  };

  const url = urlImagen(ruta);

  return (
    <div>
      <span className="field-label">Foto</span>

      <input type="hidden" name="image_path" value={ruta} />

      <div className="mt-1 rounded-3xl border border-texto/20 bg-blanco p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-crema sm:w-56">
            {url ? (
              <Image src={url} alt="" fill sizes="224px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-texto-suave">
                <Camera size={34} strokeWidth={1.5} aria-hidden="true" />
                <span className="text-base">Sin foto</span>
              </span>
            )}
            {subiendo ? (
              <span className="absolute inset-0 flex items-center justify-center bg-blanco/80">
                <Loader2 size={30} className="animate-spin text-verde-bosque" aria-hidden="true" />
              </span>
            ) : null}
          </div>

          <div className="flex-1">
            <input
              ref={entrada}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => elegir(e.target.files?.[0])}
              className="sr-only"
              id={`archivo-${carpeta}`}
            />

            <div className="flex flex-wrap gap-3">
              <label htmlFor={`archivo-${carpeta}`} className="btn-secondary cursor-pointer">
                <Camera size={19} aria-hidden="true" />
                {ruta ? "Cambiar la foto" : "Elegir una foto"}
              </label>

              {ruta ? (
                <button type="button" onClick={quitar} className="btn-secondary">
                  <Trash2 size={19} aria-hidden="true" />
                  Quitar
                </button>
              ) : null}
            </div>

            <p className="mt-3 text-base leading-relaxed text-texto-suave">
              Puedes tomarla con el celular. La achicamos solas para que la página cargue
              rápido, así que no te preocupes por el tamaño.
              {peso ? ` Quedó en ${Math.round(peso / 1024)} KB.` : ""}
            </p>

            {aviso ? (
              <p className="mt-3 flex items-start gap-2 text-base text-rosa-oscuro">
                <TriangleAlert size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
                {aviso}
              </p>
            ) : null}
          </div>
        </div>

        {ruta ? (
          <div className="mt-5 border-t border-texto/10 pt-5">
            <label htmlFor="image_alt" className="field-label">
              ¿Qué se ve en la foto?
            </label>
            <input
              id="image_alt"
              name="image_alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="field-input"
              placeholder="Dos mujeres llenando frascos de mermelada en una mesa de madera"
            />
            <p className="mt-2 text-base text-texto-suave">
              Escribe lo que de verdad aparece, no el nombre. Lo lee en voz alta el
              celular de una persona ciega, y aparece si la foto no carga.
              {alt.trim().length > 0 && alt.trim().length < MINIMO_ALT
                ? " Un poco más larga, por favor."
                : ""}
            </p>
          </div>
        ) : null}

        {error ? <p className="field-error mt-3">{error}</p> : null}
      </div>
    </div>
  );
}
