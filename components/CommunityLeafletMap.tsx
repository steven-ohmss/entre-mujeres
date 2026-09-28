"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import CommunityMapCard from "./CommunityMapCard";
import {
  LOCALIDADES_GEOJSON_URL,
  LOCALIDAD_BORDE,
  LOCALIDAD_BORDE_SELECCIONADA,
  LOCALIDAD_TONOS,
  MAP_CENTER,
  MAP_MAX_BOUNDS,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
  MAP_ZOOM,
} from "@/lib/mapConfig";
import type { Community, Localidad, MapMarker } from "@/types";

interface LocalidadProps {
  nombre: string;
  codigo: string;
  tono: 0 | 1 | 2;
  etiqueta: [number, number];
  zoomEtiqueta: number;
}

type LocalidadesData = FeatureCollection<Geometry, LocalidadProps>;

export interface MapMarkerWithCommunity {
  marker: MapMarker;
  community: Community;
}

interface CommunityLeafletMapProps {
  markers: MapMarkerWithCommunity[];
  selectedMarkerId: string | null;
  onSelectMarker: (markerId: string) => void;
  onClosePopup: (markerId: string) => void;
  localidad: Localidad | "Todas";
  isDesktop: boolean;
  onViewMore: (communityId: string) => void;
  onViewProducts: (communityId: string) => void;
}

// Espacio que ocupa el panel de filtros flotante (24px de margen + 310px de ancho + 24px).
const PANEL_PADDING: [number, number] = [358, 24];

const dotIcon = L.divIcon({
  className: "map-marker",
  html: '<span class="map-marker__dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const pinIcon = L.divIcon({
  className: "map-marker map-marker--selected",
  html: '<svg viewBox="0 0 34 44" width="34" height="44" aria-hidden="true"><path d="M17 1.5C8.4 1.5 1.5 8.3 1.5 16.8 1.5 28 17 42.5 17 42.5S32.5 28 32.5 16.8C32.5 8.3 25.6 1.5 17 1.5Z" fill="#FFE600" stroke="#1e231e" stroke-width="2.5"/><circle cx="17" cy="16.5" r="5.5" fill="#1e231e"/></svg>',
  iconSize: [34, 44],
  iconAnchor: [17, 43],
});

