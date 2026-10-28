import { notFound } from "next/navigation";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioProducto from "@/components/admin/FormularioProducto";
import { editarProducto, eliminarProducto } from "@/app/admin/acciones";
import { comunidadesAdmin, productoPorSlug } from "@/lib/datos-admin";

export default async function PaginaEditarProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [producto, comunidades] = await Promise.all([productoPorSlug(slug), comunidadesAdmin()]);
  if (!producto) notFound();

  async function guardar(datos: FormData) {
    "use server";
    return editarProducto(slug, datos);
  }

  async function borrar() {
    "use server";
    return eliminarProducto(slug);
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/productos"
        volverTexto="Volver a productos"
        titulo={producto.name}
        descripcion="Lo que cambies aquí se ve en el sitio en unos segundos."
      />

      <FormularioProducto
        inicial={producto}
        comunidades={comunidades.map((c) => ({ id: c.id, name: c.name }))}
        accion={guardar}
        alEliminar={borrar}
      />
    </main>
  );
}
