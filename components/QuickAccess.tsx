import Link from "next/link";
import { CalendarDays, MapPin, Newspaper, ShoppingBasket } from "lucide-react";

/**
 * Cuatro accesos rápidos (4.3.6): tarjetas grandes y simétricas, con icono grande, título
 * y una sola línea de descripción. Son el atajo a lo que la gente viene a buscar.
 */
const ACCESOS = [
  {
    icon: CalendarDays,
    title: "Eventos",
    description: "Ferias, talleres y encuentros",
    href: "#calendario",
  },
  {
    icon: MapPin,
    title: "Mapa",
    description: "Comunidades cerca de ti",
    href: "#mapa",
  },
  {
    icon: ShoppingBasket,
    title: "Productos",
    description: "Hechos por mujeres del territorio",
    href: "/productos",
  },
  {
    icon: Newspaper,
    title: "Historias",
    description: "Lo que están viviendo",
    href: "#noticias",
  },
];

export default function QuickAccess() {
  return (
    <section className="bg-crema py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACCESOS.map(({ icon: Icon, title, description, href }) => {
            const contenido = (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rosa-palido text-rosa-oscuro transition group-hover:bg-rosa group-hover:text-blanco">
                  <Icon size={30} aria-hidden="true" />
                </span>
                <span className="mt-5 block font-titulos text-2xl font-semibold text-texto">
                  {title}
                </span>
                <span className="mt-1.5 block text-base leading-snug text-texto-suave">
                  {description}
                </span>
              </>
            );

            const clases =
              "group flex min-h-[200px] flex-col items-center justify-center rounded-3xl border border-texto/10 bg-blanco p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa";

            return href.startsWith("/") ? (
              <Link key={title} href={href} className={clases}>
                {contenido}
              </Link>
            ) : (
              <a key={title} href={href} className={clases}>
                {contenido}
              </a>
            );
          })}
        </div>

        {/* La frase va aparte de las tarjetas, como pedía la retroalimentación. */}
        <p className="script-text mt-14 text-center text-2xl text-verde-bosque sm:text-3xl">
          Cuando una mujer avanza, avanzamos todas
        </p>
      </div>
    </section>
  );
}
