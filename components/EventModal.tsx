"use client";

import Image from "next/image";
import { MapPin, Clock, Users2 } from "lucide-react";
import Modal from "./Modal";
import { formatEventDate } from "@/lib/date";
import { communities } from "@/data/data";
import type { CalendarEvent } from "@/types";

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  const community = communities.find((c) => c.id === event.communityId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={`Detalle del evento ${event.title}`}>
      <div className="relative -mx-6 -mt-6 h-44 w-[calc(100%+3rem)] bg-rosa-palido sm:-mx-8 sm:-mt-8 sm:h-52 sm:w-[calc(100%+4rem)]">
        <Image
          src={event.image}
          alt={`Foto del evento ${event.title}`}
          fill
          className="object-cover"
          sizes="700px"
        />
      </div>

      <div className="mt-5">
        <span className="pill-tag bg-rosa-palido text-rosa-oscuro">{event.type}</span>
        <h3 className="mt-3 font-titulos text-2xl text-texto sm:text-3xl">{event.title}</h3>
      </div>

      <ul className="mt-5 space-y-2.5 text-sm text-texto">
        <li className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-verde-bosque" aria-hidden="true" />
          {event.location}
        </li>
        <li className="flex items-center gap-2">
          <Clock size={16} className="shrink-0 text-verde-bosque" aria-hidden="true" />
          {formatEventDate(event.date)} · {event.startTime} – {event.endTime}
        </li>
        <li className="flex items-center gap-2">
          <Users2 size={16} className="shrink-0 text-verde-bosque" aria-hidden="true" />
          Organiza: {event.organizer}
          {community ? ` · ${community.name}` : ""}
        </li>
      </ul>

      <p className="mt-5 text-sm leading-relaxed text-texto">{event.description}</p>
    </Modal>
  );
}
