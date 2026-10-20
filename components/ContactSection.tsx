import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import {
  contacto,
  esPendiente,
  mensajeGeneral,
  urlCorreo,
  urlInstagram,
  urlTelefono,
  urlWhatsApp,
} from "@/config/site";

interface Via {
  icon: LucideIcon;
  titulo: string;
  /** Lo que se ve: el dato real, o el aviso de que falta. */
  detalle: string;
  href: string | null;
  externo?: boolean;
}

/**
 * Contacto (4.8).
 *
 * Todos los datos salen de config/site.ts. Los que el equipo todavía no entregó se
 * muestran como "Pendiente" y no como un enlace roto: nunca se inventa un correo ni un
 * teléfono. El lenguaje es el de todos los días ("Escríbenos por WhatsApp").
 */
function construirVias(): Via[] {
  const whatsapp = urlWhatsApp(contacto.whatsapp, mensajeGeneral());
  const telefono = urlTelefono(contacto.telefono);
  const correo = urlCorreo(contacto.correo);
  const instagram = urlInstagram(contacto.instagram);

  return [
    {
      icon: MessageCircle,
      titulo: "Escríbenos por WhatsApp",
      detalle: esPendiente(contacto.whatsapp) ? "Pendiente" : contacto.whatsapp,
      href: whatsapp,
      externo: true,
    },
    {
      icon: Phone,
      titulo: "Llámanos",
      detalle: esPendiente(contacto.telefono) ? "Pendiente" : contacto.telefono,
      href: telefono,
    },
    {
      icon: Mail,
      titulo: "Escríbenos un correo",
      detalle: esPendiente(contacto.correo) ? "Pendiente" : contacto.correo,
      href: correo,
    },
    {
      icon: AtSign,
      titulo: "Síguenos",
      detalle: esPendiente(contacto.instagram) ? "Pendiente" : contacto.instagram,
      href: instagram,
      externo: true,
    },
    {
      icon: MapPin,
      titulo: "Dónde estamos",
      detalle: contacto.ubicacion,
      href: null,
    },
  ];
}

export default function ContactSection() {
  const vias = construirVias();

  return (
    <section id="contacto" className="bg-crema py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          align="center"
          title="Hablemos"
          description="Escríbenos por donde te quede más fácil. Te respondemos."
        />

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vias.map(({ icon: Icon, titulo, detalle, href, externo }) => {
            const interior = (
              <>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rosa-palido text-rosa-oscuro">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <span className="mt-4 block font-titulos text-xl font-semibold text-texto">
                  {titulo}
                </span>
                <span
                  className={`mt-1 block break-words text-base ${
                    href ? "text-texto-suave" : "italic text-texto-suave/80"
                  }`}
                >
                  {detalle}
                </span>
              </>
            );

            const base =
              "flex min-h-[170px] flex-col items-center justify-center rounded-3xl border border-texto/10 bg-blanco p-6 text-center";

            return href ? (
              <a
                key={titulo}
                href={href}
                {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${base} shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa`}
              >
                {interior}
              </a>
            ) : (
              <div key={titulo} className={base}>
                {interior}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
