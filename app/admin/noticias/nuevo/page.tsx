import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioNoticia from "@/components/admin/FormularioNoticia";
import { crearNoticia } from "@/app/admin/acciones";

export default function PaginaNuevaNoticia() {
  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/noticias"
        volverTexto="Volver a noticias"
        titulo="Escribir una publicación"
        descripcion="Puede ser una historia, una noticia, algo que pasó o un proyecto que quieran destacar."
      />

      <FormularioNoticia inicial={null} accion={crearNoticia} />
    </main>
  );
}
