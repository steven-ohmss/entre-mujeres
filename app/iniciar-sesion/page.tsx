import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PantallaSesion from "@/components/PantallaSesion";
import FormularioIniciarSesion from "@/components/FormularioIniciarSesion";

export const metadata: Metadata = {
  title: "Iniciar sesión · Entre mujeres",
  description: "Entra al panel de Entre mujeres.",
  // El panel no es contenido público: no tiene por qué salir en buscadores.
  robots: { index: false, follow: false },
};

export default function PaginaIniciarSesion() {
  return (
    <PantallaSesion
      titulo="Iniciar sesión"
      descripcion="Entra con el correo con el que te invitamos."
      pie={
        <p className="text-base text-texto-suave">
          Esta entrada es solo para el equipo. Si quieres que tu comunidad aparezca en el
          sitio,{" "}
          <Link href="/#quiero-ser-parte" className="font-semibold text-rosa-oscuro hover:underline">
            escríbenos desde aquí
          </Link>
          .
        </p>
      }
    >
      {/* El formulario lee ?volver= y ?error= de la dirección, y eso en Next obliga a
          envolverlo en Suspense. */}
      <Suspense fallback={<p className="text-base text-texto-suave">Cargando…</p>}>
        <FormularioIniciarSesion />
      </Suspense>
    </PantallaSesion>
  );
}
