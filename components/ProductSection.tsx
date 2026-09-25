"use client";

import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { products, communities, productTypes } from "@/data/data";
import type { ProductType } from "@/types";

export default function ProductSection() {
  const [activeType, setActiveType] = useState<ProductType | "Todos">("Todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeType === "Todos") return products;
    return products.filter((p) => p.type === activeType);
  }, [activeType]);

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;
  const selectedCommunity = communities.find((c) => c.id === selectedProduct?.communityId);

  return (
    <section id="productos" className="bg-blanco py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          title="Productos de la comunidad"
          description="Conoce lo que producen las mujeres de la red y contacta directamente a quienes lo hacen."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {(["Todos", ...productTypes] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              data-active={activeType === type}
              className="pill-filter w-auto"
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              community={communities.find((c) => c.id === product.communityId)}
              onOpen={() => setSelectedId(product.id)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-texto-suave">
            No hay productos registrados en esta categoría todavía.
          </p>
        ) : null}
      </div>

      <ProductModal
        product={selectedProduct}
        community={selectedCommunity}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
