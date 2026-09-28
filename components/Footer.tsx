import { Venus, Phone, Mail, AtSign, Leaf } from "lucide-react";
import LeafDecoration from "./LeafDecoration";
import { contactInfo } from "@/data/data";

const FOOTER_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#calendario", label: "Calendario" },
  { href: "#nosotras", label: "Nosotras" },
  { href: "#productos", label: "Productos" },
  { href: "#mapa", label: "Mapa" },
  { href: "#comunidades", label: "Comunidades" },
  { href: "#noticias", label: "Noticias" },
  { href: "#quiero-ser-parte", label: "Quiero ser parte" },
];

export default function Footer() {
  return (
    <footer id="contacto">
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
        </div>
      </div>

      <div className="bg-texto py-14 text-blanco/90">
        <div className="container-page grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 font-titulos text-xl italic text-blanco">
              <Venus size={18} className="text-rosa" aria-hidden="true" />
              Entre mujeres
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-blanco/70">
              Plataforma comunitaria para descubrir, conectar y fortalecer comunidades,
              organizaciones y emprendimientos de mujeres en Bogotá y Cundinamarca. Una
              iniciativa de Red Mujer.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blanco">Explora</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-blanco/70">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-blanco">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blanco">Contacto</p>
            <ul className="mt-4 space-y-2 text-sm text-blanco/70">
              <li className="flex items-center gap-2">
                <Mail size={15} aria-hidden="true" />
                {contactInfo.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} aria-hidden="true" />
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-2">
                <AtSign size={15} aria-hidden="true" />
                {contactInfo.social}
              </li>
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
