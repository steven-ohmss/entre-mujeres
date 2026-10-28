import { BarChart3, CalendarDays, Newspaper, ShoppingBasket, Users } from "lucide-react";
import { usuarioActual } from "@/lib/sesion";

/**
 * Bienvenida del panel. Por ahora solo saluda y enseña lo que vendrá en el paso 5.
 *
 * Las tarjetas se muestran apagadas a propósito, en vez de esconderlas: así el equipo ve
 * desde el primer día qué va a poder hacer aquí, y nadie se queda esperando una sección
 * que no sabía que existía.
 */

const SECCIONES = [
  {
    icono: Users,
    titulo: "Comunidades",
    descripcion: "Editar quiénes son, dónde están y su contacto.",
  },
  {
    icono: ShoppingBasket,
    titulo: "Productos",
    descripcion: "Agregar productos, cambiar sus textos y subir sus fotos.",
  },
  {
    icono: CalendarDays,
    titulo: "Eventos",
    descripcion: "Publicar ferias, talleres y encuentros en el calendario.",
  },
  {
    icono: Newspaper,
    titulo: "Noticias",
    descripcion: "Contar historias y novedades de la red.",
  },
];

export default async function PaginaAdmin() {
  const usuario = await usuarioActual();

  return (
    <main className="container-page py-12 sm:py-16">
      <span className="eyebrow">Panel</span>

      <h1 className="mt-3 font-titulos text-4xl font-semibold leading-tight text-texto sm:text-5xl">
        Hola, <span className="break-words">{usuario?.email}</span>
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-texto-suave">
        Desde aquí vas a poder cambiar lo que se ve en el sitio sin tocar código. Todavía
        no está listo: por ahora, lo que publiques sigue entrando por nosotros.
      </p>

      <div className="mt-10 rounded-3xl border border-dashed border-texto/25 bg-blanco p-6 sm:p-8">
        <p className="flex items-center gap-2.5 font-titulos text-xl font-semibold text-texto">
          <BarChart3 size={22} className="shrink-0 text-verde-hoja" aria-hidden="true" />
          Lo que viene
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {SECCIONES.map(({ icono: Icono, titulo, descripcion }) => (
            <div
              key={titulo}
              aria-disabled="true"
              className="card flex flex-col gap-2 p-6 opacity-60"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-crema">
                <Icono size={24} className="text-verde-bosque" aria-hidden="true" />
              </span>
              <p className="mt-1 font-titulos text-xl font-semibold text-texto">{titulo}</p>
              <p className="text-base leading-relaxed text-texto-suave">{descripcion}</p>
              <span className="pill-tag mt-2 w-fit bg-rosa-palido text-rosa-oscuro">
                Próximamente
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
