import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Product, Community } from "@/types";

interface ProductCardProps {
  product: Product;
  community: Community | undefined;
  onOpen: () => void;
}

export default function ProductCard({ product, community, onOpen }: ProductCardProps) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-44 w-full bg-rosa-palido">
        <Image
          src={product.images[0]}
          alt={`Foto del producto ${product.name}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="pill-tag w-fit bg-verde-hoja/15 text-verde-bosque">{product.type}</span>
        <h3 className="font-titulos text-xl text-texto">{product.name}</h3>
        {community ? (
          <p className="text-sm font-medium text-texto">{community.name}</p>
        ) : null}
        {community ? (
          <p className="flex items-center gap-1.5 text-sm text-texto-suave">
            <MapPin size={14} className="shrink-0" aria-hidden="true" />
            {community.ubicacion}
          </p>
        ) : null}
        <p className="mt-1 line-clamp-2 flex-1 text-sm leading-relaxed text-texto-suave">
          {product.description}
        </p>
        <button type="button" onClick={onOpen} className="btn-secondary mt-3 self-start">
          Conocer producto
        </button>
      </div>
    </article>
  );
}
