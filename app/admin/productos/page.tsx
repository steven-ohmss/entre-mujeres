import { Suspense } from "react";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import ListadoAdmin from "@/components/admin/ListadoAdmin";
import AvisoDeRuta from "@/components/admin/AvisoDeRuta";
import { comunidadesAdmin, listadoProductos, productosAdmin } from "@/lib/datos-admin";

export default async function PaginaProductosAdmin() {
  const [productos, comunidades] = await Promise.all([productosAdmin(), comunidadesAdmin()]);
  const porId = new Map(comunidades.map((c) => [c.id, c.name]));

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin"
        volverTexto="Volver al panel"
        titulo="Productos"
        descripcion="Lo que hacen y venden las comunidades. El orden de esta lista es el que se ve en el sitio."
      />

      <div className="mt-8">
        <Suspense>
          <AvisoDeRuta />
        </Suspense>

        {comunidades.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-texto/25 bg-blanco p-8 text-center text-lg text-texto-suave">
            Antes de agregar un producto hace falta al menos una comunidad, porque cada
            producto es de alguien.
          </p>
        ) : (
          <ListadoAdmin
            filas={listadoProductos(productos, porId)}
            tabla="products"
            rutaBase="/admin/productos"
            etiquetaAgregar="Agregar producto"
          />
        )}
      </div>
    </main>
  );
}
