import Link from "next/link";
import { MapPin } from "lucide-react";
import Foto from "./Foto";
import { ICONO_PRODUCTO } from "@/lib/categorias";
import type { Product, Community } from "@/types";

interface ProductCardProps {
  product: Product;
  community: Community | undefined;
}

/**
 * Tarjeta de producto. Toda la tarjeta es el enlace a su página: el objetivo es llegar al
 * producto en el menor número de toques, no tener que apuntarle a un botón pequeño.
 */
export default function ProductCard({ product, community }: ProductCardProps) {
  return (
    <article className="card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/productos/${product.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa"
      >
        <div className="relative h-48 w-full bg-rosa-palido">
          <Foto
            src={product.images[0]}
            alt={`Foto del producto ${product.name}`}
            icon={ICONO_PRODUCTO[product.type]}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="pill-tag w-fit bg-verde-hoja/15 text-verde-bosque">{product.type}</span>

          <h3 className="font-titulos text-xl font-semibold text-texto">{product.name}</h3>

          {community ? (
            <>
              <p className="text-base font-medium text-texto">{community.name}</p>
              <p className="flex items-center gap-1.5 text-base text-texto-suave">
                <MapPin size={17} className="shrink-0" aria-hidden="true" />
                {community.ubicacion}
              </p>
            </>
          ) : null}

          <span className="mt-auto pt-3 text-base font-semibold text-rosa-oscuro">
            Ver el producto →
          </span>
        </div>
      </Link>
    </article>
  );
}
