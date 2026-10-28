"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

/**
 * El mensaje que confirma que algo se guardó o se eliminó.
 *
 * Se cierra solo a los ocho segundos, pero también tiene botón: quien usa lector de
 * pantalla o lee despacio no debería pelear contra un reloj.
 */
export default function Aviso({
  tipo = "bien",
  children,
}: {
  tipo?: "bien" | "mal";
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const esBien = tipo === "bien";
  const Icono = esBien ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      className={`mb-7 flex items-start gap-3 rounded-2xl p-4 text-base ${
        esBien ? "bg-verde-hoja/15 text-verde-bosque" : "bg-rosa-palido text-texto"
      }`}
    >
      <Icono size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{children}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Cerrar aviso"
        className="shrink-0 rounded-full p-1 transition hover:bg-blanco/50"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
