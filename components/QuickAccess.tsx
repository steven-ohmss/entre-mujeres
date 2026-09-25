import Image from "next/image";
import { CalendarDays, MapPin, ShoppingBasket, Newspaper, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  {
    icon: CalendarDays,
    title: "Consulta próximos eventos",
    subtitle: "Ferias, talleres y más",
    href: "#calendario",
  },
  {
    icon: MapPin,
    title: "Explora el mapa interactivo",
    subtitle: "Conoce iniciativas cercanas",
    href: "#mapa",
  },
  {
    icon: ShoppingBasket,
    title: "Descubre nuestros productos",
    subtitle: "Hechos por mujeres",
    href: "#productos",
  },
  {
    icon: Newspaper,
    title: "Lee sus historias",
    subtitle: "Experiencias que inspiran",
    href: "#noticias",
  },
];

const CIRCLE_IMAGES = [
  { src: "/images/comunidad-1.jpg", alt: "Mujer de una comunidad productora de la red" },
  { src: "/images/comunidad-2.jpg", alt: "Mujer de un emprendimiento textil de la red" },
  { src: "/images/comunidad-3.jpg", alt: "Mujer de una comunidad rural de Sumapaz" },
  { src: "/images/comunidad-4.jpg", alt: "Mujer de un servicio de apoyo comunitario" },
];

export default function QuickAccess() {
  return (
    <section className="relative z-10 bg-crema">
      <div className="container-page">
        <div className="-mt-10 flex flex-col gap-6 rounded-3xl bg-blanco p-6 shadow-lg sm:-mt-14 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:flex-1">
            {QUICK_LINKS.map(({ icon: Icon, title, subtitle, href }) => (
              <a
                key={title}
                href={href}
                className="flex flex-col items-start gap-2 rounded-2xl p-2 transition hover:bg-crema"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rosa-palido text-rosa-oscuro">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-texto">{title}</span>
                <span className="text-xs text-texto-suave">{subtitle}</span>
              </a>
            ))}
          </div>
          <p className="script-text hidden shrink-0 text-verde-bosque lg:block lg:max-w-[200px]">
            Cuando una mujer avanza, avanzamos todas
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          <span className="eyebrow">Un territorio lleno de vida</span>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-texto sm:text-4xl">
            Mujeres que hacen la diferencia
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-texto-suave">
            Conectamos iniciativas, productos y comunidades de mujeres en Bogotá y
            Cundinamarca para construir un futuro más justo, sostenible e inclusivo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex -space-x-4">
              {CIRCLE_IMAGES.map((image) => (
                <span
                  key={image.src}
                  className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-crema bg-rosa-palido sm:h-20 sm:w-20"
                >
                  <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="80px" />
                </span>
              ))}
            </div>
            <a
              href="#noticias"
              className="script-text flex items-center gap-2 text-verde-bosque transition hover:text-verde-bosque-oscuro"
            >
              Conoce sus historias
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
