import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Community } from "@/types";

interface CommunityCardProps {
  community: Community;
  onOpen: () => void;
}

export default function CommunityCard({ community, onOpen }: CommunityCardProps) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-44 w-full bg-rosa-palido">
        <Image
          src={community.image}
          alt={`Foto de la comunidad ${community.name}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="pill-tag w-fit bg-rosa-palido text-rosa-oscuro">{community.category}</span>
        <h3 className="font-serif text-xl text-texto">{community.name}</h3>
        <p className="flex items-center gap-1.5 text-sm text-texto-suave">
          <MapPin size={14} className="shrink-0" aria-hidden="true" />
          {community.ubicacion}
        </p>
        <p className="mt-1 line-clamp-3 flex-1 text-sm leading-relaxed text-texto-suave">
          {community.shortDescription}
        </p>
        <button type="button" onClick={onOpen} className="btn-secondary mt-3 self-start">
          Ver comunidad
        </button>
      </div>
    </article>
  );
}
