"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Newspaper } from "lucide-react";
import Foto from "./Foto";
import { calendarEvents, newsItems } from "@/data/data";
import { compareISODates, formatEventDate } from "@/lib/date";
import { useHoy } from "@/lib/hoy";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface Diapositiva {
  id: string;
  tipo: "evento" | "noticia";
  etiqueta: string;
  titulo: string;
  pie: string;
  imagen: string;
  href: string;
}

const MAXIMO = 6;
const MS_ENTRE_AVANCES = 6000;

function diapositivasDesde(hoy: string | null): Diapositiva[] {
  // Antes de montar no se conoce la fecha, así que se muestran los eventos en orden y el
  // filtro de "ya pasó" entra apenas el navegador la resuelve.
  const eventos = [...calendarEvents]
    .filter((evento) => (hoy ? compareISODates(evento.date, hoy) >= 0 : true))
    .sort((a, b) => compareISODates(a.date, b.date))
    .slice(0, 3)
    .map<Diapositiva>((evento) => ({
      id: `evento-${evento.id}`,
      tipo: "evento",
      etiqueta: evento.type,
      titulo: evento.title,
      pie: formatEventDate(evento.date),
      imagen: evento.image,
      href: "#calendario",
    }));

  const noticias = [...newsItems]
    .sort((a, b) => compareISODates(b.date, a.date))
    .slice(0, 3)
    .map<Diapositiva>((noticia) => ({
      id: `noticia-${noticia.id}`,
      tipo: "noticia",
      etiqueta: noticia.type,
      titulo: noticia.title,
      pie: formatEventDate(noticia.date),
      imagen: noticia.image,
      href: "#noticias",
    }));

  return [...eventos, ...noticias].slice(0, MAXIMO);
}

export default function CarruselInicio() {
  const hoy = useHoy();
  const prefiereMenosMovimiento = useMediaQuery("(prefers-reduced-motion: reduce)");
  const pistaRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  const diapositivas = diapositivasDesde(hoy);
  const total = diapositivas.length;

  const irA = useCallback((indice: number) => {
    const pista = pistaRef.current;
    if (!pista) return;
    const tarjeta = pista.children[indice] as HTMLElement | undefined;
    if (!tarjeta) return;
    pista.scrollTo({ left: tarjeta.offsetLeft - pista.offsetLeft, behavior: "smooth" });
  }, []);

  // El indicador sigue el desplazamiento real, así que también funciona al deslizar con
  // el dedo, no solo al tocar las flechas.
  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;

    const alDesplazar = () => {
      const hijos = Array.from(pista.children) as HTMLElement[];
      const centro = pista.scrollLeft + pista.clientWidth / 2;
      let masCerca = 0;
      let menorDistancia = Infinity;
      hijos.forEach((hijo, i) => {
        const centroHijo = hijo.offsetLeft - pista.offsetLeft + hijo.clientWidth / 2;
        const distancia = Math.abs(centroHijo - centro);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          masCerca = i;
        }
      });
      setActivo(masCerca);
    };

    pista.addEventListener("scroll", alDesplazar, { passive: true });
    return () => pista.removeEventListener("scroll", alDesplazar);
  }, [total]);

  // Avance automático, que se detiene al tocar o enfocar el carrusel y respeta a quien
  // pidió reducir movimiento.
  useEffect(() => {
    if (prefiereMenosMovimiento || pausado || total <= 1) return;
    const temporizador = setInterval(() => {
      setActivo((anterior) => {
        const siguiente = (anterior + 1) % total;
        irA(siguiente);
        return siguiente;
      });
    }, MS_ENTRE_AVANCES);
    return () => clearInterval(temporizador);
  }, [irA, pausado, prefiereMenosMovimiento, total]);

  if (total === 0) return null;

  return (
    <section
      aria-label="Próximos eventos y noticias recientes"
      aria-roledescription="carrusel"
      className="bg-crema pb-4 pt-12 sm:pt-16"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
      onTouchStart={() => setPausado(true)}
    >
      <div className="container-page">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-titulos text-2xl font-semibold text-texto sm:text-3xl">
            Lo que viene y lo que pasó
          </h2>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => irA(Math.max(0, activo - 1))}
              disabled={activo === 0}
              aria-label="Anterior"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-texto/20 text-texto transition hover:bg-blanco disabled:opacity-35"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => irA(Math.min(total - 1, activo + 1))}
              disabled={activo === total - 1}
              aria-label="Siguiente"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-texto/20 text-texto transition hover:bg-blanco disabled:opacity-35"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div
          ref={pistaRef}
          className="carrusel-pista flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3"
        >
          {diapositivas.map((slide, indice) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${indice + 1} de ${total}`}
              className="flex w-[86%] shrink-0 snap-center sm:w-[48%] lg:w-[32%]"
            >
            <a
              href={slide.href}
              aria-label={`${slide.etiqueta}: ${slide.titulo}`}
              className="group card flex w-full flex-col overflow-hidden transition hover:shadow-md"
            >
              <div className="relative h-48 w-full bg-rosa-palido">
                <Foto
                  src={slide.imagen}
                  alt={
                    slide.tipo === "evento"
                      ? `Fotografía del evento ${slide.titulo}`
                      : `Fotografía que acompaña la nota ${slide.titulo}`
                  }
                  icon={slide.tipo === "evento" ? CalendarDays : Newspaper}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 86vw"
                />
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <span
                  className={`pill-tag w-fit ${
                    slide.tipo === "evento"
                      ? "bg-verde-hoja/15 text-verde-bosque"
                      : "bg-rosa-palido text-rosa-oscuro"
                  }`}
                >
                  {slide.etiqueta}
                </span>
                <h3 className="font-titulos text-xl font-semibold leading-snug text-texto">
                  {slide.titulo}
                </h3>
                <p className="text-sm text-texto-suave">{slide.pie}</p>
                <span className="btn-secondary mt-3 self-start group-hover:bg-blanco">
                  {slide.tipo === "evento" ? "Ver el evento" : "Leer más"}
                </span>
              </div>
            </a>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2.5">
          {diapositivas.map((slide, indice) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => irA(indice)}
              aria-label={`Ir a la diapositiva ${indice + 1} de ${total}`}
              aria-current={indice === activo}
              className={`h-3 rounded-full transition-all ${
                indice === activo ? "w-8 bg-verde-bosque" : "w-3 bg-texto/25 hover:bg-texto/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
