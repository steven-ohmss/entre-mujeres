import Link from "next/link";
import { Venus } from "lucide-react";

/**
 * El marco común de las pantallas de sesión (entrar, definir contraseña, sin acceso).
 *
 * Van sin la barra de navegación ni el pie: quien llega aquí viene a hacer una sola
 * cosa, y el menú completo solo distrae. Queda el nombre del sitio arriba, que además
 * sirve de salida hacia el inicio.
 */
export default function PantallaSesion({
  titulo,
  descripcion,
  children,
  pie,
}: {
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
  pie?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-crema px-5 py-14">
      <Link
        href="/"
        className="mb-9 flex items-center gap-2 font-titulos text-2xl font-semibold text-verde-bosque transition hover:text-verde-bosque-oscuro"
      >
        <Venus size={24} className="text-rosa" strokeWidth={2.5} aria-hidden="true" />
        Entre mujeres
      </Link>

      <div className="w-full max-w-md rounded-3xl bg-blanco p-7 shadow-sm sm:p-9">
        <h1 className="font-titulos text-3xl font-semibold leading-tight text-texto">{titulo}</h1>

        {descripcion ? (
          <p className="mt-3 text-lg leading-relaxed text-texto-suave">{descripcion}</p>
        ) : null}

        <div className="mt-7">{children}</div>
      </div>

      {pie ? <div className="mt-7 w-full max-w-md text-center">{pie}</div> : null}
    </main>
  );
}
