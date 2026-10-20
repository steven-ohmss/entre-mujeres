"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Home,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Search,
  ShoppingBasket,
  Users,
  Venus,
  X,
} from "lucide-react";
import SearchBar from "./SearchBar";

/**
 * Menú ordenado por importancia (4.1). "Comunidades" ya no está: se integra dentro de
 * Productos. Cada opción lleva un icono reconocible al lado del texto.
 */
const NAV_LINKS = [
  { href: "#inicio", label: "Inicio", icon: Home },
  { href: "#productos", label: "Productos", icon: ShoppingBasket },
  { href: "#mapa", label: "Mapa", icon: MapPin },
  { href: "#calendario", label: "Calendario", icon: CalendarDays },
  { href: "#noticias", label: "Noticias", icon: Newspaper },
  { href: "#nosotras", label: "Nosotras", icon: Users },
  { href: "#contacto", label: "Contacto", icon: Mail },
];

const ALTO_BARRA = 72;

export default function Navbar() {
  const [activeHref, setActiveHref] = useState("#inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [esSolido, setEsSolido] = useState(false);

  // Marca la sección que se está viendo.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /**
   * La barra pasa a sólida cuando el inicio deja de estar detrás de ella. Se mide contra
   * el alto real del inicio en vez de un número fijo, porque ese alto cambia entre celular
   * y escritorio. Translúcida solo tiene sentido sobre el inicio oscuro; encima del
   * contenido claro el texto no alcanzaría el contraste mínimo.
   */
  useEffect(() => {
    const inicio = document.getElementById("inicio");

    const revisar = () => {
      const limite = inicio ? inicio.offsetHeight - ALTO_BARRA : 40;
      setEsSolido(window.scrollY > Math.max(40, limite));
    };

    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    window.addEventListener("resize", revisar);
    return () => {
      window.removeEventListener("scroll", revisar);
      window.removeEventListener("resize", revisar);
    };
  }, []);

  // Con el menú de celular abierto, la página de atrás no se mueve.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className="header-glass fixed inset-x-0 top-0 z-50"
      data-solido={esSolido || isMenuOpen}
    >
      <nav className="container-page flex h-[72px] items-center justify-between gap-4">
        <a
          href="#inicio"
          className="flex shrink-0 items-center gap-1.5 font-titulos text-xl font-semibold"
        >
          <Venus size={20} className="text-rosa-claro" strokeWidth={2.5} aria-hidden="true" />
          Entre mujeres
        </a>

        <div className="hidden xl:flex xl:items-center xl:gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="nav-link px-2 py-2"
              data-active={activeHref === href}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>

        <div className="hidden xl:flex xl:items-center xl:gap-3">
          <div className="hidden 2xl:block 2xl:w-60">
            <SearchBar tono="oscuro" />
          </div>

          <div className="relative 2xl:hidden">
            <button
              type="button"
              onClick={() => setIsSearchOpen((v) => !v)}
              aria-label="Buscar"
              aria-expanded={isSearchOpen}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-crema/35 transition hover:bg-crema/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rosa-claro"
            >
              <Search size={20} />
            </button>
            {isSearchOpen ? (
              <div className="absolute right-0 top-full mt-2 w-80">
                <SearchBar autoFocus onNavigate={() => setIsSearchOpen(false)} />
              </div>
            ) : null}
          </div>

          <a
            href="#quiero-ser-parte"
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-crema px-6 font-semibold text-verde-bosque transition hover:bg-blanco focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-claro"
          >
            Sé parte →
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-crema/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rosa-claro xl:hidden"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-crema/15 px-5 pb-8 pt-5 xl:hidden">
          <div className="mb-5">
            <SearchBar onNavigate={() => setIsMenuOpen(false)} />
          </div>

          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="nav-movil"
                data-active={activeHref === href}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
                  <Icon size={22} aria-hidden="true" />
                </span>
                {label}
              </a>
            ))}
          </div>

          <a
            href="#quiero-ser-parte"
            onClick={() => setIsMenuOpen(false)}
            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-crema px-6 text-lg font-semibold text-verde-bosque"
          >
            Sé parte →
          </a>
        </div>
      ) : null}
    </header>
  );
}
