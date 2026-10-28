import { notFound } from "next/navigation";
import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioNoticia from "@/components/admin/FormularioNoticia";
import { editarNoticia, eliminarNoticia } from "@/app/admin/acciones";
import { noticiaPorSlug } from "@/lib/datos-admin";

export default async function PaginaEditarNoticia({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await noticiaPorSlug(slug);
  if (!noticia) notFound();

  async function guardar(datos: FormData) {
    "use server";
    return editarNoticia(slug, datos);
  }

  async function borrar() {
    "use server";
    return eliminarNoticia(slug);
  }

  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/noticias"
        volverTexto="Volver a noticias"
        titulo={noticia.title}
      />

      <FormularioNoticia inicial={noticia} accion={guardar} alEliminar={borrar} />
    </main>
  );
}
