import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioProducto from "@/components/admin/FormularioProducto";
import { crearProducto } from "@/app/admin/acciones";
import { comunidadesAdmin } from "@/lib/datos-admin";

export default async function PaginaNuevoProducto() {
  const comunidades = await comunidadesAdmin();

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/productos"
        volverTexto="Volver a productos"
        titulo="Agregar un producto"
        descripcion="Puedes guardarlo sin foto y subirla después: mientras no haya, el sitio muestra “Foto próximamente”."
      />

      <FormularioProducto
        inicial={null}
        comunidades={comunidades.map((c) => ({ id: c.id, name: c.name }))}
        accion={crearProducto}
      />
    </main>
  );
}
