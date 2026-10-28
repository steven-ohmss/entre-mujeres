import { Suspense } from "react";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import ListadoAdmin from "@/components/admin/ListadoAdmin";
import AvisoDeRuta from "@/components/admin/AvisoDeRuta";
import { comunidadesAdmin, eventosAdmin } from "@/lib/datos-admin";
import { urlImagen } from "@/lib/supabase";
import { formatEventDate } from "@/lib/date";

export default async function PaginaEventosAdmin() {
  const [eventos, comunidades] = await Promise.all([eventosAdmin(), comunidadesAdmin()]);
  const porId = new Map(comunidades.map((c) => [c.id, c.name]));

  const filas = eventos.map((e) => {
    const pendientes: string[] = [];
    if (!e.image_path) pendientes.push("foto");
    if (!e.start_time) pendientes.push("hora");
    if (!e.description) pendientes.push("descripción");

    return {
      id: e.id,
      slug: e.slug,
      nombre: e.title,
      imagen: urlImagen(e.image_path),
      orden: e.orden,
      esEjemplo: e.is_example,
      pendientes,
      detalle: `${formatEventDate(e.date)} · ${e.localidad}${
        e.community_id ? ` · ${porId.get(e.community_id) ?? ""}` : ""
      }`,
    };
  });

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin"
        volverTexto="Volver al panel"
        titulo="Eventos"
        descripcion="Ferias, talleres y encuentros. En el sitio se ordenan por fecha y los que ya pasaron no se muestran."
      />

      <div className="mt-8">
        <Suspense>
          <AvisoDeRuta />
        </Suspense>

        <ListadoAdmin
          filas={filas}
          tabla="events"
          rutaBase="/admin/eventos"
          etiquetaAgregar="Agregar evento"
          conOrden={false}
        />
      </div>
    </main>
  );
}
