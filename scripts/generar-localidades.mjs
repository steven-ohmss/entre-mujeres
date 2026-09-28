// Script de un solo uso: convierte la capa de localidades de Datos Abiertos Bogotá
// (conjunto "Localidad. Bogotá D.C.", licencia CC BY 4.0) a un GeoJSON liviano para el mapa.
//
// Fuente: https://datosabiertos.bogota.gov.co/dataset/856cb657-8ca3-4ee8-857f-37211173b1f8/resource/497b8756-0927-4aee-8da9-ca4e32ca3a8a/download/loca.json
// Descárgala en referencias/localidades-bogota-esri.json y ejecuta:
//   node scripts/generar-localidades.mjs
//
// El archivo de origen viene en formato Esri JSON con sistema MAGNA-SIRGAS (EPSG:4686),
// que para este uso coincide con WGS84 (lat/lng).

import { readFileSync, writeFileSync } from "node:fs";

const ORIGEN = "referencias/localidades-bogota-esri.json";
const DESTINO = "public/data/localidades-bogota.geojson";
const TOLERANCIA = 0.00005; // grados (~5 m) para simplificar
const DECIMALES = 5;

const NOMBRES = {
  USAQUEN: "Usaquén",
  CHAPINERO: "Chapinero",
  "SANTA FE": "Santa Fe",
  "SAN CRISTOBAL": "San Cristóbal",
  USME: "Usme",
  TUNJUELITO: "Tunjuelito",
  BOSA: "Bosa",
  KENNEDY: "Kennedy",
  FONTIBON: "Fontibón",
  ENGATIVA: "Engativá",
  SUBA: "Suba",
  "BARRIOS UNIDOS": "Barrios Unidos",
  TEUSAQUILLO: "Teusaquillo",
  "LOS MARTIRES": "Los Mártires",
  "ANTONIO NARIÑO": "Antonio Nariño",
  "PUENTE ARANDA": "Puente Aranda",
  CANDELARIA: "La Candelaria",
  "RAFAEL URIBE URIBE": "Rafael Uribe Uribe",
  "CIUDAD BOLIVAR": "Ciudad Bolívar",
  SUMAPAZ: "Sumapaz",
};

const areaFirmada = (anillo) => {
  let suma = 0;
  for (let i = 0; i < anillo.length - 1; i++) {
    suma += anillo[i][0] * anillo[i + 1][1] - anillo[i + 1][0] * anillo[i][1];
  }
  return suma / 2;
};

const puntoEnAnillo = ([x, y], anillo) => {
  let dentro = false;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    const [xi, yi] = anillo[i];
    const [xj, yj] = anillo[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
};

const distanciaASegmento = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax;
  const dy = by - ay;
  const largo = dx * dx + dy * dy;
  const t = largo === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / largo));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

const simplificar = (puntos, tolerancia) => {
  if (puntos.length < 3) return puntos;
  const conservar = new Uint8Array(puntos.length);
  conservar[0] = conservar[puntos.length - 1] = 1;
  const pila = [[0, puntos.length - 1]];
  while (pila.length) {
    const [inicio, fin] = pila.pop();
    let maxDist = 0;
    let indice = -1;
    for (let i = inicio + 1; i < fin; i++) {
      const d = distanciaASegmento(puntos[i], puntos[inicio], puntos[fin]);
      if (d > maxDist) {
        maxDist = d;
        indice = i;
      }
    }
    if (maxDist > tolerancia) {
      conservar[indice] = 1;
      pila.push([inicio, indice], [indice, fin]);
    }
  }
  return puntos.filter((_, i) => conservar[i]);
};

const redondear = (n) => Number(n.toFixed(DECIMALES));

const limpiarAnillo = (anillo) => {
  const simple = simplificar(anillo, TOLERANCIA).map(([x, y]) => [redondear(x), redondear(y)]);
  const sinRepetidos = simple.filter(
    (p, i) => i === 0 || p[0] !== simple[i - 1][0] || p[1] !== simple[i - 1][1]
  );
  const [primero] = sinRepetidos;
  const ultimo = sinRepetidos[sinRepetidos.length - 1];
  if (primero[0] !== ultimo[0] || primero[1] !== ultimo[1]) sinRepetidos.push([...primero]);
  return sinRepetidos.length >= 4 ? sinRepetidos : null;
};

// Agrupa anillos Esri (exteriores en sentido horario, huecos antihorario) en polígonos GeoJSON
// (exteriores antihorario, huecos horario, según RFC 7946).
const aPoligonos = (anillos) => {
  const exteriores = [];
  const huecos = [];
  for (const anillo of anillos) (areaFirmada(anillo) < 0 ? exteriores : huecos).push(anillo);
  const poligonos = exteriores.map((ext) => ({ ext, huecos: [] }));
  for (const hueco of huecos) {
    const dueno = poligonos.find((p) => puntoEnAnillo(hueco[0], p.ext)) ?? poligonos[0];
    dueno.huecos.push(hueco);
  }
  return poligonos
    .map(({ ext, huecos: hs }) => {
      const exterior = limpiarAnillo([...ext].reverse());
      if (!exterior) return null;
      return [exterior, ...hs.map((h) => limpiarAnillo([...h].reverse())).filter(Boolean)];
    })
    .filter(Boolean);
};

