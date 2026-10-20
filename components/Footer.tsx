import Link from "next/link";
import { AtSign, Leaf, Mail, MapPin, MessageCircle, Phone, Venus } from "lucide-react";
import LeafDecoration from "./LeafDecoration";
import {
  contacto,
  esPendiente,
  mensajeGeneral,
  urlCorreo,
  urlInstagram,
  urlTelefono,
  urlWhatsApp,
} from "@/config/site";

// Mismo orden que el menú del header, para que el sitio se lea igual en los dos lados.
const FOOTER_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/#mapa", label: "Mapa" },
  { href: "/#calendario", label: "Calendario" },
  { href: "/#noticias", label: "Noticias" },
  { href: "/#nosotras", label: "Nosotras" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/#quiero-ser-parte", label: "Quiero ser parte" },
];

export default function Footer() {
  // Mismo bloque de contacto que la sección, sacado de la misma configuración (4.8).
  const vias = [
    {
      icon: MessageCircle,
      texto: esPendiente(contacto.whatsapp) ? "WhatsApp pendiente" : contacto.whatsapp,
      href: urlWhatsApp(contacto.whatsapp, mensajeGeneral()),
      externo: true,
    },
    {
      icon: Phone,
      texto: esPendiente(contacto.telefono) ? "Teléfono pendiente" : contacto.telefono,
      href: urlTelefono(contacto.telefono),
    },
    {
      icon: Mail,
      texto: esPendiente(contacto.correo) ? "Correo pendiente" : contacto.correo,
      href: urlCorreo(contacto.correo),
    },
    {
      icon: AtSign,
      texto: esPendiente(contacto.instagram) ? "Redes pendientes" : contacto.instagram,
      href: urlInstagram(contacto.instagram),
      externo: true,
    },
    { icon: MapPin, texto: contacto.ubicacion, href: null },
  ];

  return (
    <footer>
      <div className="relative overflow-hidden bg-verde-bosque py-10 text-blanco">
        <LeafDecoration
          color="#F7F3EB"
          className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 opacity-20"
        />
        <LeafDecoration
          color="#F7F3EB"
          className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rotate-45 opacity-20"
        />
        <div className="container-page relative flex flex-col items-center gap-2 text-center">
          <Leaf size={22} aria-hidden="true" />
          <p className="font-titulos text-2xl italic">Territorios que nos unen</p>
          <p className="text-sm font-semibold uppercase tracking-widest">Red Mujer</p>
        </div>
      </div>

      <div className="bg-texto py-14 text-blanco/90">
        <div className="container-page grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 font-titulos text-xl font-semibold text-blanco">
              <Venus size={20} className="text-rosa" aria-hidden="true" />
              Entre mujeres
            </p>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-blanco/70">
              Plataforma comunitaria para descubrir, conectar y fortalecer comunidades,
              organizaciones y emprendimientos de mujeres en Bogotá y Cundinamarca. Una
              iniciativa de Red Mujer.
            </p>
          </div>

          <div>
            <p className="text-base font-bold uppercase tracking-wide text-blanco">Explora</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-base text-blanco/70">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-12 items-center transition hover:text-blanco"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-base font-bold uppercase tracking-wide text-blanco">Contacto</p>
            <ul className="mt-4 flex flex-col gap-1 text-base text-blanco/70">
              {vias.map(({ icon: Icon, texto, href, externo }) => (
                <li key={texto}>
                  {href ? (
                    <a
                      href={href}
                      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex min-h-12 items-center gap-2 break-words transition hover:text-blanco"
                    >
                      <Icon size={17} className="shrink-0" aria-hidden="true" />
                      {texto}
                    </a>
                  ) : (
                    <span className="flex min-h-12 items-center gap-2">
                      <Icon size={17} className="shrink-0" aria-hidden="true" />
                      {texto}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-page mt-10 border-t border-blanco/10 pt-6 text-center text-xs text-blanco/50">
          © 2026 Entre mujeres · Red Mujer
        </div>
      </div>
    </footer>
  );
}
