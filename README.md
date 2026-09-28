# Entre mujeres

Plataforma comunitaria (Next.js) para descubrir, conectar y fortalecer comunidades, organizaciones y emprendimientos de mujeres de Bogotá y Cundinamarca, impulsada por Red Mujer.

## Instalación y desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio.

Para verificar que compila sin errores antes de subir cambios:

```bash
npm run build
```

## Dónde reemplazar contenido de ejemplo

- **Imágenes**: reemplaza los archivos en `public/images/` manteniendo exactamente los mismos nombres (`hero-mujeres.jpg`, `comunidad-1.jpg`, etc.). Mientras no estén, cada contenedor muestra un color de fondo de respaldo.
- **Datos de comunidades, productos, eventos, noticias, marcadores del mapa y contacto**: todos están en `data/data.ts`. Los registros marcados con `isExample: true` son de ejemplo y deben reemplazarse por información real a medida que nuevas comunidades se sumen a la red.
- **Tipos de datos**: si necesitas agregar campos nuevos, revisa primero `types/index.ts`.

## Sin backend

Este proyecto no tiene backend ni base de datos: todo el contenido vive en `data/data.ts`. El formulario "Quiero ser parte" (`components/JoinForm.tsx`) simula el envío (validación + estado de carga + mensaje de confirmación) pero no guarda la información en ningún lado todavía. Busca el comentario `// TODO:` dentro de ese archivo para conectar un backend real o un servicio de formularios.

## Mapa de comunidades

El mapa de la sección `#mapa` usa [Leaflet](https://leafletjs.com) con `react-leaflet`. La configuración (teselas, centro, zoom y límites) está en `lib/mapConfig.ts`.

- **Marcadores**: están en `mapMarkers` dentro de `data/data.ts`, con `lat` y `lng` reales. Los de ejemplo tienen coordenadas aproximadas marcadas con `// TODO:`. Para comprobar que cada marcador cae dentro de su localidad: `node scripts/verificar-marcadores.mjs`.
- **Localidades**: `public/data/localidades-bogota.geojson` se generó a partir del conjunto [Localidad. Bogotá D.C.](https://datosabiertos.bogota.gov.co/dataset/localidad-bogota-d-c) de Datos Abiertos Bogotá (licencia CC BY 4.0). Para regenerarlo, descarga el recurso GeoJSON (`loca.json`) en `referencias/localidades-bogota-esri.json` y ejecuta `node scripts/generar-localidades.mjs`.

### Teselas del mapa base

Por defecto el mapa usa el servidor de teselas de OpenStreetMap (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`), que no requiere clave. Ese servidor tiene una [política de uso](https://operations.osmfoundation.org/policies/tiles/) y puede bloquear un uso intenso, así que **antes de publicar en serio hay que cambiar a un proveedor de teselas basado en OpenStreetMap con plan gratuito**. Se hace solo con estas dos variables de entorno (en `.env.local` y también en el panel de Vercel, en *Settings → Environment Variables*):

```bash
NEXT_PUBLIC_MAP_TILE_URL=https://proveedor.example/{z}/{x}/{y}.png?api_key=TU_CLAVE
NEXT_PUBLIC_MAP_TILE_ATTRIBUTION="© Proveedor © OpenStreetMap contributors"
```

Después de cambiarlas en Vercel hay que volver a desplegar, porque las variables `NEXT_PUBLIC_` se incluyen al compilar.

## Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com) conectando este repositorio de GitHub. Funciona sin variables de entorno; las únicas opcionales son las del mapa base (ver arriba).
