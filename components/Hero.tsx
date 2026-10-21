"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import {
  HERO_VIDEO_POSTER,
  HERO_VIDEO_POSTER_ALT,
  HERO_VIDEO_URL,
  esPendiente,
} from "@/config/site";

const SIDE_WORDS = ["BOGOTÁ", "CUNDINAMARCA", "MUJERES", "TERRITORIO", "OPORTUNIDADES"];

/** La calidad de la conexión no cambia a mitad de visita: no hay a qué suscribirse. */
const sinSuscripcion = () => () => {};

/** navigator.connection no existe en todos los navegadores; si no está, se asume buena. */
function conexionEsLenta(): boolean {
  const conexion = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (!conexion) return false;
  return Boolean(conexion.saveData) || /(^|-)2g$/.test(conexion.effectiveType ?? "");
}

const conexionBuenaAlGenerar = () => false;

/**
 * Inicio con video de fondo (4.3).
 *
 * El video es un adorno, no contenido: si no hay archivo o si la persona está en una
 * conexión lenta o con ahorro de datos, queda la foto y la pantalla se ve igual de
 * completa. Por eso el poster no es un respaldo de emergencia sino la base sobre la que
 * el video se monta cuando se puede.
 *
 * Decisión del equipo: el video arranca para todo el mundo, también para quien tiene
 * activado "reducir movimiento" en su sistema. A cambio, el botón de la esquina permite
 * detenerlo en cualquier momento, que es lo que le devuelve el control a quien el
 * movimiento le molesta.
 */
export default function Hero() {
  const conexionLenta = useSyncExternalStore(
    sinSuscripcion,
    conexionEsLenta,
    conexionBuenaAlGenerar
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  // Arranca en true porque el video lleva autoPlay. Si el navegador lo bloquea, el
  // evento onPause corrige el estado y el botón pasa a decir "Reproducir video".
  const [reproduciendo, setReproduciendo] = useState(true);

  const hayVideo = !esPendiente(HERO_VIDEO_URL) && !conexionLenta;

  const alternarVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  return (
    <section id="inicio" className="relative overflow-hidden bg-verde-bosque-oscuro">
      <div className="relative min-h-[640px] w-full sm:min-h-[620px]">
        <div className="absolute inset-0">
          {hayVideo ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_VIDEO_POSTER}
              aria-hidden="true"
              onPlay={() => setReproduciendo(true)}
              onPause={() => setReproduciendo(false)}
              className="h-full w-full object-cover"
            >
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={HERO_VIDEO_POSTER}
              alt={HERO_VIDEO_POSTER_ALT}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
        </div>

        {/* Capa oscura: el texto va encima del video y tiene que leerse sin depender de
            qué fotograma esté pasando. */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-texto/75 via-texto/55 to-texto/70"
          aria-hidden="true"
        />

        {/* pt-[72px] despeja la barra fija. */}
        <div className="relative z-10 flex min-h-[640px] flex-col justify-center pt-[72px] sm:min-h-[620px]">
          <div className="container-page py-16 sm:py-20">
            <div className="max-w-3xl">
              <h1 className="font-titulos text-4xl font-semibold leading-tight text-blanco sm:text-5xl">
                Conectamos el trabajo de las mujeres de Bogotá y Cundinamarca
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-blanco/90">
                Conoce sus productos, sus comunidades y sus ferias.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/productos" className="btn-primary bg-rosa hover:bg-rosa-oscuro">
                  Ver los productos
                </Link>
                <a href="#mapa" className="btn-secondary btn-secondary--claro">
                  Ver el mapa
                </a>
              </div>
            </div>
          </div>
        </div>

        <p
          className="script-text absolute right-6 top-24 hidden max-w-[220px] text-right text-blanco drop-shadow-sm sm:right-10 sm:top-28 md:block"
          aria-hidden="true"
        >
          Del territorio nacen grandes historias
        </p>

        <ul
          className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col gap-3 text-right text-xs font-semibold tracking-widest text-blanco lg:flex"
          aria-hidden="true"
        >
          {SIDE_WORDS.map((word) => (
            <li key={word} className="flex items-center justify-end gap-2">
              {word}
              <span className="h-1.5 w-1.5 rounded-full bg-rosa-claro" />
            </li>
          ))}
        </ul>

        {/* Control del video. Discreto, pero con el área táctil de 48 px que pide la guía
            y fondo sólido: encima de un video que cambia de fotograma, un botón
            translúcido se pierde contra los fotogramas claros. */}
        {hayVideo ? (
          <button
            type="button"
            onClick={alternarVideo}
            aria-label={reproduciendo ? "Pausar video" : "Reproducir video"}
            title={reproduciendo ? "Pausar video" : "Reproducir video"}
            className="absolute bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-verde-bosque/15 bg-crema/90 text-verde-bosque shadow-md transition hover:bg-blanco focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-claro sm:bottom-6 sm:right-6"
          >
            {reproduciendo ? (
              <Pause size={20} aria-hidden="true" />
            ) : (
              <Play size={20} aria-hidden="true" className="ml-0.5" />
            )}
          </button>
        ) : null}
      </div>
    </section>
  );
}
