"use client";

import { useState } from "react";
import MarcoFormulario, { Campo } from "./MarcoFormulario";
import CampoFoto from "./CampoFoto";
import BotonEliminar from "./BotonEliminar";
import { eventTypes, localidades, organizers } from "@/lib/catalogos";
import { aSlug } from "@/lib/slug";
import { horaAInput } from "@/lib/validacion";
import type { EventoAdmin } from "@/lib/datos-admin";
import type { Resultado } from "@/app/admin/acciones";

export default function FormularioEvento({
  inicial,
  comunidades,
  accion,
  alEliminar,
}: {
  inicial: EventoAdmin | null;
  comunidades: { id: string; name: string }[];
  accion: (datos: FormData) => Promise<Resultado>;
  alEliminar?: () => Promise<Resultado>;
}) {
  const [titulo, setTitulo] = useState(inicial?.title ?? "");
  const slug = inicial?.slug ?? aSlug(titulo);

  return (
    <MarcoFormulario
      accion={accion}
      volverA="/admin/eventos"
      etiquetaGuardar={inicial ? "Guardar los cambios" : "Crear el evento"}
      extra={
        inicial && alEliminar ? (
          <BotonEliminar nombre={inicial.title} queSePierde="También se borrará su foto." alEliminar={alEliminar} />
        ) : null
      }
    >
      {(errores) => (
        <>
          <Campo id="title" etiqueta="Nombre del evento" error={errores.title}>
            <input
              id="title"
              name="title"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="field-input"
              placeholder="Feria Campesina de Usme"
              autoFocus={!inicial}
            />
            {slug ? (
              <p className="mt-2 text-base text-texto-suave">
                Nombre corto: <code className="rounded bg-blanco px-1.5 py-0.5">{slug}</code>
              </p>
            ) : null}
          </Campo>

          <Campo id="type" etiqueta="¿Qué tipo de evento es?" error={errores.type}>
            <select id="type" name="type" defaultValue={inicial?.type ?? ""} className="field-input">
              <option value="">Elige uno</option>
              {eventTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.value}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="date" etiqueta="¿Qué día es?" error={errores.date}>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={inicial?.date ?? ""}
              className="field-input"
            />
          </Campo>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            <Campo id="start_time" etiqueta="Hora de inicio" error={errores.start_time}>
              <input
                id="start_time"
                name="start_time"
                type="time"
                defaultValue={horaAInput(inicial?.start_time ?? null)}
                className="field-input"
              />
            </Campo>

            <Campo id="end_time" etiqueta="Hora de fin" error={errores.end_time}>
              <input
                id="end_time"
                name="end_time"
                type="time"
                defaultValue={horaAInput(inicial?.end_time ?? null)}
                className="field-input"
              />
            </Campo>
          </div>

          <Campo
            id="location"
            etiqueta="¿Dónde es?"
            ayuda="El lugar como se lo dirías a alguien. Por ejemplo: Parque Principal de Usme."
            error={errores.location}
          >
            <input id="location" name="location" defaultValue={inicial?.location ?? ""} className="field-input" />
          </Campo>

          <Campo id="localidad" etiqueta="Localidad" error={errores.localidad}>
            <select id="localidad" name="localidad" defaultValue={inicial?.localidad ?? ""} className="field-input">
              <option value="">Elige una</option>
              {localidades.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="organizer" etiqueta="¿Quién organiza?" error={errores.organizer}>
            <select id="organizer" name="organizer" defaultValue={inicial?.organizer ?? ""} className="field-input">
              <option value="">Elige uno</option>
              {organizers.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Campo>

          <Campo
            id="community_id"
            etiqueta="¿De qué comunidad es? (opcional)"
            ayuda="Si el evento es de una comunidad en particular, elígela."
            error={errores.community_id}
          >
            <select
              id="community_id"
              name="community_id"
              defaultValue={inicial?.community_id ?? ""}
              className="field-input"
            >
              <option value="">De ninguna en particular</option>
              {comunidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="description" etiqueta="¿De qué se trata?" error={errores.description}>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={inicial?.description ?? ""}
              className="field-input"
            />
          </Campo>

          <CampoFoto
            carpeta="eventos"
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
