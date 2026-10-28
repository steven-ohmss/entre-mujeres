"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";
import FiltrosProductos, { type EstadoFiltros } from "./FiltrosProductos";
import { useCatalogo } from "./ProveedorCatalogo";
import { ICONO_PRODUCTO } from "@/lib/categorias";
import { categoriasSugeridas, filtrarProductos, hrefCategoria } from "@/lib/search";
import type { CommunityCategory, Localidad, ProductType } from "@/types";

/**
 * Pestaña única de Productos (4.4.2), que también es el destino de las búsquedas con
 * varios resultados: lee ?q= y ?categoria= de la dirección, para que un resultado de
 * búsqueda se pueda compartir y volver a abrir tal cual.
 */
export default function ListadoProductos() {
  const router = useRouter();
  const parametros = useSearchParams();
  const texto = parametros.get("q")?.trim() ?? "";
  const categoriaUrl = parametros.get("categoria") as ProductType | null;
  const catalogo = useCatalogo();
  const { comunidades, productos } = catalogo;

  const [categoria, setCategoria] = useState<ProductType | "Todas">(categoriaUrl ?? "Todas");
  const [localidad, setLocalidad] = useState<Localidad | "Todas">("Todas");
  const [tipoComunidad, setTipoComunidad] = useState<CommunityCategory | "Todas">("Todas");

  const filtros: EstadoFiltros = { categoria, localidad, tipoComunidad, texto };

  const visibles = useMemo(() => {
    const base = texto ? filtrarProductos(texto, catalogo) : productos;

    return base.filter((producto) => {
      const comunidad = comunidades.find((c) => c.id === producto.communityId);
      const coincideCategoria = categoria === "Todas" || producto.type === categoria;
      const coincideLocalidad = localidad === "Todas" || comunidad?.localidad === localidad;
      const coincideTipo = tipoComunidad === "Todas" || comunidad?.category === tipoComunidad;
      return coincideCategoria && coincideLocalidad && coincideTipo;
    });
  }, [catalogo, categoria, comunidades, localidad, productos, texto, tipoComunidad]);

  const hayFiltros = categoria !== "Todas" || localidad !== "Todas" || tipoComunidad !== "Todas";

  const limpiarTodo = () => {
    setCategoria("Todas");
    setLocalidad("Todas");
    setTipoComunidad("Todas");
  };

  return (
    <div className="flex flex-col gap-10">
      <FiltrosProductos
        filtros={filtros}
        onCategoria={setCategoria}
        onLocalidad={setLocalidad}
        onTipoComunidad={setTipoComunidad}
        onLimpiarTexto={() => router.push("/productos")}
        onLimpiarTodo={limpiarTodo}
        hayFiltros={hayFiltros}
      />

      {visibles.length > 0 ? (
        <>
          <p className="text-base text-texto-suave">
            {visibles.length === 1 ? "1 producto" : `${visibles.length} productos`}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((producto) => (
              <ProductCard
                key={producto.id}
                product={producto}
                community={comunidades.find((c) => c.id === producto.communityId)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-texto/25 bg-blanco p-10 text-center">
          <PackageSearch
            size={44}
            strokeWidth={1.5}
            className="mx-auto text-texto-suave"
            aria-hidden="true"
          />
          <p className="mt-4 font-titulos text-2xl font-semibold text-texto">
            Todavía no encontramos eso
          </p>
          <p className="mx-auto mt-2 max-w-md text-base text-texto-suave">
            Puede que lo estemos escribiendo distinto. Prueba con una de estas categorías:
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {categoriasSugeridas(productos).map((sugerida) => {
              const Icono = ICONO_PRODUCTO[sugerida];
              return (
                <Link key={sugerida} href={hrefCategoria(sugerida)} className="pill-filter">
                  <Icono size={19} className="shrink-0" aria-hidden="true" />
                  {sugerida}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
