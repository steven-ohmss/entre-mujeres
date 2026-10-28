import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioEvento from "@/components/admin/FormularioEvento";
import { crearEvento } from "@/app/admin/acciones";
import { comunidadesAdmin } from "@/lib/datos-admin";

export default async function PaginaNuevoEvento() {
  const comunidades = await comunidadesAdmin();

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/eventos"
        volverTexto="Volver a eventos"
        titulo="Agregar un evento"
        descripcion="Aparecerá en el calendario del sitio, y en el inicio cuando se acerque la fecha."
      />

      <FormularioEvento
        inicial={null}
        comunidades={comunidades.map((c) => ({ id: c.id, name: c.name }))}
        accion={crearEvento}
      />
    </main>
  );
}
