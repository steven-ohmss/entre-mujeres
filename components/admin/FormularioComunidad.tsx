"use client";

import { useState } from "react";
import MarcoFormulario, { Campo } from "./MarcoFormulario";
import CampoFoto from "./CampoFoto";
import CampoUbicacion from "./CampoUbicacion";
import BotonEliminar from "./BotonEliminar";
import { communityCategories, localidades } from "@/lib/catalogos";
import { aSlug } from "@/lib/slug";
import { normalizarWhatsApp, urlWaMe } from "@/lib/validacion";
import type { ComunidadAdmin } from "@/lib/datos-admin";
import type { Resultado } from "@/app/admin/acciones";

export default function FormularioComunidad({
  inicial,
  accion,
  alEliminar,
}: {
  inicial: ComunidadAdmin | null;
  accion: (datos: FormData) => Promise<Resultado>;
  alEliminar?: () => Promise<Resultado>;
}) {
  const [nombre, setNombre] = useState(inicial?.name ?? "");
  const [whatsapp, setWhatsapp] = useState(inicial?.whatsapp ?? "");

  const slug = inicial?.slug ?? aSlug(nombre);
  const waNormalizado = normalizarWhatsApp(whatsapp);
  const waUrl = urlWaMe(waNormalizado);

  return (
    <MarcoFormulario
      accion={accion}
      volverA="/admin/comunidades"
      etiquetaGuardar={inicial ? "Guardar los cambios" : "Crear la comunidad"}
      extra={
        inicial && alEliminar ? (
          <BotonEliminar
            nombre={inicial.name}
            queSePierde="También se borrará su foto."
            alEliminar={alEliminar}
          />
        ) : null
      }
    >
      {(errores) => (
        <>
          <Campo id="name" etiqueta="Nombre de la comunidad" error={errores.name}>
            <input
              id="name"
              name="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="field-input"
              placeholder="Granja La Dorada"
              autoFocus={!inicial}
            />
            {slug ? (
              <p className="mt-2 text-base text-texto-suave">
                Su dirección será{" "}
                <code className="rounded bg-blanco px-1.5 py-0.5">/comunidades/{slug}</code>
                {inicial
                  ? ". No cambia aunque cambies el nombre, para no romper los enlaces que ya circulan."
                  : "."}
              </p>
            ) : null}
          </Campo>

          <Campo
            id="category"
            etiqueta="Categoría"
            ayuda="Si todavía no lo saben, déjalo en blanco: el sitio mostrará “Información próximamente”."
            error={errores.category}
          >
            <select id="category" name="category" defaultValue={inicial?.category ?? ""} className="field-input">
              <option value="">Todavía no lo sabemos</option>
              {communityCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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

          <Campo
            id="ubicacion"
            etiqueta="Dónde están, en palabras"
            ayuda="Como se lo dirías a alguien. Por ejemplo: Vereda El Hato, Usme."
            error={errores.ubicacion}
          >
            <input
              id="ubicacion"
              name="ubicacion"
              defaultValue={inicial?.ubicacion ?? ""}
              className="field-input"
            />
          </Campo>

          <CampoUbicacion
            latInicial={inicial?.lat ?? null}
            lngInicial={inicial?.lng ?? null}
            error={errores.lat}
          />

          <Campo
            id="short_description"
            etiqueta="En una o dos frases, ¿quiénes son?"
            ayuda="Es lo que se ve en la tarjeta de la comunidad y en el mapa."
            error={errores.short_description}
          >
            <textarea
              id="short_description"
              name="short_description"
              rows={3}
              defaultValue={inicial?.short_description ?? ""}
              className="field-input"
            />
          </Campo>

          <Campo
            id="who_we_are"
            etiqueta="Su historia"
            ayuda="Más largo, con sus palabras. Aparece en su página."
            error={errores.who_we_are}
          >
            <textarea
              id="who_we_are"
              name="who_we_are"
              rows={5}
              defaultValue={inicial?.who_we_are ?? ""}
              className="field-input"
            />
          </Campo>

          <Campo id="what_we_do" etiqueta="Qué hacen" error={errores.what_we_do}>
            <textarea
              id="what_we_do"
              name="what_we_do"
              rows={4}
              defaultValue={inicial?.what_we_do ?? ""}
              className="field-input"
            />
          </Campo>

          <CampoFoto
            carpeta="comunidades"
            slug={slug}
            rutaInicial={inicial?.image_path ?? null}
            altInicial={inicial?.image_alt ?? null}
            error={errores.image_alt}
          />

          <Campo
            id="whatsapp"
            etiqueta="WhatsApp"
            ayuda="Escríbelo como quieras: con espacios, guiones o el +57. Nosotras lo arreglamos."
            error={errores.whatsapp}
          >
            <input
              id="whatsapp"
              name="whatsapp"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="field-input"
              placeholder="320 123 4567"
            />
            {waUrl ? (
              <p className="mt-2 text-base text-texto-suave">
                El botón del sitio abrirá{" "}
                <code className="rounded bg-blanco px-1.5 py-0.5 break-all">{waUrl}</code>
              </p>
            ) : null}
          </Campo>

          <Campo id="phone" etiqueta="Teléfono fijo (opcional)" error={errores.phone}>
            <input id="phone" name="phone" inputMode="tel" defaultValue={inicial?.phone ?? ""} className="field-input" />
          </Campo>

          <Campo id="email" etiqueta="Correo electrónico (opcional)" error={errores.email}>
            <input id="email" name="email" type="email" defaultValue={inicial?.email ?? ""} className="field-input" />
          </Campo>

          <Campo
            id="social"
            etiqueta="Instagram (opcional)"
            ayuda="Su usuario, por ejemplo @granjaladorada."
            error={errores.social}
          >
            <input id="social" name="social" defaultValue={inicial?.social ?? ""} className="field-input" />
          </Campo>

          <Campo
            id="catalog_url"
            etiqueta="Enlace a su catálogo (opcional)"
            ayuda="Si tienen un catálogo o portafolio en internet. Tiene que empezar por https://"
            error={errores.catalog_url}
          >
            <input
              id="catalog_url"
              name="catalog_url"
              inputMode="url"
              defaultValue={inicial?.catalog_url ?? ""}
              className="field-input"
            />
          </Campo>
        </>
      )}
    </MarcoFormulario>
  );
}
