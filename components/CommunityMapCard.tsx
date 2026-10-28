import Link from "next/link";
import Foto from "./Foto";
import { ICONO_COMUNIDAD } from "@/lib/categorias";
import { textoOProximamente } from "@/config/site";
import type { Community } from "@/types";

interface CommunityMapCardProps {
  community: Community;
  variant?: "card" | "popup";
}

/**
 * Ficha que se abre al tocar una comunidad en el mapa (4.5): foto, nombre, lo que hace y
 * el botón para ir a su página. Antes abría un modal encima del mapa; ahora lleva al
 * perfil, que es donde están sus productos y su WhatsApp.
 */
export default function CommunityMapCard({ community, variant = "card" }: CommunityMapCardProps) {
  return (
    <div
      className={
        variant === "popup"
          ? "w-[280px] overflow-hidden"
          : "card w-full max-w-sm overflow-hidden shadow-lg"
      }
    >
      <div className="relative h-36 w-full bg-rosa-palido">
        <Foto
          src={community.image}
          alt={`Foto de la comunidad ${community.name}`}
          icon={community.category ? ICONO_COMUNIDAD[community.category] : undefined}
          sizes={variant === "popup" ? "280px" : "360px"}
        />
      </div>

      <div className="p-5">
        <h4 className="font-titulos text-lg font-bold uppercase text-texto">{community.name}</h4>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-texto-suave">
          {community.ubicacion}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-texto-suave">
          {textoOProximamente(community.shortDescription)}
        </p>

        <Link
          href={`/comunidades/${community.slug}`}
          className="btn-primary mt-4 w-full text-base"
        >
          Ver comunidad
        </Link>
      </div>
    </div>
  );
}
