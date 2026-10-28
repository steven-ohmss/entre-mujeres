import { Suspense } from "react";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import ListadoAdmin from "@/components/admin/ListadoAdmin";
import AvisoDeRuta from "@/components/admin/AvisoDeRuta";
import { comunidadesAdmin, listadoComunidades, productosPorComunidad } from "@/lib/datos-admin";

export default async function PaginaComunidades() {
  const [comunidades, conteos] = await Promise.all([comunidadesAdmin(), productosPorComunidad()]);

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin"
        volverTexto="Volver al panel"
        titulo="Comunidades"
        descripcion="Las organizaciones, colectivos y emprendimientos que aparecen en el mapa y en el sitio."
      />

      <div className="mt-8">
        <Suspense>
          <AvisoDeRuta />
        </Suspense>

        <ListadoAdmin
          filas={listadoComunidades(comunidades, conteos)}
          tabla="communities"
          rutaBase="/admin/comunidades"
          etiquetaAgregar="Agregar comunidad"
        />
      </div>
    </main>
  );
}
