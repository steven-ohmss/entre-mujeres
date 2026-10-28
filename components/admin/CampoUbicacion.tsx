"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Trash2 } from "lucide-react";
import { coordenadaValida } from "@/lib/validacion";

const MapaPunto = dynamic(() => import("./MapaPunto"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-rosa-palido/40" />,
});

/**
 * Dónde queda la comunidad en el mapa.
 *
 * Dos caminos para lo mismo, porque llegan de dos maneras: tocar el mapa (lo natural si
 * sabes dónde es) o pegar las coordenadas (lo natural si alguien te las pasó por
 * WhatsApp desde Google Maps).
 *
 * Se valida que caiga dentro de Colombia. El error de verdad que esto caza es pegar la
 * coordenada al revés, poniendo la longitud donde va la latitud: pasa seguido y el punto
 * termina en mitad del océano sin que nadie lo note hasta ver el mapa publicado.
 */
export default function CampoUbicacion({
  latInicial,
  lngInicial,
  error,
}: {
  latInicial: number | null;
  lngInicial: number | null;
  error?: string;
}) {
  const [lat, setLat] = useState<number | null>(latInicial);
  const [lng, setLng] = useState<number | null>(lngInicial);

  const hayPunto = lat !== null && lng !== null;
  const fueraDeColombia = hayPunto && !coordenadaValida(lat, lng);

  const escribir = (cual: "lat" | "lng", valor: string) => {
    const t = valor.replace(",", ".").trim();
    const n = t === "" ? null : Number(t);
    const limpio = n !== null && Number.isFinite(n) ? n : null;
    if (cual === "lat") setLat(limpio);
    else setLng(limpio);
  };

  return (
    <div>
      <span className="field-label">Dónde queda en el mapa</span>

      <input type="hidden" name="lat" value={lat ?? ""} />
      <input type="hidden" name="lng" value={lng ?? ""} />

      <div className="mt-1 overflow-hidden rounded-3xl border border-texto/20 bg-blanco">
        <div className="h-72 w-full">
          <MapaPunto
            lat={lat}
            lng={lng}
            alElegir={(la, ln) => {
              setLat(la);
              setLng(ln);
            }}
          />
        </div>

        <div className="p-4">
          <p className="flex items-start gap-2 text-base leading-relaxed text-texto-suave">
            <MapPin size={19} className="mt-0.5 shrink-0" aria-hidden="true" />
            Toca el mapa donde queda la comunidad. Si ya tienes las coordenadas, pégalas
            abajo.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lat-visible" className="field-label">
                Latitud
              </label>
              <input
                id="lat-visible"
                inputMode="decimal"
                value={lat ?? ""}
                onChange={(e) => escribir("lat", e.target.value)}
                className="field-input"
                placeholder="4.3829212"
              />
            </div>
            <div>
              <label htmlFor="lng-visible" className="field-label">
                Longitud
              </label>
              <input
                id="lng-visible"
                inputMode="decimal"
                value={lng ?? ""}
                onChange={(e) => escribir("lng", e.target.value)}
                className="field-input"
                placeholder="-74.1659716"
              />
            </div>
          </div>

          {fueraDeColombia ? (
            <p className="field-error mt-3">
              Ese punto no cae dentro de Colombia. Revisa que no estén cambiadas: la
              latitud es el número pequeño y positivo, la longitud el negativo.
            </p>
          ) : null}

          {hayPunto ? (
            <button
              type="button"
              onClick={() => {
                setLat(null);
                setLng(null);
              }}
              className="btn-secondary mt-4"
            >
              <Trash2 size={18} aria-hidden="true" />
              Quitar el punto del mapa
            </button>
          ) : (
            <p className="mt-3 text-base text-texto-suave">
              Sin punto, la comunidad no aparece en el mapa del sitio, pero sí en todo lo
              demás.
            </p>
          )}

          {error ? <p className="field-error mt-3">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
