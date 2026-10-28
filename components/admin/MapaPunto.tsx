"use client";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MAP_TILE_ATTRIBUTION, MAP_TILE_URL } from "@/lib/mapConfig";

/**
 * El mapa donde se toca para poner el punto. Va en su propio archivo porque Leaflet solo
 * funciona en el navegador, así que el formulario lo carga con dynamic(ssr: false).
 */

// Leaflet busca sus iconos por una ruta relativa que no existe en el empaquetado, así
// que se dibuja el marcador a mano. Además así queda del color del sitio.
const ICONO = L.divIcon({
  className: "",
  html: `<span style="display:block;width:26px;height:26px;border-radius:50%;background:#FFE600;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function AlTocar({ alElegir }: { alElegir: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(evento) {
      alElegir(
        Number(evento.latlng.lat.toFixed(7)),
        Number(evento.latlng.lng.toFixed(7))
      );
    },
  });
  return null;
}

export default function MapaPunto({
  lat,
  lng,
  alElegir,
}: {
  lat: number | null;
  lng: number | null;
  alElegir: (lat: number, lng: number) => void;
}) {
  // Sin punto todavía, se encuadra Bogotá, que es donde está casi toda la red.
  const centro: [number, number] = lat !== null && lng !== null ? [lat, lng] : [4.45, -74.12];

  return (
    <MapContainer
      center={centro}
      zoom={lat !== null ? 14 : 10}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} />
      <AlTocar alElegir={alElegir} />
      {lat !== null && lng !== null ? <Marker position={[lat, lng]} icon={ICONO} /> : null}
    </MapContainer>
  );
}
