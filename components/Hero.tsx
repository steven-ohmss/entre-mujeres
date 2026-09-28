import Image from "next/image";
import { Users, Sprout, Heart, Play } from "lucide-react";

const SIDE_WORDS = ["BOGOTÁ", "CUNDINAMARCA", "MUJERES", "TERRITORIO", "OPORTUNIDADES"];

const BENEFITS = [
  { icon: Users, label: "Más mujeres conectadas" },
  { icon: Sprout, label: "Territorios más fuertes" },
  { icon: Heart, label: "Oportunidades reales" },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-crema">
      <div className="relative min-h-[640px] w-full sm:min-h-[600px]">
        <div className="absolute inset-0 bg-verde-bosque/20">
          <Image
            src="/images/hero-mujeres.jpg"
            alt="Mujeres campesinas con sombrero trabajando en una huerta, con montañas al fondo"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-crema via-crema/85 to-crema/10 sm:from-crema sm:via-crema/70 sm:to-transparent" />

        <div className="relative z-10 flex h-full min-h-[640px] flex-col justify-center sm:min-h-[600px]">
          <div className="container-page py-16 sm:py-20">
            <div className="max-w-xl">
              <span className="eyebrow">Mujeres que transforman territorios</span>
              <h1 className="mt-3 font-titulos text-4xl leading-tight text-texto sm:text-5xl">
                ¿Quieres ser parte de esta comunidad?
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-texto-suave sm:text-lg">
                Si haces parte de una iniciativa, emprendimiento o colectivo de mujeres en
                Bogotá o Cundinamarca, cuéntanos tu historia. Queremos conocerte, apoyarte y
                dar más visibilidad al trabajo de las mujeres que hacen territorio.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#quiero-ser-parte" className="btn-primary">
                  Registra tu iniciativa →
                </a>
                <a href="#nosotras" className="btn-secondary">
                  Conoce más
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                {BENEFITS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blanco text-verde-bosque">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-texto">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p
          className="script-text absolute right-6 top-8 hidden max-w-[220px] text-right text-blanco drop-shadow-sm sm:right-10 sm:top-10 md:block"
          aria-hidden="true"
        >
          Del territorio nacen grandes historias
        </p>

        <ul
          className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col gap-3 text-right text-xs font-semibold tracking-widest text-blanco lg:flex"
          aria-hidden="true"
        >
          {SIDE_WORDS.map((word) => (
            <li key={word} className="flex items-center justify-end gap-2">
              {word}
              <span className="h-1.5 w-1.5 rounded-full bg-blanco" />
            </li>
          ))}
        </ul>

        <a
          href="#noticias"
          className="absolute bottom-6 right-6 hidden items-center gap-3 rounded-2xl bg-blanco/95 px-4 py-3 shadow-lg transition hover:bg-blanco sm:flex"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde-bosque text-blanco">
            <Play size={16} fill="currentColor" aria-hidden="true" />
          </span>
          <span className="text-left">
            <span className="block text-xs text-texto-suave">Conoce sus historias</span>
            <span className="block text-sm font-semibold text-texto">Historias que inspiran</span>
          </span>
        </a>
      </div>
    </section>
  );
}
