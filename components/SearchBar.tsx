"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, X } from "lucide-react";
import Foto from "./Foto";
import { ICONO_PRODUCTO, ICONO_TODAS } from "@/lib/categorias";
import { useCatalogo } from "./ProveedorCatalogo";
import {
  MINIMO_LETRAS,
  buscar,
  categoriasSugeridas,
  destinoAlEnviar,
  hrefCategoria,
  resultadosPlanos,
  type Resultado,
} from "@/lib/search";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
  /** "oscuro" para cuando va dentro del header verde; el desplegable siempre es claro. */
  tono?: "claro" | "oscuro";
}

function iconoDe(resultado: Resultado) {
  if (resultado.tipo === "comunidad") return Users;
  if (resultado.categoria) return ICONO_PRODUCTO[resultado.categoria];
  return ICONO_TODAS;
}

/**
 * Buscador (4.2).
 *
 * El problema que resuelve: antes, elegir "Mermelada campesina" llevaba otra vez a la
 * sección general de productos y tocaba volver a buscar ahí dentro. Ahora cada sugerencia
 * sabe su destino y abre directamente el producto o el perfil de la comunidad.
 */
export default function SearchBar({
  placeholder = "Buscar un producto o una comunidad",
  autoFocus = false,
  className = "",
  onNavigate,
  tono = "claro",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [resaltado, setResaltado] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alTocarFuera = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", alTocarFuera);
    return () => document.removeEventListener("mousedown", alTocarFuera);
  }, []);

  // El contenido llega del servidor por contexto (ver ProveedorCatalogo): el buscador
  // vive en la barra de navegación, que sale en todas las páginas, y así no hay que
  // encadenarle los datos ruta por ruta.
  const catalogo = useCatalogo();

  const grupos = useMemo(() => buscar(query, catalogo), [query, catalogo]);
  const planos = useMemo(() => resultadosPlanos(grupos), [grupos]);

  const hayConsulta = query.trim().length >= MINIMO_LETRAS;
  const hayResultados = planos.length > 0;
  const esOscuro = tono === "oscuro";

  const irA = (href: string) => {
    setQuery("");
    setIsOpen(false);
    setResaltado(-1);
    onNavigate?.();
    router.push(href);
  };

  const alEscribir = (valor: string) => {
    setQuery(valor);
    setIsOpen(true);
    setResaltado(-1);
  };

  const alPresionarTecla = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && planos.length > 0) {
      event.preventDefault();
      setResaltado((i) => (i + 1) % planos.length);
      return;
    }
    if (event.key === "ArrowUp" && planos.length > 0) {
      event.preventDefault();
      setResaltado((i) => (i <= 0 ? planos.length - 1 : i - 1));
      return;
    }
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      // Con algo resaltado se abre eso; si no, manda el buscador: un solo resultado va
      // directo y varios van a la lista ya filtrada.
      if (resaltado >= 0 && planos[resaltado]) {
        irA(planos[resaltado].href);
        return;
      }
      const destino = destinoAlEnviar(query, catalogo);
      if (destino) irA(destino);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        className={`flex min-h-12 items-center gap-2 rounded-full border px-4 ${
          esOscuro
            ? "border-crema/35 bg-crema/15 text-crema"
            : "border-texto/15 bg-blanco text-texto"
        }`}
      >
        <Search
          size={18}
          className={`shrink-0 ${esOscuro ? "text-crema/80" : "text-texto-suave"}`}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => alEscribir(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={alPresionarTecla}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-expanded={isOpen && hayConsulta}
          aria-controls="resultados-busqueda"
          role="combobox"
          className={`w-full min-w-0 bg-transparent text-sm focus:outline-none ${
            esOscuro
              ? "text-crema placeholder:text-crema/75"
              : "text-texto placeholder:text-texto-suave"
          }`}
        />
        {query ? (
          <button
            type="button"
            onClick={() => alEscribir("")}
            aria-label="Borrar la búsqueda"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              esOscuro ? "text-crema/80 hover:bg-crema/15" : "text-texto-suave hover:bg-crema"
            }`}
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {isOpen && hayConsulta ? (
        <div
          id="resultados-busqueda"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[26rem] overflow-y-auto rounded-2xl border border-texto/10 bg-blanco p-2 shadow-xl animate-fade-in"
        >
          {hayResultados ? (
            grupos.map((grupo) => (
              <div key={grupo.tipo} className="mb-1 last:mb-0">
                <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-texto-suave">
                  {grupo.etiqueta}
                </p>

                {grupo.items.map((item) => {
                  const Icono = iconoDe(item);
                  const indice = planos.findIndex((r) => r.id === item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => irA(item.href)}
                      onMouseEnter={() => setResaltado(indice)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        indice === resaltado ? "bg-crema" : "hover:bg-crema"
                      }`}
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-rosa-palido">
                        {item.imagen ? (
                          <Foto src={item.imagen} alt="" icon={Icono} sizes="48px" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-rosa-oscuro">
                            <Icono size={22} aria-hidden="true" />
                          </span>
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-base font-medium text-texto">
                          {item.titulo}
                        </span>
                        <span className="block truncate text-sm text-texto-suave">
                          {item.detalle}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="px-3 py-4">
              <p className="text-base text-texto">
                No encontramos nada con <strong>“{query.trim()}”</strong>.
              </p>
              <p className="mt-1 text-sm text-texto-suave">Prueba con una de estas categorías:</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {categoriasSugeridas(catalogo.productos).map((categoria) => {
                  const Icono = ICONO_PRODUCTO[categoria];
                  return (
                    <button
                      key={categoria}
                      type="button"
                      onClick={() => irA(hrefCategoria(categoria))}
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-texto/20 px-4 text-sm font-medium text-texto transition hover:bg-crema"
                    >
                      <Icono size={17} aria-hidden="true" />
                      {categoria}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
