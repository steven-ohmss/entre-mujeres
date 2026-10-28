# Paso 5: El panel de administración (/admin)

Contexto: el sitio ya lee de Supabase (paso 3) y el inicio de sesión por invitación funciona (paso 4). La tabla `admins` y la función `is_admin()` controlan quién puede escribir; las políticas RLS ya existen en las tablas de contenido y en el bucket `imagenes`. Ahora hay que construir el panel donde las administradoras crean, editan y borran contenido sin tocar código.

Quienes lo van a usar: mujeres de Red Mujer sin conocimientos técnicos, desde el celular o el computador. Mismo estilo del sitio, textos de 18 px o más, botones de 48 px mínimo, lenguaje sencillo y cotidiano, mensajes de error claros en español.

## Alcance

Secciones del panel, cada una con su ruta bajo `/admin`:
1. **Comunidades**
2. **Productos** (con sus fotos)
3. **Eventos** (calendario)
4. **Noticias** (si existen como tabla; si sí, inclúyelas)

NO incluir: las solicitudes del formulario "Quiero ser parte" (el sitio usa un Google Form).

Antes de construir, revisa el esquema real de las tablas y los tipos del código, y muéstrame un resumen corto del plan (pantallas, formularios y cómo manejarás las imágenes). Espera mi visto bueno solo si encuentras una decisión que cambie el diseño; si no, avanza.

## Cada sección

- **Listado** con buscador, foto en miniatura, nombre y estado (por ejemplo "Pendiente" cuando faltan datos). Botón grande "Agregar".
- **Formulario de crear/editar**, con validación clara y mensajes en español.
- **Eliminar** con confirmación que muestre el nombre ("¿Seguro que quieres eliminar Mermelada campesina?"). Si una comunidad tiene productos, avisar cuántos y qué pasará antes de permitir borrarla.
- **Campos vacíos** se guardan como `null` (nunca como el texto "PENDIENTE") y se muestran en el panel como "Pendiente".
- El orden de las listas usa la columna `orden`; permitir cambiarlo de forma sencilla (por ejemplo botones "subir" y "bajar").

## Reglas de los formularios

- **Slug:** se genera solo a partir del nombre (minúsculas, sin tildes, con guiones) y se puede ver pero no hace falta editarlo. Debe ser único; si ya existe, avisar con claridad.
- **Categorías, tipos y localidades:** selectores con los valores permitidos de `lib/catalogos.ts` (los mismos enums de la base). No texto libre.
- **Producto:** nombre, comunidad (selector), categoría, descripción, características (lista que se puede agregar y quitar), presentación, disponibilidad (opcional) y fotos.
- **Comunidad:** nombre, tipo, localidad, ubicación en texto, coordenadas, historia o descripción, WhatsApp, redes, enlace a catálogo y foto. La coordenada va completa (lat y lng) o no va.
- **Ubicación en mapa:** permitir elegir el punto haciendo clic en un mapa (Leaflet, ya usado en el sitio) o pegando latitud y longitud. Validar que caiga dentro de Colombia.
- **Evento:** nombre, tipo, fecha, hora de inicio y fin (selectores nativos de fecha y hora), lugar, localidad, quién organiza, descripción y foto.
- **WhatsApp:** aceptar el número como lo escriba la persona y normalizarlo al formato que usa el sitio para `wa.me`; mostrar una vista previa del enlace.

## Imágenes

- Subir desde el celular o el computador, con vista previa.
- Reducir en el navegador antes de subir: máximo 1600 px de ancho, JPG o WebP, calidad ~80, peso máximo aproximado de 300 KB. Rechazar archivos que no sean imágenes.
- Guardar en el bucket `imagenes` con la estructura de carpetas ya existente (`productos/`, `comunidades/`, `eventos/`, `noticias/`, `inicio/`) y nombres basados en el slug, sin tildes ni espacios.
- **Descripción de la foto (alt) obligatoria**, con una explicación corta debajo del campo: "Escribe lo que se ve en la foto, por ejemplo: Dos mujeres llenando frascos de mermelada en una mesa de madera." La base ya exige alt no vacío.
- Ninguna foto se repite entre productos distintos (la base ya lo impide con `storage_path` único); si el usuario intenta reutilizar una, mostrar un mensaje claro.
- Al reemplazar o quitar una foto, borrar la anterior del bucket para no dejar archivos huérfanos.
- Un producto puede tener varias fotos; la primera es la principal. Permitir reordenarlas.

## Seguridad

- Todas las escrituras pasan por la sesión de la usuaria y por RLS. La clave secret (`SUPABASE_SERVICE_ROLE_KEY`) NUNCA se usa en el navegador ni en el panel; no debe aparecer en ningún archivo bajo `app/` que llegue al cliente.
- Verificar en el servidor que la usuaria esté en `admins` antes de cada acción (no confiar solo en esconder botones).
- Validar los datos también en el servidor, no solo en el formulario.

## Que se vea de inmediato

Al guardar, mostrar un mensaje "Guardado" y revalidar las páginas públicas afectadas (inicio, carrusel, listado y página del producto o de la comunidad, mapa, calendario, buscador) usando la estrategia de caché que ya dejaste preparada en el paso 3. Si algo falla, mostrar un mensaje claro y no perder lo que la persona escribió.

## Cómo probarlo

1. Crear un producto de prueba con foto, verlo en `/productos` y en su página propia, y comprobar que aparece en el buscador.
2. Editarlo (cambiar nombre, foto y descripción) y comprobar que el sitio público se actualiza.
3. Borrarlo y comprobar que desaparece y que la foto ya no está en el bucket.
4. Repetir lo esencial con una comunidad (incluido el punto en el mapa) y un evento (que aparezca en el calendario en la fecha correcta).
5. Probar con una cuenta que NO esté en `admins` y confirmar que no puede escribir.
6. Probar en un ancho de celular (360 px) y revisar que todo se pueda usar con el pulgar.
7. Dejar la base como estaba: borra todo lo de prueba al terminar.

## Al terminar

- Escribe `docs/guia-panel.md`, una guía corta con capturas descritas paso a paso para alguien que no sabe programar: cómo entrar, cómo agregar un producto con foto, cómo editar una comunidad, cómo agregar un evento y cómo borrar algo.
- Haz commit, push y confirma que `npm run build` pasa y que el despliegue en Vercel termina bien.
- Dime qué quedó pendiente o qué decisiones tomaste que debería revisar.
