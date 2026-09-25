"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, AtSign, CalendarDays } from "lucide-react";
import Modal from "./Modal";
import type { Community, Product, CalendarEvent } from "@/types";
import { formatEventDate } from "@/lib/date";

interface CommunityModalProps {
  community: Community | null;
  products: Product[];
  events: CalendarEvent[];
  isOpen: boolean;
  onClose: () => void;
  initialSection?: "info" | "productos";
}

export default function CommunityModal({
  community,
  products,
  events,
  isOpen,
  onClose,
  initialSection = "info",
}: CommunityModalProps) {
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialSection === "productos") {
      const timer = setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialSection]);

  if (!community) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={`Información de ${community.name}`}>
      <div className="relative -mx-6 -mt-6 h-48 w-[calc(100%+3rem)] bg-rosa-palido sm:-mx-8 sm:-mt-8 sm:h-56 sm:w-[calc(100%+4rem)]">
        <Image
          src={community.image}
          alt={`Foto de la comunidad ${community.name}`}
          fill
          className="object-cover"
          sizes="700px"
        />
      </div>

      <div className="mt-5">
        <span className="pill-tag bg-rosa-palido text-rosa-oscuro">{community.category}</span>
        <h3 className="mt-3 font-serif text-2xl text-texto sm:text-3xl">{community.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-texto-suave">
          <MapPin size={14} aria-hidden="true" />
          {community.ubicacion}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">Quiénes somos</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-texto">{community.whoWeAre}</p>
        </section>

        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">Qué hacemos</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-texto">{community.whatWeDo}</p>
        </section>

        <section ref={productsRef}>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">Qué producimos</h4>
          {products.length > 0 ? (
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {products.map((product) => (
                <li key={product.id} className="rounded-xl border border-texto/10 p-3">
                  <p className="text-sm font-semibold text-texto">{product.name}</p>
                  <p className="text-xs text-texto-suave">{product.type}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm text-texto-suave">
              Todavía no hay productos registrados para esta comunidad.
            </p>
          )}
        </section>

        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">
            Próximas actividades
          </h4>
          {events.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start gap-3 rounded-xl border border-texto/10 p-3"
                >
                  <CalendarDays size={16} className="mt-0.5 shrink-0 text-verde-bosque" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold text-texto">{event.title}</span>
                    <span className="block text-xs text-texto-suave">
                      {formatEventDate(event.date)} · {event.location}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm text-texto-suave">
              Por ahora no hay actividades próximas registradas.
            </p>
          )}
        </section>

        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-verde-bosque">Cómo contactarlas</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-texto">
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
        </section>
      </div>
    </Modal>
  );
}