// Punto para la etiqueta: el punto interior más alejado de los bordes (búsqueda en rejilla).
const puntoEtiqueta = (poligonos) => {
  const [principal] = [...poligonos].sort(
    (a, b) => Math.abs(areaFirmada(b[0])) - Math.abs(areaFirmada(a[0]))
  );
  const escalaX = Math.cos((principal[0][0][1] * Math.PI) / 180);
  const xs = principal[0].map((p) => p[0]);
  const ys = principal[0].map((p) => p[1]);
  const distanciaBorde = ([x, y]) => {
    if (!puntoEnAnillo([x, y], principal[0])) return -1;
    if (principal.slice(1).some((h) => puntoEnAnillo([x, y], h))) return -1;
    let min = Infinity;
    for (const anillo of principal) {
      for (let i = 0; i < anillo.length - 1; i++) {
        const a = [anillo[i][0] * escalaX, anillo[i][1]];
        const b = [anillo[i + 1][0] * escalaX, anillo[i + 1][1]];
        min = Math.min(min, distanciaASegmento([x * escalaX, y], a, b));
      }
    }
    return min;
  };
  let mejor = null;
  let mejorDist = -1;
  let [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  for (let ronda = 0; ronda < 4; ronda++) {
    const pasos = 30;
    for (let i = 0; i <= pasos; i++) {
      for (let j = 0; j <= pasos; j++) {
        const p = [minX + ((maxX - minX) * i) / pasos, minY + ((maxY - minY) * j) / pasos];
        const d = distanciaBorde(p);
        if (d > mejorDist) {
          mejorDist = d;
          mejor = p;
        }
      }
    }
    const [ancho, alto] = [(maxX - minX) / 6, (maxY - minY) / 6];
    [minX, maxX, minY, maxY] = [mejor[0] - ancho, mejor[0] + ancho, mejor[1] - alto, mejor[1] + alto];
  }
  return { punto: [redondear(mejor[1]), redondear(mejor[0])], radioKm: mejorDist * 111 };
};

// Asigna uno de 3 tonos para que localidades vecinas no compartan tono. Con solo 3 tonos
// no siempre es posible; en ese caso se busca la asignación cuyo borde compartido con el
// mismo tono sea lo más corto posible (idealmente, solo esquinas que se tocan).
const asignarTonos = (claves) => {
  const clave = ([x, y]) => `${x.toFixed(5)},${y.toFixed(5)}`;
  const segmentos = claves.map(({ anillos }) => {
    const mapa = new Map();
    for (const anillo of anillos) {
      for (let i = 0; i < anillo.length - 1; i++) {
        const [a, b] = [clave(anillo[i]), clave(anillo[i + 1])];
        const largo = Math.hypot(anillo[i + 1][0] - anillo[i][0], anillo[i + 1][1] - anillo[i][1]);
        mapa.set(a < b ? `${a}|${b}` : `${b}|${a}`, largo * 111000);
      }
    }
    return mapa;
  });
  const n = claves.length;
  const borde = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let metros = 0;
      for (const [seg, largo] of segmentos[i]) if (segmentos[j].has(seg)) metros += largo;
      borde[i][j] = borde[j][i] = metros;
    }
  }
  const orden = [...Array(n).keys()].sort(
    (a, b) => borde[b].reduce((s, m) => s + m, 0) - borde[a].reduce((s, m) => s + m, 0)
  );
  const tonos = new Array(n).fill(-1);
  let mejor = { costo: Infinity, tonos: null };
  const buscar = (k, costo) => {
    if (costo >= mejor.costo) return;
    if (k === n) {
      mejor = { costo, tonos: [...tonos] };
      return;
    }
    const i = orden[k];
    for (let t = 0; t < 3; t++) {
      let extra = 0;
      for (let j = 0; j < n; j++) if (tonos[j] === t) extra += borde[i][j];
      tonos[i] = t;
      buscar(k + 1, costo + extra);
      tonos[i] = -1;
    }
  };
  buscar(0, 0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (borde[i][j] > 0 && mejor.tonos[i] === mejor.tonos[j]) {
        console.log(`Aviso: ${claves[i].nombre} y ${claves[j].nombre} comparten tono (${borde[i][j].toFixed(0)} m de borde)`);
      }
    }
  }
  return mejor.tonos;
};

const origen = JSON.parse(readFileSync(ORIGEN, "utf8"));
const localidades = origen.features.map((f) => ({
  nombre: NOMBRES[f.attributes.LocNombre],
  codigo: f.attributes.LocCodigo,
  anillos: f.geometry.rings,
}));

const sinNombre = localidades.filter((l) => !l.nombre);
if (sinNombre.length || localidades.length !== 20) {
  throw new Error(`Se esperaban 20 localidades con nombre conocido; revisa NOMBRES`);
}

const tonos = asignarTonos(localidades);
localidades.forEach((l, i) => (l.tono = tonos[i]));

const features = localidades
  .sort((a, b) => a.codigo.localeCompare(b.codigo))
  .map((l) => {
    const poligonos = aPoligonos(l.anillos);
    const { punto, radioKm } = puntoEtiqueta(poligonos);
    return {
      type: "Feature",
      properties: {
        nombre: l.nombre,
        codigo: l.codigo,
        tono: l.tono,
        etiqueta: punto,
        // Zoom mínimo al que se muestra el nombre, según el espacio disponible dentro.
        zoomEtiqueta: radioKm > 1.6 ? 10 : radioKm > 0.8 ? 11 : 12,
      },
      geometry:
        poligonos.length === 1
          ? { type: "Polygon", coordinates: poligonos[0] }
          : { type: "MultiPolygon", coordinates: poligonos },
    };
  });

const salida = JSON.stringify({ type: "FeatureCollection", features });
writeFileSync(DESTINO, salida);

for (const f of features) {
  console.log(f.properties.codigo, f.properties.nombre, "tono", f.properties.tono, "zoom", f.properties.zoomEtiqueta);
}
console.log(`${DESTINO}: ${(salida.length / 1024).toFixed(0)} KB`);
