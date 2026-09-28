import SectionHeading from "./SectionHeading";

const STEPS = [
  { number: 1, label: "Conocemos" },
  { number: 2, label: "Organizamos" },
  { number: 3, label: "Acompañamos" },
  { number: 4, label: "Aprendemos" },
  { number: 5, label: "Continuamos" },
];

export default function AccompanimentSection() {
  return (
    <section className="bg-blanco py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          align="center"
          title="Construimos la red juntas"
          description="El proyecto incluye un acompañamiento inicial a Red Mujer para organizar contenidos, actualizar la información y aprender a usar la herramienta, hasta que puedan manejarla de forma autónoma."
        />

        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-8 sm:flex-row sm:justify-between">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-1 flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-verde-bosque font-titulos text-lg text-blanco">
                {step.number}
              </span>
              <span className="text-sm font-semibold text-texto">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
