"use client";

import { useState } from "react";
import MarcoFormulario, { Campo } from "./MarcoFormulario";
import CampoFoto from "./CampoFoto";
import BotonEliminar from "./BotonEliminar";
import { aSlug } from "@/lib/slug";
import type { NoticiaAdmin } from "@/lib/datos-admin";
import type { Resultado } from "@/app/admin/acciones";

const TIPOS = ["Historia", "Noticia", "Actividad reciente", "Proyecto destacado"];

export default function FormularioNoticia({
  inicial,
  accion,
  alEliminar,
}: {
  inicial: NoticiaAdmin | null;
  accion: (datos: FormData) => Promise<Resultado>;
  alEliminar?: () => Promise<Resultado>;
}) {
  const [titulo, setTitulo] = useState(inicial?.title ?? "");
  const slug = inicial?.slug ?? aSlug(titulo);

  // Una publicación nueva casi siempre es de hoy.
  const hoy = new Date();
  const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(
    hoy.getDate()
  ).padStart(2, "0")}`;

  return (
    <MarcoFormulario
      accion={accion}
      volverA="/admin/noticias"
      etiquetaGuardar={inicial ? "Guardar los cambios" : "Publicar"}
      extra={
        inicial && alEliminar ? (
          <BotonEliminar nombre={inicial.title} queSePierde="También se borrará su foto." alEliminar={alEliminar} />
        ) : null
      }
    >
      {(errores) => (
        <>
          <Campo id="title" etiqueta="Título" error={errores.title}>
            <input
              id="title"
              name="title"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="field-input"
              placeholder="El origen de Red Mujer en la vereda Arrayanes"
              autoFocus={!inicial}
            />
            {slug ? (
              <p className="mt-2 text-base text-texto-suave">
                Nombre corto: <code className="rounded bg-blanco px-1.5 py-0.5">{slug}</code>
              </p>
            ) : null}
          </Campo>

          <Campo id="type" etiqueta="¿Qué tipo de publicación es?" error={errores.type}>
            <select id="type" name="type" defaultValue={inicial?.type ?? "Noticia"} className="field-input">
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="date" etiqueta="Fecha" error={errores.date}>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={inicial?.date ?? fechaHoy}
              className="field-input"
            />
          </Campo>

          <Campo
            id="summary"
            etiqueta="Resumen"
            ayuda="Dos líneas. Es lo que se ve en la tarjeta, antes de abrir la nota."
            error={errores.summary}
          >
            <textarea
              id="summary"
              name="summary"
              rows={3}
              defaultValue={inicial?.summary ?? ""}
              className="field-input"
            />
          </Campo>

          <Campo
            id="full_text"
            etiqueta="La nota completa"
            ayuda="Lo que se lee al abrirla."
            error={errores.full_text}
          >
            <textarea
              id="full_text"
              name="full_text"
              rows={9}
              defaultValue={inicial?.full_text ?? ""}
              className="field-input"
            />
          </Campo>

          <CampoFoto
            carpeta="noticias"
            slug={slug}
            rutaInicial={inicial?.image_path ?? null}
            altInicial={inicial?.image_alt ?? null}
            error={errores.image_alt}
          />
        </>
      )}
    </MarcoFormulario>
  );
}
