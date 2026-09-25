import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { getDateBlockParts } from "@/lib/date";
import { eventTypes } from "@/data/data";
import type { CalendarEvent } from "@/types";

interface EventCardProps {
  event: CalendarEvent;
  onOpen: () => void;
}

export default function EventCard({ event, onOpen }: EventCardProps) {
  const dateParts = getDateBlockParts(event.date);
  const typeInfo = eventTypes.find((t) => t.value === event.type);

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-40 w-full bg-rosa-palido">
        <Image
          src={event.image}
          alt={`Foto del evento ${event.title}`}
          fill
          className="object-cover"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute left-3 top-3 flex w-14 flex-col items-center rounded-xl bg-blanco px-2 py-1.5 shadow-md">
          <span className="text-[10px] font-bold uppercase text-texto-suave">
            {dateParts.dayAbbrev}
          </span>
          <span className="font-serif text-xl leading-none text-texto">{dateParts.dayNumber}</span>
          <span className="text-[10px] font-bold uppercase text-texto-suave">
            {dateParts.monthAbbrev}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {typeInfo ? (
          <span
            className="pill-tag w-fit"
            style={{ backgroundColor: `${typeInfo.color}26`, color: typeInfo.color }}
          >
            {event.type}
          </span>
        ) : null}
        <h4 className="font-serif text-lg text-texto">{event.title}</h4>
        <p className="flex items-center gap-1.5 text-sm text-texto-suave">
          <MapPin size={14} className="shrink-0" aria-hidden="true" />
          {event.location}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-texto-suave">
          <Clock size={14} className="shrink-0" aria-hidden="true" />
          {event.startTime} – {event.endTime}
        </p>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-texto-suave">
          {event.description}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 self-start text-sm font-semibold text-rosa transition hover:text-rosa-oscuro"
        >
          Ver más →
        </button>
      </div>
    </article>
  );
}
