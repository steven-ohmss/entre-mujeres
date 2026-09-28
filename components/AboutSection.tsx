import Image from "next/image";
import { Users, Target, HeartHandshake, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";

const BLOCKS = [
  {
    icon: Users,
    title: "Quiénes somos",
    text: "Somos Red Mujer, una organización que trabaja por la Responsabilidad Social Empresarial y la igualdad de derechos en el territorio.",
  },
  {
    icon: Target,
    title: "Qué buscamos",
    text: "Fomentar espacios para el fortalecimiento de la productividad de la región y de las comunidades que la habitan.",
  },
  {
    icon: HeartHandshake,
    title: "A quiénes conectamos",
    text: "Mujeres, jóvenes, niños y adultos mayores del territorio, junto a otras comunidades y emprendimientos.",
  },
  {
    icon: MapPin,
    title: "Dónde estamos",
    text: "Usme – Vereda Arrayanes.",
  },
];

export default function AboutSection() {
  return (
    <section id="nosotras" className="bg-blanco py-20 sm:py-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative order-2 h-72 w-full overflow-hidden rounded-3xl bg-rosa-palido sm:h-96 lg:order-1">
          <Image
            src="/images/red-mujer.jpg"
            alt="Mujeres de Red Mujer en la vereda Arrayanes, Usme"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            title="Somos Red Mujer"
            description="Somos una organización cuyo objetivo es fomentar con Responsabilidad Social Empresarial e Igualdad de derechos de mujeres, jóvenes, niños y adultos mayores, generando espacios para el fortalecimiento de la productividad de la región."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BLOCKS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-texto/10 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-verde-bosque/10 text-verde-bosque">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-texto">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-texto-suave">{text}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-texto-suave">
            Red Mujer busca que se siga fortaleciendo la red y se relacione con otras iniciativas
            del territorio, para fortalecer juntas el trabajo de las mujeres en Bogotá y
            Cundinamarca.
          </p>
        </div>
      </div>
    </section>
  );
}
