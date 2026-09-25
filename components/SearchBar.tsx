"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { communities, products, calendarEvents } from "@/data/data";

interface SearchResultGroup {
  label: string;
  items: { id: string; title: string; hint: string; href: string }[];
}

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export default function SearchBar({
  placeholder = "Buscar una comunidad, producto o lugar",
  autoFocus = false,
  className = "",
  onNavigate,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groups: SearchResultGroup[] = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];

    const communityMatches = communities
      .filter((c) => c.name.toLowerCase().includes(term) || c.ubicacion.toLowerCase().includes(term))
      .slice(0, 5)
      .map((c) => ({ id: c.id, title: c.name, hint: c.ubicacion, href: "#comunidades" }));

    const productMatches = products
      .filter((p) => p.name.toLowerCase().includes(term))
      .slice(0, 5)
      .map((p) => ({ id: p.id, title: p.name, hint: p.type, href: "#productos" }));

    const eventMatches = calendarEvents
      .filter((e) => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term))
      .slice(0, 5)
      .map((e) => ({ id: e.id, title: e.title, hint: e.location, href: "#calendario" }));

    const result: SearchResultGroup[] = [];
    if (communityMatches.length) result.push({ label: "Comunidades", items: communityMatches });
    if (productMatches.length) result.push({ label: "Productos", items: productMatches });
    if (eventMatches.length) result.push({ label: "Eventos", items: eventMatches });
    return result;
  }, [query]);

  const hasQuery = query.trim().length >= 2;
  const hasResults = groups.length > 0;

  const handleSelect = (href: string) => {
    setQuery("");
    setIsOpen(false);
    onNavigate?.();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-texto/15 bg-blanco px-4 py-2.5">
        <Search size={18} className="shrink-0 text-texto-suave" aria-hidden="true" />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full min-w-0 bg-transparent text-sm text-texto placeholder:text-texto-suave focus:outline-none"
        />
      </div>

      {isOpen && hasQuery ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-texto/10 bg-blanco p-2 shadow-xl animate-fade-in">
          {hasResults ? (
            groups.map((group) => (
              <div key={group.label} className="mb-1 last:mb-0">
                <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-texto-suave">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-crema"
                  >
                    <span className="text-sm font-medium text-texto">{item.title}</span>
                    <span className="text-xs text-texto-suave">{item.hint}</span>
                  </button>
                ))}
              </div>
            ))
          ) : (
            <p className="px-3 py-4 text-sm text-texto-suave">
              No encontramos resultados para &quot;{query}&quot;.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
