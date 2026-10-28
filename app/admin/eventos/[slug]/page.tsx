import { notFound } from "next/navigation";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioEvento from "@/components/admin/FormularioEvento";
import { editarEvento, eliminarEvento } from "@/app/admin/acciones";
import { comunidadesAdmin, eventoPorSlug } from "@/lib/datos-admin";

export default async function PaginaEditarEvento({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [evento, comunidades] = await Promise.all([eventoPorSlug(slug), comunidadesAdmin()]);
  if (!evento) notFound();

  async function guardar(datos: FormData) {
    "use server";
    return editarEvento(slug, datos);
  }

  async function borrar() {
    "use server";
    return eliminarEvento(slug);
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/eventos"
        volverTexto="Volver a eventos"
        titulo={evento.title}
      />

      <FormularioEvento
        inicial={evento}
        comunidades={comunidades.map((c) => ({ id: c.id, name: c.name }))}
        accion={guardar}
        alEliminar={borrar}
      />
    </main>
  );
}
