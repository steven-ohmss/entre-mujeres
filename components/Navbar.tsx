"use client";

import { useEffect, useState } from "react";
import { Menu, X, Search, CircleUserRound, Venus } from "lucide-react";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#calendario", label: "Calendario" },
  { href: "#nosotras", label: "Nosotras" },
  { href: "#productos", label: "Productos" },
  { href: "#mapa", label: "Mapa" },
  { href: "#comunidades", label: "Comunidades" },
  { href: "#noticias", label: "Noticias" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [activeHref, setActiveHref] = useState("#inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-texto/10 bg-blanco">
      <nav className="container-page flex h-[72px] items-center justify-between gap-4">
        <a
          href="#inicio"
          className="flex shrink-0 items-center gap-1.5 font-serif text-xl italic text-texto"
        >
          <Venus size={20} className="text-rosa" strokeWidth={2.5} aria-hidden="true" />
          Entre mujeres
        </a>

        <div className="hidden lg:flex lg:items-center lg:gap-5 xl:gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              data-active={activeHref === link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <div className="hidden xl:block xl:w-64">
            <SearchBar />
          </div>

          <div className="relative xl:hidden">
            <button
              type="button"
              onClick={() => setIsSearchOpen((v) => !v)}
              aria-label="Buscar"
              aria-expanded={isSearchOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-texto/15 text-texto transition hover:bg-crema"
            >
              <Search size={18} />
            </button>
            {isSearchOpen ? (
              <div className="absolute right-0 top-full mt-2 w-80">
                <SearchBar autoFocus onNavigate={() => setIsSearchOpen(false)} />
              </div>
            ) : null}
          </div>

          <div className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-texto/15 text-texto">
            <CircleUserRound size={20} aria-hidden="true" />
            <span className="sr-only">Cuenta de usuario</span>
            <span className="pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap rounded-lg bg-texto px-3 py-1.5 text-xs text-blanco opacity-0 transition group-hover:opacity-100">
              Próximamente
            </span>
          </div>

          <a href="#quiero-ser-parte" className="btn-primary whitespace-nowrap">
            Sé parte →
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full text-texto lg:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-texto/10 bg-blanco px-5 pb-6 pt-4 lg:hidden">
          <div className="mb-4">
            <SearchBar onNavigate={() => setIsMenuOpen(false)} />
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-texto transition hover:bg-crema"
                data-active={activeHref === link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#quiero-ser-parte"
            onClick={() => setIsMenuOpen(false)}
            className="btn-primary mt-4 w-full"
          >
            Sé parte →
          </a>
        </div>
      ) : null}
    </header>
  );
}
