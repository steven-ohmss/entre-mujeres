"use client";

import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import CommunityCard from "./CommunityCard";
import CommunityModal from "./CommunityModal";
import LeafDecoration from "./LeafDecoration";
import { communities, products, calendarEvents, communityCategories } from "@/data/data";
import type { CommunityCategory } from "@/types";

const INITIAL_COUNT = 4;

export default function CommunitySection() {
  const [activeCategory, setActiveCategory] = useState<CommunityCategory | "Todas">("Todas");
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "Todas") return communities;
    return communities.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const selectedCommunity = communities.find((c) => c.id === selectedId) ?? null;

  return (
    <section id="comunidades" className="relative overflow-hidden bg-crema py-20 sm:py-24">
      <LeafDecoration className="pointer-events-none absolute -top-6 right-4 h-20 w-20 rotate-45 opacity-70 sm:h-28 sm:w-28" />
      <div className="container-page">
        <SectionHeading
          title="Comunidades de mujeres"
          description="Descubre organizaciones, asociaciones y emprendimientos que hacen parte de la red."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {(["Todas", ...communityCategories] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setShowAll(false);
              }}
              data-active={activeCategory === category}
              className="pill-filter w-auto"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onOpen={() => setSelectedId(community.id)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-texto-suave">
            No hay comunidades registradas en esta categoría todavía.
          </p>
        ) : null}

        {!showAll && filtered.length > INITIAL_COUNT ? (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setShowAll(true)} className="btn-secondary">
              Ver todas las comunidades
            </button>
          </div>
        ) : null}
      </div>

      <CommunityModal
        community={selectedCommunity}
        products={products.filter((p) => p.communityId === selectedCommunity?.id)}
        events={calendarEvents.filter((e) => e.communityId === selectedCommunity?.id)}
        isOpen={Boolean(selectedCommunity)}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
