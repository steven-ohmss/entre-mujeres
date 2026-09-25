import Image from "next/image";
import { formatEventDate } from "@/lib/date";
import type { NewsItem } from "@/types";

interface NewsCardProps {
  item: NewsItem;
  onOpen: () => void;
}

export default function NewsCard({ item, onOpen }: NewsCardProps) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full bg-rosa-palido">
        <Image
          src={item.image}
          alt={`Imagen de ${item.title}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="pill-tag w-fit bg-verde-hoja/15 text-verde-bosque">{item.type}</span>
        <h3 className="font-serif text-xl text-texto">{item.title}</h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-texto-suave">
          {formatEventDate(item.date)}
        </p>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-texto-suave">
          {item.summary}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-2 self-start text-sm font-semibold text-rosa transition hover:text-rosa-oscuro"
        >
          Leer más →
        </button>
      </div>
    </article>
  );
}
