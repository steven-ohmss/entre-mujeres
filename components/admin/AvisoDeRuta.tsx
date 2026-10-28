"use client";

import { useSearchParams } from "next/navigation";
import Aviso from "./Aviso";

/**
 * Muestra el "Guardado" o el "Eliminado" después de volver de un formulario.
 *
 * El mensaje viaja en la dirección porque las acciones terminan redirigiendo al
 * listado: es la manera de que la confirmación sobreviva al cambio de página.
 */
export default function AvisoDeRuta() {
  const parametros = useSearchParams();
  const guardado = parametros.get("guardado");
  const eliminado = parametros.get("eliminado");

  if (guardado) {
    return (
      <Aviso>
        Guardado. <strong>{guardado}</strong> ya está actualizado en el sitio.
      </Aviso>
    );
  }

  if (eliminado) {
    return (
      <Aviso>
        Se eliminó <strong>{eliminado}</strong>.
      </Aviso>
    );
  }

  return null;
}
