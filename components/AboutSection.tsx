import { HeartHandshake, MapPin, Target, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Foto from "./Foto";
import type { Community } from "@/types";

const BLOQUES = [
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

/** Los cinco pasos del acompañamiento sí son una secuencia: van numerados por eso. */
const PASOS = [
  { numero: 1, label: "Conocemos" },
  { numero: 2, label: "Organizamos" },
  { numero: 3, label: "Acompañamos" },
  { numero: 4, label: "Aprendemos" },
  { numero: 5, label: "Continuamos" },
];

/**
 * Nosotras (4.9): reúne en un solo lugar "Somos Red Mujer", los cuatro bloques de
 * quiénes somos y "Construimos la red juntas", que antes era una sección suelta al final
 * del sitio sin relación visible con el resto.
 */
export default function AboutSection({ comunidades }: { comunidades: Community[] }) {
  const redMujer = comunidades.find((c) => c.id === "red-mujer");

  return (
    <section id="nosotras" className="bg-blanco py-20 sm:py-24">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 h-72 w-full overflow-hidden rounded-3xl bg-rosa-palido sm:h-96 lg:order-1">
            <Foto
              src={redMujer?.image}
              alt="Mujeres de Red Mujer reunidas en la vereda Arrayanes, Usme"
              icon={Users}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              title="Somos Red Mujer"
              description="Somos una organización cuyo objetivo es fomentar con Responsabilidad Social Empresarial e Igualdad de derechos de mujeres, jóvenes, niños y adultos mayores, generando espacios para el fortalecimiento de la productividad de la región."
            />

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {BLOQUES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-texto/10 p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-verde-bosque/10 text-verde-bosque">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 font-titulos text-lg font-semibold text-texto">{title}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-texto-suave">{text}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-base leading-relaxed text-texto-suave">
              Red Mujer busca que la red siga creciendo y se relacione con otras iniciativas del
              territorio, como Mujer y Tierra, para fortalecer juntas el trabajo de las mujeres de
              Bogotá y Cundinamarca.
            </p>
          </div>
        </div>

        <div className="mt-20 border-t border-texto/10 pt-16">
          <SectionHeading
            align="center"
            title="Construimos la red juntas"
            description="El proyecto incluye un acompañamiento inicial a Red Mujer para organizar contenidos, actualizar la información y aprender a usar la herramienta, hasta que puedan manejarla de forma autónoma."
          />

          <ol className="mx-auto mt-12 flex max-w-4xl flex-col gap-8 sm:flex-row sm:justify-between">
            {PASOS.map((paso) => (
              <li key={paso.numero} className="flex flex-1 flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-verde-bosque font-titulos text-xl font-semibold text-blanco">
                  {paso.numero}
                </span>
                <span className="text-base font-semibold text-texto">{paso.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