function CommunityMarker({
  item,
  isSelected,
  onSelect,
}: {
  item: MapMarkerWithCommunity;
  isSelected: boolean;
  onSelect: (markerId: string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const { marker, community } = item;

  // Leaflet recrea el elemento del ícono al cambiarlo, por eso se reaplican los atributos.
  useEffect(() => {
    const element = markerRef.current?.getElement();
    if (!element) return;
    element.setAttribute("aria-label", community.name);
    element.setAttribute("aria-pressed", String(isSelected));
  }, [community.name, isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[marker.lat, marker.lng]}
      icon={isSelected ? pinIcon : dotIcon}
      title={community.name}
      keyboard
      zIndexOffset={isSelected ? 2000 : 1000}
      eventHandlers={{
        click: () => onSelect(marker.id),
        keydown: (event: L.LeafletKeyboardEvent) => {
          const { key } = event.originalEvent;
          if (key === "Enter" || key === " ") {
            event.originalEvent.preventDefault();
            onSelect(marker.id);
          }
        },
      }}
    />
  );
}

function SelectedPopup({
  item,
  onClose,
  onViewMore,
  onViewProducts,
}: {
  item: MapMarkerWithCommunity;
  onClose: (markerId: string) => void;
  onViewMore: (communityId: string) => void;
  onViewProducts: (communityId: string) => void;
}) {
  const popupRef = useRef<L.Popup>(null);
  const { marker, community } = item;
  const position = useMemo<L.LatLngTuple>(() => [marker.lat, marker.lng], [marker.lat, marker.lng]);

  return (
    <Popup
      ref={popupRef}
      position={position}
      offset={[0, -38]}
      className="community-popup"
      minWidth={280}
      maxWidth={280}
      autoPanPaddingTopLeft={PANEL_PADDING}
      autoPanPaddingBottomRight={[24, 48]}
      closeOnClick={false}
      eventHandlers={{ remove: () => onClose(marker.id) }}
    >
      <PopupContent popupRef={popupRef}>
        <CommunityMapCard
          community={community}
          variant="popup"
          onViewMore={() => onViewMore(community.id)}
          onViewProducts={() => onViewProducts(community.id)}
        />
      </PopupContent>
    </Popup>
  );
}

// El contenido del popup se monta después de que Leaflet lo abre, así que al montarse se
// recalcula su tamaño y se vuelve a ajustar el encuadre para que no quede cortado.
function PopupContent({
  popupRef,
  children,
}: {
  popupRef: React.RefObject<L.Popup | null>;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // _adjustPan y _autopanning son internos de Leaflet 1.9: es la misma rutina de autoPan
    // que Leaflet corre al abrir el popup, repetida ahora que el contenido ya tiene tamaño.
    const popup = popupRef.current as
      | (L.Popup & { _adjustPan?: () => void; _autopanning?: boolean })
      | null;
    if (!popup) return;
    const frame = requestAnimationFrame(() => {
      popup.update();
      popup._autopanning = false;
      popup._adjustPan?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [popupRef]);

  return <>{children}</>;
}

function MapBehavior({
  isDesktop,
  onMapClick,
}: {
  isDesktop: boolean;
  onMapClick: () => void;
}) {
  const map = useMap();
  // Clic en una zona vacía del mapa (no en un marcador) cierra la ficha.
  useMapEvents({ click: onMapClick });

  // En pantallas pequeñas el mapa no atrapa el scroll: se mueve con dos dedos o con los botones.
  useEffect(() => {
    if (isDesktop) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    }
    map.invalidateSize();
  }, [isDesktop, map]);

  return null;
}

function LocalidadLabels({ data }: { data: LocalidadesData }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  const labels = useMemo(
    () =>
      data.features.map(({ properties }) => ({
        ...properties,
        icon: L.divIcon({
          className: "localidad-label",
          html: `<span class="localidad-label__text localidad-label__text--${
            properties.tono === 2 ? "rosa" : "blanco"
          }">${properties.nombre}</span>`,
          iconSize: [0, 0],
        }),
      })),
    [data]
  );

  return (
    <>
      {labels
        .filter((label) => zoom >= label.zoomEtiqueta)
        .map((label) => (
          <Marker
            key={label.codigo}
            position={label.etiqueta}
            icon={label.icon}
            interactive={false}
            keyboard={false}
            zIndexOffset={-1000}
          />
        ))}
    </>
  );
}

function Localidades({
  data,
  localidad,
  isDesktop,
}: {
  data: LocalidadesData;
  localidad: Localidad | "Todas";
  isDesktop: boolean;
}) {
  const map = useMap();
  const geoRef = useRef<L.GeoJSON>(null);
  const localidadRef = useRef(localidad);
  const previousLocalidad = useRef(localidad);

  const style = useCallback((feature?: Feature<Geometry, LocalidadProps>): L.PathOptions => {
    const selected = localidadRef.current;
    const isSelected = feature?.properties.nombre === selected;
    const someSelected = selected !== "Todas";
    return {
      fillColor: LOCALIDAD_TONOS[feature?.properties.tono ?? 0],
      fillOpacity: isSelected ? 0.9 : someSelected ? 0.5 : 0.75,
      color: isSelected ? LOCALIDAD_BORDE_SELECCIONADA : LOCALIDAD_BORDE,
      weight: isSelected ? 3 : 1,
    };
  }, []);

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, LocalidadProps>, layer: L.Layer) => {
      const path = layer as L.Path;
      path.on({
        mouseover: () => path.setStyle({ weight: 3 }),
        mouseout: () => geoRef.current?.resetStyle(path),
      });
    },
    []
  );

  useEffect(() => {
    localidadRef.current = localidad;
    const geo = geoRef.current;
    if (!geo) return;
    geo.setStyle(style as L.StyleFunction);

    if (localidad !== "Todas") {
      const layer = geo
        .getLayers()
        .find(
          (l) => (l as L.Polygon).feature?.properties?.nombre === localidad
        ) as L.Polygon | undefined;
      if (layer) {
        layer.bringToFront();
        map.fitBounds(layer.getBounds(), {
          paddingTopLeft: isDesktop ? PANEL_PADDING : [16, 16],
          paddingBottomRight: [24, 24],
        });
      }
    } else if (previousLocalidad.current !== "Todas") {
      map.setView(MAP_CENTER, MAP_ZOOM);
    }
    previousLocalidad.current = localidad;
  }, [localidad, isDesktop, map, style]);

  return (
    <GeoJSON
      ref={geoRef}
      data={data}
      style={style as L.StyleFunction}
      onEachFeature={onEachFeature as (feature: Feature, layer: L.Layer) => void}
    />
  );
}

export default function CommunityLeafletMap({
  markers,
  selectedMarkerId,
  onSelectMarker,
  onClosePopup,
  localidad,
  isDesktop,
  onViewMore,
  onViewProducts,
}: CommunityLeafletMapProps) {
  const [localidades, setLocalidades] = useState<LocalidadesData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(LOCALIDADES_GEOJSON_URL)
      .then((response) => response.json())
      .then((data: LocalidadesData) => {
        if (!cancelled) setLocalidades(data);
      })
      .catch(() => {
        // Si no carga la capa, el mapa sigue funcionando con los marcadores.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = markers.find((item) => item.marker.id === selectedMarkerId);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      maxZoom={MAP_MAX_ZOOM}
      maxBounds={MAP_MAX_BOUNDS}
      maxBoundsViscosity={0.8}
      zoomControl={false}
      dragging={isDesktop}
      scrollWheelZoom={isDesktop}
      touchZoom
      className="h-full w-full"
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} />
      <ZoomControl position="topright" />
      <MapBehavior
        isDesktop={isDesktop}
        onMapClick={() => {
          if (isDesktop && selectedMarkerId) onClosePopup(selectedMarkerId);
        }}
      />

      {localidades ? (
        <>
          <Localidades data={localidades} localidad={localidad} isDesktop={isDesktop} />
          <LocalidadLabels data={localidades} />
        </>
      ) : null}

      {markers.map((item) => (
        <CommunityMarker
          key={item.marker.id}
          item={item}
          isSelected={item.marker.id === selectedMarkerId}
          onSelect={onSelectMarker}
        />
      ))}

      {isDesktop && selected ? (
        <SelectedPopup
          key={selected.marker.id}
          item={selected}
          onClose={onClosePopup}
          onViewMore={onViewMore}
          onViewProducts={onViewProducts}
        />
      ) : null}
    </MapContainer>
  );
}
