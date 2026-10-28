"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, LogIn, Mail } from "lucide-react";
import { clienteNavegador, mensajeDeError } from "@/lib/sesion-navegador";

/** Avisos que llegan desde /auth/confirm cuando el enlace del correo no sirvió. */
const AVISOS: Record<string, string> = {
  "enlace-invalido": "Ese enlace no es válido. Revisa que lo hayas copiado completo.",
  "enlace-vencido":
    "El enlace del correo ya venció o ya se usó. Pide uno nuevo con “¿Olvidaste tu contraseña?”.",
  "sin-sesion": "Para definir tu contraseña, abre el enlace que te llegó por correo.",
};

export default function FormularioIniciarSesion() {
  const router = useRouter();
  const parametros = useSearchParams();

  // A dónde iba antes de que le pidieran iniciar sesión.
  const volverCrudo = parametros.get("volver") ?? "/admin";
  const volver = volverCrudo.startsWith("/") ? volverCrudo : "/admin";

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(AVISOS[parametros.get("error") ?? ""] ?? null);
  const [enviando, setEnviando] = useState(false);

  // Modo "olvidé mi contraseña": el mismo formulario, pero solo pide el correo.
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const entrar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const { error: fallo } = await clienteNavegador().auth.signInWithPassword({
      email: correo.trim(),
      password: clave,
    });

    if (fallo) {
      setError(mensajeDeError(fallo));
      setEnviando(false);
      return;
    }

    // refresh() hace que el servidor vuelva a leer la cookie recién escrita; sin esto el
    // panel podría dibujarse todavía como si no hubiera sesión.
    router.replace(volver);
    router.refresh();
  };

  const recuperar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const { error: fallo } = await clienteNavegador().auth.resetPasswordForEmail(correo.trim());

    setEnviando(false);

    // Se confirma el envío pase lo que pase: decir "ese correo no existe" le permitiría
    // a cualquiera averiguar quién tiene cuenta.
    if (fallo && !/user not found/i.test(fallo.message ?? "")) {
      setError(mensajeDeError(fallo));
      return;
    }
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="text-center">
        <CheckCircle2
          size={46}
          strokeWidth={1.5}
          className="mx-auto text-verde-hoja"
          aria-hidden="true"
        />
        <p className="mt-4 text-lg leading-relaxed text-texto">
          Si <strong>{correo.trim()}</strong> tiene una cuenta, le acaba de llegar un correo
          con un enlace para crear una contraseña nueva.
        </p>
        <p className="mt-3 text-base text-texto-suave">
          Revisa también la carpeta de correo no deseado. El enlace sirve una sola vez.
        </p>
        <button
          type="button"
          onClick={() => {
            setEnviado(false);
            setModoRecuperar(false);
            setClave("");
          }}
          className="btn-secondary mt-7 w-full"
        >
          Volver a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={modoRecuperar ? recuperar : entrar} noValidate>
      {error ? (
        <p role="alert" className="mb-6 flex items-start gap-2.5 rounded-2xl bg-rosa-palido p-4 text-base text-texto">
          <AlertCircle size={21} className="mt-0.5 shrink-0 text-rosa-oscuro" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="correo" className="field-label">
          Correo electrónico
        </label>
        <input
          id="correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="field-input"
        />
      </div>

      {!modoRecuperar ? (
        <div className="mt-5">
          <label htmlFor="clave" className="field-label">
            Contraseña
          </label>
          <input
            id="clave"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="field-input"
          />
        </div>
      ) : null}

      <button type="submit" disabled={enviando} className="btn-primary mt-7 w-full disabled:opacity-60">
        {enviando ? (
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        ) : modoRecuperar ? (
          <Mail size={20} aria-hidden="true" />
        ) : (
          <LogIn size={20} aria-hidden="true" />
        )}
        {enviando
          ? "Un momento…"
          : modoRecuperar
            ? "Enviarme el enlace"
            : "Entrar"}
      </button>

      <button
        type="button"
        onClick={() => {
          setModoRecuperar((v) => !v);
          setError(null);
        }}
        className="mt-5 block min-h-12 w-full text-base font-semibold text-rosa-oscuro hover:underline"
      >
        {modoRecuperar ? "Volver a iniciar sesión" : "¿Olvidaste tu contraseña?"}
      </button>
    </form>
  );
}
