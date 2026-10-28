"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPinOff } from "lucide-react";
import MapFilters from "./MapFilters";
import CommunityMapCard from "./CommunityMapCard";
import LimiteDeError from "./LimiteDeError";
import type { MapMarkerWithCommunity } from "./CommunityLeafletMap";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type {
  Community,
  CommunityCategory,
  MapMarker,
  Product,
  ProductType,
  Localidad,
} from "@/types";

// Leaflet solo funciona en el navegador.
const CommunityLeafletMap = dynamic(() => import("./CommunityLeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-rosa-palido/40" />,
});

interface InteractiveMapProps {
  comunidades: Community[];
  marcadores: MapMarker[];
  productos: Product[];
}

export default function InteractiveMap({
  comunidades,
  marcadores,
  productos,
}: InteractiveMapProps) {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  /**
   * El mapa solo existe mientras esta página se está viendo.
   *
   * Desde que el proyecto usa Cache Components, Next no desmonta la ruta anterior al
   * navegar: la deja montada pero oculta (React Activity) y vuelve a ejecutar sus
   * efectos al mostrarla. Las refs, en cambio, no se limpian. Leaflet no sobrevive a esa
   * combinación: al ocultarse destruye su mapa en la limpieza de un efecto, pero su
   * referencia al nodo sigue viva, así que al volver sus hijos añaden capas y controles
   * a un mapa ya muerto:
   *
   *   TypeError: Cannot read properties of undefined (reading 'appendChild')
   *   TypeError: Cannot read properties of undefined (reading 'topright')
   *
   * Eso tumbaba la página entera al volver al inicio desde el menú, con "Inicio" y con
   * "Mapa", porque los dos llevan a "/".
   *
   * La solución es no pelear con Leaflet: cuando la ruta se oculta, este efecto se
   * limpia y el mapa se desmonta de verdad; cuando se vuelve a mostrar, se monta uno
   * nuevo desde cero, que es el único camino que Leaflet maneja bien.
   *
   * Dos intentos anteriores no sirvieron, y vale la pena dejarlo escrito:
   *
   * - Subir un contador desde un efecto para usarlo de `key` llega tarde: los efectos de
   *   los hijos corren antes que los del padre, así que ya habían reventado.
   * - `bfcacheId` como `key` arregla las llegadas por enlace, pero a propósito NO cambia
   *   en atrás/adelante del navegador, y ahí el mapa seguía rompiéndose.
   */
  // Montar y desmontar el mapa junto con la visibilidad de la ruta es exactamente el
  // sistema externo que este efecto tiene que sincronizar, así que el render de más es
  // el mecanismo y no un descuido.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    return () => setVisible(false);
  }, []);

  const markersWithCommunity = useMemo<MapMarkerWithCommunity[]>(
    () =>
      marcadores.flatMap((marker) => {
        const community = comunidades.find((c) => c.id === marker.communityId);
        return community ? [{ marker, community }] : [];
      }),
    [comunidades, marcadores]
  );
  const filtersPanelRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "Todas">("Todas");
  const [productType, setProductType] = useState<ProductType | "Todas">("Todas");
  const [localidad, setLocalidad] = useState<Localidad | "Todas">("Todas");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const filteredMarkers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return markersWithCommunity.filter(({ community }) => {
      const matchesCategory = category === "Todas" || community.category === category;
      const matchesLocalidad = localidad === "Todas" || community.localidad === localidad;
      const matchesProductType =
        productType === "Todas" ||
        productos.some((p) => p.communityId === community.id && p.type === productType);
      const matchesSearch =
        term.length === 0 ||
        community.name.toLowerCase().includes(term) ||
        community.ubicacion.toLowerCase().includes(term);

      return matchesCategory && matchesLocalidad && matchesProductType && matchesSearch;
    });
  }, [category, localidad, markersWithCommunity, productType, productos, searchTerm]);

  // En escritorio la ficha es un popup que solo se abre al elegir un marcador; en pantallas
  // pequeñas la ficha va debajo del mapa y muestra la primera comunidad visible por defecto.
  const effectiveSelectedId = filteredMarkers.some(({ marker }) => marker.id === selectedMarkerId)
    ? selectedMarkerId
    : isDesktop
      ? null
      : filteredMarkers[0]?.marker.id ?? null;

  const selectedCommunity = filteredMarkers.find(
    ({ marker }) => marker.id === effectiveSelectedId
  )?.community;

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("Todas");
    setProductType("Todas");
    setLocalidad("Todas");
  };

  return (
    <section id="mapa" className="bg-blanco py-20 sm:py-24">
      <div className="container-page mb-6">
        <h2 className="font-titulos text-3xl font-semibold text-texto sm:text-4xl">
          Comunidades de mujeres
        </h2>
        <p className="mt-2 text-lg text-texto-suave">
          Toca un punto para ver quién está ahí y qué hace.
        </p>
      </div>

      <div className="container-page">
        {/* Contexto de apilamiento propio: nada de Leaflet queda sobre el navbar. */}
        <div className="relative isolate z-0">
          <div
            ref={filtersPanelRef}
            className="mb-6 rounded-[20px] bg-crema xl:absolute xl:left-4 xl:top-4 xl:z-[1000] xl:mb-0 xl:max-h-[calc(100%-32px)] xl:w-[300px] xl:overflow-y-auto xl:shadow-[0_10px_30px_rgba(30,35,30,0.15)]"
          >
            <MapFilters
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              category={category}
              onCategoryChange={setCategory}
              productType={productType}
              onProductTypeChange={setProductType}
              localidad={localidad}
              onLocalidadChange={setLocalidad}
              onClear={clearFilters}
              alwaysOpen={isDesktop}
            />
          </div>

          <div
            role="region"
            aria-label="Mapa interactivo de Bogotá y Cundinamarca con las comunidades de mujeres"
            className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-texto/10 xl:h-[clamp(560px,80vh,720px)]"
          >
            {/* Si el mapa falla, que falte el mapa y no la página entera: debajo están
                el calendario, las noticias y el contacto, que siguen sirviendo. */}
            <LimiteDeError
              nombre="el mapa"
              respaldo={
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-crema px-6 text-center">
                  <MapPinOff size={34} strokeWidth={1.5} className="text-texto-suave" aria-hidden="true" />
                  <p className="text-base text-texto-suave">
                    El mapa no se pudo mostrar. Puedes ver las mismas comunidades en{" "}
                    <Link href="/productos" className="font-semibold text-rosa-oscuro hover:underline">
                      la página de productos
                    </Link>
                    .
                  </p>
                </div>
              }
            >
              {visible ? (
                <CommunityLeafletMap
                  markers={filteredMarkers}
                  selectedMarkerId={effectiveSelectedId}
                  onSelectMarker={setSelectedMarkerId}
                  onClosePopup={(markerId) =>
                    setSelectedMarkerId((current) => (current === markerId ? null : current))
                  }
                  localidad={localidad}
                  isDesktop={isDesktop}
                  panelRef={filtersPanelRef}
                />
              ) : (
                // Mientras no se está viendo esta página (o en el primer render), el
                // mismo fondo que usa el cargador: así no hay salto al aparecer.
                <div className="h-full w-full bg-rosa-palido/40" />
              )}
            </LimiteDeError>

            <div className="pointer-events-none absolute bottom-7 right-2 z-[1000] flex items-center gap-4 rounded-lg bg-crema/95 px-3 py-2 text-xs text-texto shadow-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-rosa" aria-hidden="true" />
                Bogotá
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full border-2 border-blanco bg-[#FFE600] shadow-sm"
                  aria-hidden="true"
                />
                Comunidad
              </span>
            </div>
          </div>

          {filteredMarkers.length === 0 ? (
            <div className="mt-4 xl:absolute xl:bottom-8 xl:left-[calc(50%+158px)] xl:z-[1000] xl:mt-0 xl:-translate-x-1/2">
              <div className="rounded-2xl border border-dashed border-texto/20 bg-crema p-8 text-center xl:shadow-lg">
                <p className="text-base text-texto-suave">
                  No encontramos iniciativas con esos filtros
                </p>
                <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
                  Limpiar filtros
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-xs text-texto-suave">
          Límites de localidades: Datos Abiertos Bogotá (CC BY 4.0)
        </p>

        {!isDesktop && selectedCommunity ? (
          <div className="mt-6">
            <CommunityMapCard community={selectedCommunity} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
