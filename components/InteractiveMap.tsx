"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MapFilters from "./MapFilters";
import CommunityMapCard from "./CommunityMapCard";
import CommunityModal from "./CommunityModal";
import type { MapMarkerWithCommunity } from "./CommunityLeafletMap";
import { communities, products, calendarEvents, mapMarkers } from "@/data/data";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { CommunityCategory, ProductType, Localidad } from "@/types";

// Leaflet solo funciona en el navegador.
const CommunityLeafletMap = dynamic(() => import("./CommunityLeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-rosa-palido/40" />,
});

const markersWithCommunity: MapMarkerWithCommunity[] = mapMarkers.flatMap((marker) => {
  const community = communities.find((c) => c.id === marker.communityId);
  return community ? [{ marker, community }] : [];
});

export default function InteractiveMap() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const filtersPanelRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "Todas">("Todas");
  const [productType, setProductType] = useState<ProductType | "Todas">("Todas");
  const [localidad, setLocalidad] = useState<Localidad | "Todas">("Todas");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    communityId: string;
    section: "info" | "productos";
  } | null>(null);

  const filteredMarkers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return markersWithCommunity.filter(({ community }) => {
      const matchesCategory = category === "Todas" || community.category === category;
      const matchesLocalidad = localidad === "Todas" || community.localidad === localidad;
      const matchesProductType =
        productType === "Todas" ||
        products.some((p) => p.communityId === community.id && p.type === productType);
      const matchesSearch =
        term.length === 0 ||
        community.name.toLowerCase().includes(term) ||
        community.ubicacion.toLowerCase().includes(term);

      return matchesCategory && matchesLocalidad && matchesProductType && matchesSearch;
    });
  }, [category, localidad, productType, searchTerm]);

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

  const modalCommunity = modalState
    ? communities.find((c) => c.id === modalState.communityId) ?? null
    : null;

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("Todas");
    setProductType("Todas");
    setLocalidad("Todas");
  };

  const openCommunity = (communityId: string) =>
    setModalState({ communityId, section: "info" });
  const openProducts = (communityId: string) =>
    setModalState({ communityId, section: "productos" });

  return (
    <section id="mapa" className="bg-blanco py-20 sm:py-24">
      <div className="container-page mb-6">
        <h3 className="font-sans text-2xl font-extrabold uppercase tracking-tight text-texto">
          Comunidades de mujeres
        </h3>
        <p className="text-sm font-semibold uppercase tracking-widest text-texto-suave">
          Cundinamarca – Bogotá
        </p>
      </div>

      <div className="container-page">
        {/* Contexto de apilamiento propio: nada de Leaflet queda sobre el navbar ni los modales. */}
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
            <CommunityLeafletMap
              markers={filteredMarkers}
              selectedMarkerId={effectiveSelectedId}
              onSelectMarker={setSelectedMarkerId}
              onClosePopup={(markerId) =>
                setSelectedMarkerId((current) => (current === markerId ? null : current))
              }
              localidad={localidad}
              isDesktop={isDesktop}
              onViewMore={openCommunity}
              onViewProducts={openProducts}
              panelRef={filtersPanelRef}
            />

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
                <p className="text-sm text-texto-suave">
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
            <CommunityMapCard
              community={selectedCommunity}
              onViewMore={() => openCommunity(selectedCommunity.id)}
              onViewProducts={() => openProducts(selectedCommunity.id)}
            />
          </div>
        ) : null}
      </div>

      <CommunityModal
        community={modalCommunity}
        products={products.filter((p) => p.communityId === modalCommunity?.id)}
        events={calendarEvents.filter((e) => e.communityId === modalCommunity?.id)}
        isOpen={Boolean(modalCommunity)}
        initialSection={modalState?.section}
        onClose={() => setModalState(null)}
      />
    </section>
  );
}
