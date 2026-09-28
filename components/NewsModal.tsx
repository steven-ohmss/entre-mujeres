"use client";

import Image from "next/image";
import Modal from "./Modal";
import { formatEventDate } from "@/lib/date";
import type { NewsItem } from "@/types";

interface NewsModalProps {
  item: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsModal({ item, isOpen, onClose }: NewsModalProps) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={item.title}>
      <div className="relative -mx-6 -mt-6 h-48 w-[calc(100%+3rem)] bg-rosa-palido sm:-mx-8 sm:-mt-8 sm:h-56 sm:w-[calc(100%+4rem)]">
        <Image src={item.image} alt={`Imagen de ${item.title}`} fill className="object-cover" sizes="700px" />
      </div>

      <div className="mt-5">
        <span className="pill-tag bg-verde-hoja/15 text-verde-bosque">{item.type}</span>
        <h3 className="mt-3 font-titulos text-2xl text-texto sm:text-3xl">{item.title}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-texto-suave">
          {formatEventDate(item.date)}
        </p>
      </div>

      <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-texto">{item.fullText}</p>
    </Modal>
  );
}
