"use client";

import { createContext, useContext } from "react";
import type { Community, Product } from "@/types";

/**
 * Deja las comunidades y los productos al alcance de los componentes de navegador que
 * los necesitan, sobre todo el buscador.
 *
 * El buscador vive dentro de la barra de navegación, que sale en todas las páginas y en
 * tres lugares distintos de cada una. Pasarle los datos como props obligaría a encadenar
 * página → Navbar → SearchBar en cada ruta, así que se cargan una sola vez en el layout
 * (en el servidor, con caché) y se dejan aquí.
 *
 * El valor por defecto es vacío a propósito: si la base no responde, el buscador no
 * encuentra nada, pero la página se dibuja igual en vez de reventar.
 */

export interface Catalogo {
  comunidades: Community[];
  productos: Product[];
}

const CatalogoContext = createContext<Catalogo>({ comunidades: [], productos: [] });

export function useCatalogo(): Catalogo {
  return useContext(CatalogoContext);
}

export default function ProveedorCatalogo({
  valor,
  children,
}: {
  valor: Catalogo;
  children: React.ReactNode;
}) {
  return <CatalogoContext.Provider value={valor}>{children}</CatalogoContext.Provider>;
}
