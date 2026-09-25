"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import MapFilters from "./MapFilters";
import CommunityMapCard from "./CommunityMapCard";
import CommunityModal from "./CommunityModal";
import { communities, products, calendarEvents, mapMarkers, MAP_IMAGE } from "@/data/data";
import type { CommunityCategory, ProductType, Localidad } from "@/types";

export default function InteractiveMap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "Todas">("Todas");
  const [productType, setProductType] = useState<ProductType | "Todas">("Todas");
  const [localidad, setLocalidad] = useState<Localidad | "Todas">("Todas");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(
    mapMarkers[0]?.id ?? null
  );
  const [modalState, setModalState] = useState<{
    communityId: string;
    section: "info" | "productos";
  } | null>(null);

  const filteredMarkers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return mapMarkers.filter((marker) => {
      const community = communities.find((c) => c.id === marker.communityId);
      if (!community) return false;

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

  const effectiveSelectedId = filteredMarkers.some((marker) => marker.id === selectedMarkerId)
    ? selectedMarkerId
    : filteredMarkers[0]?.id ?? null;

  const selectedMarker = mapMarkers.find((marker) => marker.id === effectiveSelectedId);
  const selectedCommunity = selectedMarker
    ? communities.find((c) => c.id === selectedMarker.communityId)
    : undefined;

  const modalCommunity = modalState
    ? communities.find((c) => c.id === modalState.communityId) ?? null
    : null;

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("Todas");
    setProductType("Todas");
    setLocalidad("Todas");
  };

  return (
    <section id="mapa" className="bg-blanco py-20 sm:py-24">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_2.3fr]">
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
          />

          <div>
            <div className="mb-4">
              <h3 className="font-sans text-2xl font-extrabold uppercase tracking-tight text-texto">
                Comunidades de mujeres
              </h3>
              <p className="text-sm font-semibold uppercase tracking-widest text-texto-suave">
                Cundinamarca – Bogotá
              </p>
            </div>

            <div className="relative">
              <div
                className="relative w-full overflow-hidden rounded-2xl bg-rosa-palido/40"
                style={{ aspectRatio: `${MAP_IMAGE.width} / ${MAP_IMAGE.height}` }}
              >
                <Image
                  src="/images/mapa-cundinamarca.jpg"
                  alt="Mapa de Bogotá y Cundinamarca con las localidades de la ciudad resaltadas en tonos rosa"
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />

                {filteredMarkers.map((marker) => {
                  const community = communities.find((c) => c.id === marker.communityId);
                  if (!community) return null;
                  const isSelected = marker.id === effectiveSelectedId;

                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => setSelectedMarkerId(marker.id)}
                      aria-label={community.name}
                      aria-pressed={isSelected}
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blanco bg-amarillo shadow transition-all ${
                        isSelected ? "z-10 h-6 w-6 ring-2 ring-verde-bosque" : "h-3.5 w-3.5"
                      }`}
                    />
                  );
                })}
              </div>

              {filteredMarkers.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-texto/20 p-8 text-center">
                  <p className="text-sm text-texto-suave">
                    No encontramos iniciativas con esos filtros
                  </p>
                  <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
                    Limpiar filtros
                  </button>
                </div>
              ) : null}

              <div className="mt-4 flex items-center gap-5 text-sm text-texto">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-rosa" aria-hidden="true" />
                  Bogotá
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-verde-hoja" aria-hidden="true" />
                  Cundinamarca
                </span>
              </div>

              {selectedCommunity ? (
                <div className="mt-6 lg:absolute lg:left-4 lg:top-4 lg:z-20 lg:mt-0">
                  <CommunityMapCard
                    community={selectedCommunity}
                    onViewMore={() =>
                      setModalState({ communityId: selectedCommunity.id, section: "info" })
                    }
                    onViewProducts={() =>
                      setModalState({ communityId: selectedCommunity.id, section: "productos" })
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
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
