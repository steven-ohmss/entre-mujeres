"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { clienteNavegador } from "@/lib/sesion-navegador";

export default function BotonCerrarSesion({
  className = "btn-secondary",
  etiqueta = "Cerrar sesión",
}: {
  className?: string;
  etiqueta?: string;
}) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  const salir = async () => {
    setSaliendo(true);
    await clienteNavegador().auth.signOut();
    // replace y no push: después de salir, el botón "atrás" no debe devolver al panel.
    router.replace("/");
    router.refresh();
  };

  return (
    <button type="button" onClick={salir} disabled={saliendo} className={className}>
      {saliendo ? (
        <Loader2 size={19} className="animate-spin" aria-hidden="true" />
      ) : (
        <LogOut size={19} aria-hidden="true" />
      )}
      {saliendo ? "Saliendo…" : etiqueta}
    </button>
  );
}
