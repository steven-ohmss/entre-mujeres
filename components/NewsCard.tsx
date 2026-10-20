import { Newspaper } from "lucide-react";
import Foto from "./Foto";
import { formatEventDate } from "@/lib/date";
import type { NewsItem } from "@/types";

interface NewsCardProps {
  item: NewsItem;
  onOpen: () => void;
}

/**
 * Tarjeta de historia o noticia (4.10): foto, etiqueta, título, fecha y "Leer más". Se
 * mantiene como estaba; solo pasa a usar el placeholder compartido cuando falta la foto
 * y a cumplir el área táctil mínima.
 */
export default function NewsCard({ item, onOpen }: NewsCardProps) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full bg-rosa-palido">
        <Foto
          src={item.image}
          alt={`Fotografía que acompaña la nota ${item.title}`}
          icon={Newspaper}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="pill-tag w-fit bg-verde-hoja/15 text-verde-bosque">{item.type}</span>
        <h3 className="font-titulos text-xl font-semibold text-texto">{item.title}</h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-texto-suave">
          {formatEventDate(item.date)}
        </p>
        <p className="line-clamp-3 flex-1 text-base leading-relaxed text-texto-suave">
          {item.summary}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 flex min-h-12 items-center self-start text-base font-semibold text-rosa-oscuro transition hover:underline"
        >
          Leer más →
        </button>
      </div>
    </article>
  );
}
