"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, AtSign } from "lucide-react";
import Modal from "./Modal";
import type { Product, Community } from "@/types";

interface ProductModalProps {
  product: Product | null;
  community: Community | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, community, isOpen, onClose }: ProductModalProps) {
  const [showContact, setShowContact] = useState(false);

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={`Información de ${product.name}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {product.images.map((image, index) => (
          <div
            key={image + index}
            className="relative h-40 overflow-hidden rounded-xl bg-rosa-palido sm:h-48"
          >
            <Image
              src={image}
              alt={`Fotografía ${index + 1} de ${product.name}`}
              fill
              className="object-cover"
              sizes="350px"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <span className="pill-tag bg-verde-hoja/15 text-verde-bosque">{product.type}</span>
        <h3 className="mt-3 font-titulos text-2xl text-texto sm:text-3xl">{product.name}</h3>
      </div>

      <div className="mt-5 space-y-4">
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">Descripción</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-texto">{product.description}</p>
        </section>

        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">Presentación</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-texto">{product.presentation}</p>
        </section>

        {community ? (
          <section>
            <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">
              Quién lo produce
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-texto">
              {community.name} · {community.ubicacion}
            </p>
          </section>
        ) : null}
      </div>

      {community ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowContact((v) => !v)}
            className="btn-primary w-full sm:w-auto"
          >
            Contactar a la productora
          </button>

          {showContact ? (
            <ul className="mt-4 space-y-1.5 rounded-xl bg-crema p-4 text-sm text-texto">
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-texto-suave" aria-hidden="true" />
                {community.contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-texto-suave" aria-hidden="true" />
                {community.contact.email}
              </li>
              <li className="flex items-center gap-2">
                <AtSign size={15} className="text-texto-suave" aria-hidden="true" />
                {community.contact.social}
              </li>
            </ul>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
