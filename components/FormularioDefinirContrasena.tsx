"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, KeyRound, Loader2 } from "lucide-react";
import { clienteNavegador, mensajeDeError } from "@/lib/sesion-navegador";

const MINIMO = 8;

export default function FormularioDefinirContrasena({ correo }: { correo: string }) {
  const router = useRouter();
  const [clave, setClave] = useState("");
  const [repetida, setRepetida] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const suficienteLarga = clave.length >= MINIMO;
  const coinciden = clave.length > 0 && clave === repetida;

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError(null);

    if (!suficienteLarga) {
      setError(`La contraseña debe tener al menos ${MINIMO} caracteres.`);
      return;
    }
    if (!coinciden) {
      setError("Las dos contraseñas no son iguales.");
      return;
    }

    setEnviando(true);
    const { error: fallo } = await clienteNavegador().auth.updateUser({ password: clave });

    if (fallo) {
      setError(mensajeDeError(fallo));
      setEnviando(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={guardar} noValidate>
      <p className="mb-6 rounded-2xl bg-crema p-4 text-base text-texto">
        Estás creando la contraseña de <strong className="break-words">{correo}</strong>.
      </p>

      {error ? (
        <p role="alert" className="mb-6 flex items-start gap-2.5 rounded-2xl bg-rosa-palido p-4 text-base text-texto">
          <AlertCircle size={21} className="mt-0.5 shrink-0 text-rosa-oscuro" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="clave" className="field-label">
          Tu contraseña nueva
        </label>
        <input
          id="clave"
          type="password"
          autoComplete="new-password"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="field-input"
          aria-describedby="requisito-largo"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="repetida" className="field-label">
          Escríbela otra vez
        </label>
        <input
          id="repetida"
          type="password"
          autoComplete="new-password"
          required
          value={repetida}
          onChange={(e) => setRepetida(e.target.value)}
          className="field-input"
        />
      </div>

      {/* Dos señales en vez de un error al final: así se sabe qué falta mientras se
          escribe, sin tener que enviar el formulario para enterarse. */}
      <ul className="mt-5 flex flex-col gap-2 text-base">
        <li
          id="requisito-largo"
          className={`flex items-center gap-2 ${suficienteLarga ? "text-verde-bosque" : "text-texto-suave"}`}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              suficienteLarga ? "bg-verde-hoja/25" : "bg-texto/10"
            }`}
          >
            {suficienteLarga ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : null}
          </span>
          Al menos {MINIMO} caracteres
        </li>
        <li className={`flex items-center gap-2 ${coinciden ? "text-verde-bosque" : "text-texto-suave"}`}>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              coinciden ? "bg-verde-hoja/25" : "bg-texto/10"
            }`}
          >
            {coinciden ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : null}
          </span>
          Las dos son iguales
        </li>
      </ul>

      <button
        type="submit"
        disabled={enviando || !suficienteLarga || !coinciden}
        className="btn-primary mt-7 w-full disabled:opacity-60"
      >
        {enviando ? (
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        ) : (
          <KeyRound size={20} aria-hidden="true" />
        )}
        {enviando ? "Guardando…" : "Guardar y entrar"}
      </button>
    </form>
  );
}
