import { MapPin } from "lucide-react";
import LeafDecoration from "./LeafDecoration";
import { GOOGLE_FORM_URL, esPendiente } from "@/config/site";

/**
 * Invitación a sumarse al mapa (4.7).
 *
 * Reemplaza el formulario largo que había antes: era tedioso, ocupaba media pantalla y
 * no guardaba nada en ninguna parte. Ahora son dos frases y un botón que abre el
 * formulario de Google, que es donde el equipo ya recibe las solicitudes.
 */
export default function JoinSection() {
  const url = GOOGLE_FORM_URL;
  const listo = !esPendiente(url);

  return (
    <section id="quiero-ser-parte" className="bg-crema pb-20 pt-4 sm:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-rosa-palido px-6 py-12 text-center sm:px-10 sm:py-14">
          <LeafDecoration className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 opacity-70" />
          <LeafDecoration className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rotate-180 opacity-60" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-titulos text-3xl font-semibold leading-tight text-texto sm:text-4xl">
              ¿Tienes una iniciativa de mujeres?
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-texto">
              Súmate y aparece en el mapa.
            </p>

            {listo ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8 px-8 text-lg"
              >
                <MapPin size={22} aria-hidden="true" />
                Quiero aparecer en el mapa
              </a>
            ) : (
              <p className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-dashed border-texto/40 px-6 text-base text-texto">
                <MapPin size={20} aria-hidden="true" />
                Formulario pendiente
              </p>
            )}

            <p className="mt-5 text-base text-texto-suave">
              Se abre en una pestaña nueva. Son pocas preguntas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
