"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import { newsItems } from "@/data/data";

export default function NewsSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = newsItems.find((item) => item.id === selectedId) ?? null;

  return (
    <section id="noticias" className="bg-crema py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading title="Historias y noticias" subtitle="Historias que inspiran" />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} onOpen={() => setSelectedId(item.id)} />
          ))}
        </div>
      </div>

      <NewsModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedId(null)}
      />
    </section>
  );
}
