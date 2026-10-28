import { notFound } from "next/navigation";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioComunidad from "@/components/admin/FormularioComunidad";
import { editarComunidad, eliminarComunidad } from "@/app/admin/acciones";
import { comunidadPorSlug } from "@/lib/datos-admin";

export default async function PaginaEditarComunidad({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comunidad = await comunidadPorSlug(slug);
  if (!comunidad) notFound();

  // Las acciones se atan al slug aquí, en el servidor, para que el formulario no pueda
  // pedir que se edite otra comunidad distinta de la que está abierta.
  async function guardar(datos: FormData) {
    "use server";
    return editarComunidad(slug, datos);
  }

  async function borrar() {
    "use server";
    return eliminarComunidad(slug);
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/comunidades"
        volverTexto="Volver a comunidades"
        titulo={comunidad.name}
        descripcion="Lo que cambies aquí se ve en el sitio en unos segundos."
      />

      <FormularioComunidad inicial={comunidad} accion={guardar} alEliminar={borrar} />
    </main>
  );
}
