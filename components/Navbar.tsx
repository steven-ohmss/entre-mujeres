"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import AccesoCuenta from "./AccesoCuenta";

/**
 * Menú ordenado por importancia (4.1). "Comunidades" ya no está: se integra dentro de
 * Productos. Cada opción lleva un icono reconocible al lado del texto.
 *
 * Productos es la única que es una página aparte, porque el buscador tiene que poder
 * llevar a un producto concreto y eso necesita una dirección propia. Las demás son
 * secciones del inicio, y van con "/#" para que también funcionen desde otra página.
 */
const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio", icon: Home },
  { href: "/productos", label: "Productos", icon: ShoppingBasket },
  { href: "/#mapa", label: "Mapa", icon: MapPin },
  { href: "/#calendario", label: "Calendario", icon: CalendarDays },
  { href: "/#noticias", label: "Noticias", icon: Newspaper },
  { href: "/#nosotras", label: "Nosotras", icon: Users },
  { href: "/#contacto", label: "Contacto", icon: Mail },
];

const ALTO_BARRA = 72;

/** "/#mapa" → "#mapa"; "/productos" → null (no es una sección del inicio). */
function anclaDe(href: string): string | null {
  const i = href.indexOf("#");
  return i === -1 ? null : href.slice(i);
}

export default function Navbar() {
  const pathname = usePathname();
  const enInicio = pathname === "/";
  const [seccionActiva, setSeccionActiva] = useState("#inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [esSolido, setEsSolido] = useState(false);

  // Marca la sección que se está viendo. Solo aplica en el inicio: en las demás páginas
  // la opción activa la decide la dirección.
  useEffect(() => {
    if (!enInicio) return;

    const secciones = NAV_LINKS.map((link) => anclaDe(link.href))
      .filter((ancla): ancla is string => Boolean(ancla))
      .map((ancla) => document.querySelector(ancla))
      .filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSeccionActiva(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    secciones.forEach((seccion) => observer.observe(seccion));
    return () => observer.disconnect();
  }, [enInicio]);

  const estaActiva = (href: string) => {
    const ancla = anclaDe(href);
    if (ancla) return enInicio && seccionActiva === ancla;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /**
   * La barra pasa a sólida cuando el inicio deja de estar detrás de ella. Se mide contra
   * el alto real del inicio en vez de un número fijo, porque ese alto cambia entre celular
   * y escritorio. Translúcida solo tiene sentido sobre el inicio oscuro; encima del
   * contenido claro el texto no alcanzaría el contraste mínimo.
   */
  useEffect(() => {
    // Fuera del inicio no hay nada oscuro detrás; ahí la barra va sólida siempre y no hay
    // nada que medir (lo decide `barraSolida`, más abajo).
    if (!enInicio) return;

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
  }, [enInicio]);

  // Con el menú de celular abierto, la página de atrás no se mueve.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Sólida fuera del inicio, con el menú de celular abierto, o cuando ya se bajó del hero.
  const barraSolida = !enInicio || esSolido || isMenuOpen;

  return (
    <header className="header-glass fixed inset-x-0 top-0 z-50" data-solido={barraSolida}>
      <nav className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link
          href="/#inicio"
          className="flex shrink-0 items-center gap-1.5 font-titulos text-xl font-semibold"
        >
          <Venus size={20} className="text-rosa-claro" strokeWidth={2.5} aria-hidden="true" />
          Entre mujeres
        </Link>

        <div className="hidden xl:flex xl:items-center xl:gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="nav-link px-2 py-2"
              data-active={estaActiva(href)}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex xl:items-center xl:gap-3">
          {/* La caja de búsqueda completa solo cuando de verdad cabe.
              Estaba atada a 2xl (1536 px), pero ahí todavía no hay sitio: entre 1536 y
              1700 el menú, el buscador y "Sé parte" no caben juntos y el botón quedaba
              cortado contra el borde. Hasta 1700 el buscador es el icono, que abre el
              mismo campo en un desplegable. De 1700 en adelante nada cambia. */}
          <div className="hidden min-[1700px]:block min-[1700px]:w-60">
            <SearchBar tono="oscuro" />
          </div>

          <div className="relative min-[1700px]:hidden">
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

          <AccesoCuenta variante="header" />

          <Link
            href="/#quiero-ser-parte"
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-crema px-6 font-semibold text-verde-bosque transition hover:bg-blanco focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-claro"
          >
            Sé parte →
          </Link>
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
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="nav-movil"
                data-active={estaActiva(href)}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crema/15">
                  <Icon size={22} aria-hidden="true" />
                </span>
                {label}
              </Link>
            ))}
          </div>

          <AccesoCuenta variante="header-movil" onNavegar={() => setIsMenuOpen(false)} />

          <Link
            href="/#quiero-ser-parte"
            onClick={() => setIsMenuOpen(false)}
            className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-crema px-6 text-lg font-semibold text-verde-bosque"
          >
            Sé parte →
          </Link>
        </div>
      ) : null}
    </header>
  );
}
