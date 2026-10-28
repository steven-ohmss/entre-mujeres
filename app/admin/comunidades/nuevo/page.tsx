import CabeceraSeccion from "@/components/admin/CabeceraSeccion";
import FormularioComunidad from "@/components/admin/FormularioComunidad";
import { crearComunidad } from "@/app/admin/acciones";

export default function PaginaNuevaComunidad() {
  return (
    <main className="container-page py-10 sm:py-14">
      <CabeceraSeccion
        volverA="/admin/comunidades"
        volverTexto="Volver a comunidades"
        titulo="Agregar una comunidad"
        descripcion="Solo el nombre, la localidad y dónde están son obligatorios. Lo demás se puede llenar después."
      />

      <FormularioComunidad inicial={null} accion={crearComunidad} />
    </main>
  );
}
