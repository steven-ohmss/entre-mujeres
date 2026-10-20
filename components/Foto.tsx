import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ImageOff } from "lucide-react";

interface FotoProps {
  /** Ruta de la foto. Vacío o ausente muestra el placeholder "Foto próximamente". */
  src?: string | null;
  /** Debe describir la foto real, no repetir el nombre del producto. */
  alt: string;
  /** Icono de la categoría, para que el placeholder diga de qué se trata. */
  icon?: LucideIcon;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Foto de un producto o una comunidad.
 *
 * Mientras el equipo recopila las fotos reales, en vez de dejar un hueco (o peor, una foto
 * de otro producto) se muestra una tarjeta neutra con el icono de la categoría y el texto
 * "Foto próximamente" (4.4.6). Para publicar la foto real basta con llenar el dato: este
 * componente no hay que tocarlo.
 */
export default function Foto({
  src,
  alt,
  icon: Icon = ImageOff,
  sizes,
  priority = false,
  className = "object-cover",
}: FotoProps) {
  const tieneFoto = typeof src === "string" && src.trim().length > 0;

  if (!tieneFoto) {
    return (
      <div
        role="img"
        aria-label={`${alt}. Foto próximamente.`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-crema text-texto-suave"
      >
        <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">Foto próximamente</span>
      </div>
    );
  }

  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
  );
}
