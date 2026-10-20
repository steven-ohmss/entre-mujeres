import { MessageCircle } from "lucide-react";
import { urlWhatsApp } from "@/config/site";

interface BotonWhatsAppProps {
  telefono: string;
  mensaje: string;
  etiqueta?: string;
  className?: string;
}

/**
 * Botón grande y verde para escribir por WhatsApp (4.4.4), con el mensaje ya escrito.
 *
 * Si la comunidad todavía no entregó su número, en vez de un botón que no lleva a nada se
 * muestra un aviso: así queda claro para el equipo qué falta, y la persona no se queda
 * esperando que pase algo al tocarlo.
 */
export default function BotonWhatsApp({
  telefono,
  mensaje,
  etiqueta = "Pregunta por WhatsApp",
  className = "",
}: BotonWhatsAppProps) {
  const url = urlWhatsApp(telefono, mensaje);

  if (!url) {
    return (
      <p
        className={`flex min-h-12 items-center gap-2 rounded-full border border-dashed border-texto/30 px-5 py-3 text-base text-texto-suave ${className}`}
      >
        <MessageCircle size={20} aria-hidden="true" />
        WhatsApp pendiente
      </p>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary bg-verde-hoja px-7 text-lg hover:bg-verde-bosque ${className}`}
    >
      <MessageCircle size={22} aria-hidden="true" />
      {etiqueta}
    </a>
  );
}
