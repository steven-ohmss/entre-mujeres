"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HERO_VIDEO_POSTER,
  HERO_VIDEO_POSTER_ALT,
  HERO_VIDEO_URL,
  esPendiente,
} from "@/config/site";
import { useMediaQuery } from "@/lib/useMediaQuery";

const SIDE_WORDS = ["BOGOTÁ", "CUNDINAMARCA", "MUJERES", "TERRITORIO", "OPORTUNIDADES"];

/**
 * Inicio con video de fondo (4.3).
 *
 * El video es un adorno, no contenido: si no hay archivo, si la persona pidió reducir
 * movimiento o si está en una conexión lenta, queda la foto y la pantalla se ve igual de
 * completa. Por eso el poster no es un respaldo de emergencia sino la base sobre la que
 * el video se monta cuando se puede.
 */
export default function Hero() {
  const prefiereMenosMovimiento = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [conexionLenta, setConexionLenta] = useState(false);

  useEffect(() => {
    // navigator.connection no existe en todos los navegadores; si no está, se asume buena.
    const conexion = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (!conexion) return;
    const lenta =
      Boolean(conexion.saveData) || /(^|-)2g$/.test(conexion.effectiveType ?? "");
    setConexionLenta(lenta);
  }, []);

  const hayVideo =
    !esPendiente(HERO_VIDEO_URL) && !prefiereMenosMovimiento && !conexionLenta;

  return (
    <section id="inicio" className="relative overflow-hidden bg-verde-bosque-oscuro">
      <div className="relative min-h-[640px] w-full sm:min-h-[620px]">
        <div className="absolute inset-0">
          {hayVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={HERO_VIDEO_POSTER}
              aria-hidden="true"
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
              <span className="eyebrow text-rosa-claro">Mujeres que transforman territorios</span>

              <h1 className="mt-4 font-titulos text-4xl font-semibold leading-tight text-blanco sm:text-5xl">
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
      </div>
    </section>
  );
}
