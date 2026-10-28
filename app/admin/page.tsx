import Link from "next/link";
import { CalendarDays, ChevronRight, Newspaper, ShoppingBasket, Users } from "lucide-react";
import { usuarioActual } from "@/lib/sesion";
import { clienteServidor } from "@/lib/sesion";

/**
 * El tablero: desde dónde se entra a cada sección.
 *
 * Cada tarjeta trae el conteo real. Sirve para orientarse de un vistazo y, sobre todo,
 * para notar cuando algo quedó vacío por error.
 */

async function conteos() {
  const db = clienteServidor();
  const [c, p, e, n] = await Promise.all([
    db.from("communities").select("*", { count: "exact", head: true }),
    db.from("products").select("*", { count: "exact", head: true }),
    db.from("events").select("*", { count: "exact", head: true }),
    db.from("news").select("*", { count: "exact", head: true }),
  ]);
  return {
    comunidades: c.count ?? 0,
    productos: p.count ?? 0,
    eventos: e.count ?? 0,
    noticias: n.count ?? 0,
  };
}

export default async function PaginaAdmin() {
  const [usuario, n] = await Promise.all([usuarioActual(), conteos()]);

  const secciones = [
    {
      href: "/admin/comunidades",
      icono: Users,
      titulo: "Comunidades",
      cuantos: n.comunidades,
      descripcion: "Quiénes son, dónde están y cómo contactarlas.",
    },
    {
      href: "/admin/productos",
      icono: ShoppingBasket,
      titulo: "Productos",
      cuantos: n.productos,
      descripcion: "Lo que hacen y venden, con sus fotos.",
    },
    {
      href: "/admin/eventos",
      icono: CalendarDays,
      titulo: "Eventos",
      cuantos: n.eventos,
      descripcion: "Ferias, talleres y encuentros del calendario.",
    },
    {
      href: "/admin/noticias",
      icono: Newspaper,
      titulo: "Noticias",
      cuantos: n.noticias,
      descripcion: "Historias y novedades de la red.",
    },
  ];

  return (
    <main className="container-page py-12 sm:py-16">
      <span className="eyebrow">Panel</span>

      <h1 className="mt-3 font-titulos text-4xl font-semibold leading-tight text-texto sm:text-5xl">
        Hola, <span className="break-words">{usuario?.email}</span>
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-texto-suave">
        Desde aquí cambias lo que se ve en el sitio. Lo que guardes aparece publicado en
        unos segundos, sin que nadie más tenga que hacer nada.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {secciones.map(({ href, icono: Icono, titulo, cuantos, descripcion }) => (
          <Link
            key={href}
            href={href}
            className="card flex items-center gap-5 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-crema">
              <Icono size={26} className="text-verde-bosque" aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-titulos text-2xl font-semibold text-texto">{titulo}</span>
              <span className="mt-0.5 block text-base text-texto-suave">{descripcion}</span>
              <span className="mt-2 block text-base font-semibold text-verde-bosque">
                {cuantos === 1 ? "1 publicado" : `${cuantos} publicados`}
              </span>
            </span>

            <ChevronRight size={24} className="shrink-0 text-texto-suave" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <p className="mt-10 rounded-3xl bg-blanco p-6 text-base leading-relaxed text-texto-suave">
        ¿Primera vez aquí? La{" "}
        <a
          href="https://github.com/steven-ohmss/entre-mujeres/blob/main/docs/guia-panel.md"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-rosa-oscuro hover:underline"
        >
          guía del panel
        </a>{" "}
        explica paso a paso cómo agregar un producto con foto, editar una comunidad y
        publicar un evento.
      </p>
    </main>
  );
}
