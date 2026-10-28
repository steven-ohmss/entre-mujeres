"use client";

import { useState } from "react";
import MarcoFormulario, { Campo } from "./MarcoFormulario";
import CampoFotosProducto from "./CampoFotosProducto";
import CampoLista from "./CampoLista";
import BotonEliminar from "./BotonEliminar";
import { productTypes } from "@/lib/catalogos";
import { aSlug } from "@/lib/slug";
import type { ProductoAdmin } from "@/lib/datos-admin";
import type { Resultado } from "@/app/admin/acciones";

const DISPONIBILIDADES = ["Disponible", "Por encargo", "Por temporada"];

export default function FormularioProducto({
  inicial,
  comunidades,
  accion,
  alEliminar,
}: {
  inicial: ProductoAdmin | null;
  comunidades: { id: string; name: string }[];
  accion: (datos: FormData) => Promise<Resultado>;
  alEliminar?: () => Promise<Resultado>;
}) {
  const [nombre, setNombre] = useState(inicial?.name ?? "");
  const slug = inicial?.slug ?? aSlug(nombre);

  return (
    <MarcoFormulario
      accion={accion}
      volverA="/admin/productos"
      etiquetaGuardar={inicial ? "Guardar los cambios" : "Crear el producto"}
      extra={
        inicial && alEliminar ? (
          <BotonEliminar
            nombre={inicial.name}
            queSePierde={
              inicial.product_images.length > 0
                ? `También se ${inicial.product_images.length === 1 ? "borrará su foto" : `borrarán sus ${inicial.product_images.length} fotos`}.`
                : undefined
            }
            alEliminar={alEliminar}
          />
        ) : null
      }
    >
      {(errores) => (
        <>
          <Campo id="name" etiqueta="Nombre del producto" error={errores.name}>
            <input
              id="name"
              name="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="field-input"
              placeholder="Yogurt artesanal de fresa"
              autoFocus={!inicial}
            />
            {slug ? (
              <p className="mt-2 text-base text-texto-suave">
                Su dirección será{" "}
                <code className="rounded bg-blanco px-1.5 py-0.5">/productos/{slug}</code>
                {inicial ? ". No cambia aunque cambies el nombre." : "."}
              </p>
            ) : null}
          </Campo>

          <Campo id="community_id" etiqueta="¿Quién lo hace?" error={errores.community_id}>
            <select
              id="community_id"
              name="community_id"
              defaultValue={inicial?.community_id ?? ""}
              className="field-input"
            >
              <option value="">Elige una comunidad</option>
              {comunidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="type" etiqueta="Categoría" error={errores.type}>
            <select id="type" name="type" defaultValue={inicial?.type ?? ""} className="field-input">
              <option value="">Elige una</option>
              {productTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Campo>

          <Campo
            id="description"
            etiqueta="Descripción"
            ayuda="Qué es y qué lo hace especial. Es lo que se lee en su página."
            error={errores.description}
          >
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={inicial?.description ?? ""}
              className="field-input"
            />
          </Campo>

          <Campo
            id="presentation"
            etiqueta="Presentación"
            ayuda="En qué viene. Por ejemplo: 1 litro, o Frascos de vidrio de 300 g."
            error={errores.presentation}
          >
            <input
              id="presentation"
              name="presentation"
              defaultValue={inicial?.presentation ?? ""}
              className="field-input"
            />
          </Campo>

          <CampoLista
            nombre="features"
            etiqueta="Características"
            ayuda="Una por línea: material, tamaño, lo que lo distingue. Puedes dejarlo vacío."
            inicial={inicial?.features ?? []}
            marcador="Sin conservantes añadidos"
          />

          <Campo
            id="availability"
            etiqueta="¿Está disponible?"
            ayuda="Si no lo sabes, déjalo en blanco: el sitio no mostrará ninguna etiqueta."
            error={errores.availability}
          >
            <select
              id="availability"
              name="availability"
              defaultValue={inicial?.availability ?? ""}
              className="field-input"
            >
              <option value="">Todavía no lo sabemos</option>
              {DISPONIBILIDADES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Campo>

          <CampoFotosProducto
            slug={slug}
            inicial={(inicial?.product_images ?? []).map((f) => ({
              storage_path: f.storage_path,
              alt: f.alt,
            }))}
            error={errores.fotos}
          />

          <Campo
            id="catalog_url"
            etiqueta="Enlace al catálogo (opcional)"
            ayuda="Si este producto aparece en un catálogo en internet. Empieza por https://"
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
