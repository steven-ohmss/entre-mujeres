import Image from "next/image";
import type { Community } from "@/types";

interface CommunityMapCardProps {
  community: Community;
  onViewMore: () => void;
  onViewProducts: () => void;
}

export default function CommunityMapCard({
  community,
  onViewMore,
  onViewProducts,
}: CommunityMapCardProps) {
  return (
    <div className="card w-full max-w-sm overflow-hidden shadow-lg">
      <div className="relative h-36 w-full bg-rosa-palido">
        <Image
          src={community.image}
          alt={`Foto de la comunidad ${community.name}`}
          fill
          className="object-cover"
          sizes="360px"
        />
      </div>
      <div className="p-5">
        <h4 className="font-titulos text-lg font-bold uppercase text-texto">{community.name}</h4>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-texto-suave">
          {community.ubicacion}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-texto-suave">
          {community.shortDescription}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={onViewMore}
            className="text-sm font-semibold text-rosa transition hover:text-rosa-oscuro"
          >
            ver más
          </button>
          <button
            type="button"
            onClick={onViewProducts}
            className="text-sm font-semibold text-rosa transition hover:text-rosa-oscuro"
          >
            productos
          </button>
        </div>
      </div>
    </div>
  );
}
