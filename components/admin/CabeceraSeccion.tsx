import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** La cabecera de cada pantalla del panel: volver, título y una línea de contexto. */
export default function CabeceraSeccion({
  volverA,
  volverTexto,
  titulo,
  descripcion,
}: {
  volverA: string;
  volverTexto: string;
  titulo: string;
  descripcion?: string;
}) {
  return (
    <>
      <Link
        href={volverA}
        className="inline-flex min-h-12 items-center gap-2 text-lg font-semibold text-texto transition hover:text-rosa-oscuro"
      >
        <ArrowLeft size={21} aria-hidden="true" />
        {volverTexto}
      </Link>

      <h1 className="mt-4 font-titulos text-3xl font-semibold leading-tight text-texto sm:text-4xl">
        {titulo}
      </h1>

      {descripcion ? (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-texto-suave">{descripcion}</p>
      ) : null}
    </>
  );
}
