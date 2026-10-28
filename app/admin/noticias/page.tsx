import { Suspense } from "react";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import ListadoAdmin from "@/components/admin/ListadoAdmin";
import AvisoDeRuta from "@/components/admin/AvisoDeRuta";
import { noticiasAdmin } from "@/lib/datos-admin";
import { urlImagen } from "@/lib/supabase";
import { formatEventDate } from "@/lib/date";

export default async function PaginaNoticiasAdmin() {
  const noticias = await noticiasAdmin();

  const filas = noticias.map((n) => {
    const pendientes: string[] = [];
    if (!n.image_path) pendientes.push("foto");
    if (!n.summary) pendientes.push("resumen");
    if (!n.full_text) pendientes.push("la nota completa");

    return {
      id: n.id,
      slug: n.slug,
      nombre: n.title,
      imagen: urlImagen(n.image_path),
      orden: n.orden,
      esEjemplo: n.is_example,
      pendientes,
      detalle: `${n.type} · ${formatEventDate(n.date)}`,
    };
  });

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin"
        volverTexto="Volver al panel"
        titulo="Noticias e historias"
        descripcion="En el sitio se ordenan por fecha, de la más reciente a la más antigua."
      />

      <div className="mt-8">
        <Suspense>
          <AvisoDeRuta />
        </Suspense>

        <ListadoAdmin
          filas={filas}
          tabla="news"
          rutaBase="/admin/noticias"
          etiquetaAgregar="Escribir una nueva"
          conOrden={false}
        />
      </div>
    </main>
  );
}
