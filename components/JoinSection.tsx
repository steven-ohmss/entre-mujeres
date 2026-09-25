import LeafDecoration from "./LeafDecoration";
import JoinForm from "./JoinForm";

export default function JoinSection() {
  return (
    <section id="quiero-ser-parte" className="bg-crema py-20 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-rosa-palido px-6 py-12 sm:px-10 sm:py-16">
          <LeafDecoration className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 opacity-70" />
          <LeafDecoration className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rotate-180 opacity-60" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-texto sm:text-4xl">
                Quiero ser parte
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-texto">
                Si eres una comunidad, organización o emprendimiento y quieres visibilizar tu
                trabajo, puedes formar parte de Entre mujeres.
              </p>
            </div>

            <JoinForm />
          </div>
        </div>
      </div>
    </section>
  );
}
