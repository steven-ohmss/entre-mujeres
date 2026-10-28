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

- **Imágenes**: van en el bucket `imagenes` de Supabase. Se suben con `npm run supabase:cargar` desde `public/images/`, o desde el panel de Supabase manteniendo la misma ruta. Mientras no haya foto, la interfaz muestra el recuadro de "Foto próximamente".
- **Datos de comunidades, productos, eventos, noticias y marcadores del mapa**: están en Supabase. Los registros con `is_example` en true son de ejemplo y hay que reemplazarlos por información real (ver [`docs/datos-pendientes.md`](docs/datos-pendientes.md)). El contacto general sigue en `config/site.ts`.
- **Tipos de datos**: si necesitas agregar campos nuevos, revisa primero `types/index.ts`.

## De dónde salen los datos

**El contenido vive en Supabase** y las páginas lo leen en el servidor, con caché. La capa de datos es [`lib/datos.ts`](lib/datos.ts): cada consulta lleva su etiqueta (`cacheTag`) y una vida de una hora (`cacheLife`), así que el sitio responde rápido y un cambio en la base se ve dentro de la hora siguiente sin volver a publicar.

- **Esquema y permisos**: `supabase/migrations/`. Cualquiera lee, solo los admins escriben.
- **Cargar o actualizar el contenido**: `npm run supabase:cargar` (ver [`docs/supabase.md`](docs/supabase.md)).
- **Semilla**: `supabase/seed/contenido-inicial.ts` es el contenido con el que arrancó el proyecto. Ya **no alimenta el sitio**: solo lo lee el script de carga. Para cambiar lo que se ve hay que cambiar la base, no este archivo.
- **Listas de los filtros** (categorías, localidades, tipos de evento): `lib/catalogos.ts`. No son contenido sino la lista cerrada de valores permitidos, y están duplicadas como tipos enum en la primera migración.
- **Variables de entorno**: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, en `.env.local` y en Vercel. La clave secret no va en Vercel.

Si la base no responde, el sitio no muestra una página rota: `app/error.tsx` explica que el problema es nuestro y ofrece reintentar.

Las solicitudes para aparecer en el mapa no las recibe el sitio: el bloque "Quiero aparecer en el mapa" (`components/JoinSection.tsx`) abre el formulario de Google del equipo, cuya URL está en `GOOGLE_FORM_URL` dentro de `config/site.ts`.

## Mapa de comunidades

El mapa de la sección `#mapa` usa [Leaflet](https://leafletjs.com) con `react-leaflet`. La configuración (teselas, centro, zoom y límites) está en `lib/mapConfig.ts`.

- **Marcadores**: son las columnas `lat` y `lng` de cada comunidad en Supabase; una comunidad sin coordenada simplemente no sale en el mapa. Para comprobar que cada punto cae dentro de la localidad que declara (contra la semilla): `node --import ./scripts/alias-arroba.mjs scripts/verificar-marcadores.mjs`.
- **Localidades**: `public/data/localidades-bogota.geojson` se generó a partir del conjunto [Localidad. Bogotá D.C.](https://datosabiertos.bogota.gov.co/dataset/localidad-bogota-d-c) de Datos Abiertos Bogotá (licencia CC BY 4.0). Para regenerarlo, descarga el recurso GeoJSON (`loca.json`) en `referencias/localidades-bogota-esri.json` y ejecuta `node scripts/generar-localidades.mjs`.

### Teselas del mapa base

Por defecto el mapa usa el servidor de teselas de OpenStreetMap (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`), que no requiere clave. Ese servidor tiene una [política de uso](https://operations.osmfoundation.org/policies/tiles/) y puede bloquear un uso intenso, así que **antes de publicar en serio hay que cambiar a un proveedor de teselas basado en OpenStreetMap con plan gratuito**. Se hace solo con estas dos variables de entorno (en `.env.local` y también en el panel de Vercel, en *Settings → Environment Variables*):

```bash
NEXT_PUBLIC_MAP_TILE_URL=https://proveedor.example/{z}/{x}/{y}.png?api_key=TU_CLAVE
NEXT_PUBLIC_MAP_TILE_ATTRIBUTION="© Proveedor © OpenStreetMap contributors"
```

Después de cambiarlas en Vercel hay que volver a desplegar, porque las variables `NEXT_PUBLIC_` se incluyen al compilar.

## Despliegue

El proyecto se despliega en [Vercel](https://vercel.com) conectando este repositorio de GitHub.

**Variables obligatorias** (Settings → Environment Variables, en Production, Preview y Development):

| Nombre | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wwqxnfsfowhgdmzifaky.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clave **publishable** (`sb_publishable_…`) |

Sin ellas el despliegue falla al preparar las páginas de producto y de comunidad, y Vercel deja en línea la versión anterior. **`SUPABASE_SERVICE_ROLE_KEY` no se agrega aquí**: el sitio no la necesita y se salta todos los permisos.

Las del mapa base son opcionales (ver arriba).
