import Image from "next/image";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { getDateBlockParts } from "@/lib/date";
import { eventTypes } from "@/data/data";
import type { CalendarEvent } from "@/types";

interface EventListRowProps {
  event: CalendarEvent;
  onOpen: () => void;
}

export default function EventListRow({ event, onOpen }: EventListRowProps) {
  const dateParts = getDateBlockParts(event.date);
  const typeInfo = eventTypes.find((t) => t.value === event.type);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-2xl border border-texto/10 bg-blanco p-3 text-left transition hover:border-verde-hoja/40 hover:bg-crema sm:p-4"
    >
      <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-crema px-2 py-1.5">
        <span className="text-[10px] font-bold uppercase text-texto-suave">
          {dateParts.dayAbbrev}
        </span>
        <span className="font-titulos text-lg leading-none text-texto">{dateParts.dayNumber}</span>
        <span className="text-[10px] font-bold uppercase text-texto-suave">
          {dateParts.monthAbbrev}
        </span>
      </div>

      <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-rosa-palido sm:block">
        <Image src={event.image} alt="" fill className="object-cover" sizes="64px" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h5 className="truncate font-titulos text-base text-texto sm:text-lg">{event.title}</h5>
          {typeInfo ? (
            <span
              className="pill-tag shrink-0"
              style={{ backgroundColor: `${typeInfo.color}26`, color: typeInfo.color }}
            >
              {event.type}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-texto-suave">
          <span className="flex items-center gap-1">
            <MapPin size={13} aria-hidden="true" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden="true" />
            {event.startTime} – {event.endTime}
          </span>
        </div>
        <p className="mt-1 hidden truncate text-sm text-texto-suave sm:block">{event.description}</p>
      </div>

      <ChevronRight size={20} className="shrink-0 text-texto-suave" aria-hidden="true" />
    </button>
  );
}
