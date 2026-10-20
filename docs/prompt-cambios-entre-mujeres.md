# Prompt: rediseño y mejoras de la plataforma "Entre mujeres"

## 1. Contexto del proyecto

Vas a modificar el sitio web **Entre mujeres** (https://entre-mujeres.vercel.app), una plataforma comunitaria de **Red Mujer** para descubrir, conectar y fortalecer comunidades, organizaciones y emprendimientos de mujeres en Bogotá y Cundinamarca.

- **Stack actual:** Next.js con Tailwind CSS, desplegado en Vercel. El mapa usa Leaflet con OpenStreetMap y los límites de localidades de Datos Abiertos Bogotá.
- **Estructura actual:** una sola página larga con anclas (`#inicio`, `#calendario`, `#nosotras`, `#productos`, `#mapa`, `#comunidades`, `#noticias`, `#quiero-ser-parte`, `#contacto`). Todo aparece de golpe al entrar.
- **Identidad visual que se mantiene:** verde oscuro (botones y menú activo), rosado (acentos y mapa), fondo crema claro, tipografía actual y tono cercano.
- **Público principal:** mujeres campesinas y de zonas rurales, muchas con poca experiencia usando internet. **Todo debe ser fácil de entender a la primera**: textos más grandes, iconos reconocibles, pocos pasos y lenguaje sencillo.

Estos cambios salen de una sesión de retroalimentación con usuarias reales y de las especificaciones del equipo. El diagnóstico general fue: **la página se ve plana, poco llamativa, poco interactiva y desordenada; al entrar no se entiende cómo está dividida.**

---

## 2. Cómo trabajar (obligatorio)

1. **Analiza antes de cambiar.** Revisa el código actual y entrega un resumen corto de cómo está organizado (componentes, datos, rutas y estilos). Luego propone **la manera más óptima** de hacer los cambios.
2. **Agrega páginas nuevas solo si son necesarias.** Si un objetivo se puede lograr bien dentro de la estructura actual, hazlo así. Si propones una ruta nueva, explica por qué hace falta (ver el caso de Productos en 3.4, donde probablemente sí sea necesaria).
3. **Espera confirmación del plan** antes de implementar.
4. **Simulación visual de los cambios:** por cada cambio de diseño o de material visual (header, hero con video, tarjetas de productos, mapa, etc.), entrega una **imagen de antes y después** (captura o maqueta) para que el equipo pueda revisar cómo queda antes de aprobarlo.
5. **El buscador es prioridad:** hay que encontrar la manera de corregirlo para que sea preciso (ver 3.2).

---

## 3. Principios que guían todos los cambios

1. **No mostrar todo de golpe.** Cada sección debe estar claramente separada y fácil de identificar.
2. **Más visual, menos texto.** Cada acceso, filtro y botón importante lleva un icono + una etiqueta corta.
3. **Accesible para personas del campo:**
   - Texto base mínimo de 18 px; títulos claramente más grandes.
   - Botones y áreas táctiles de al menos 48 × 48 px.
   - Buen contraste de color (WCAG AA como mínimo).
   - Frases cortas y palabras cotidianas (por ejemplo "Escríbenos por WhatsApp" en vez de "Contactar al productor").
4. **Llegar a lo que se busca en el menor número de pasos posible.**
5. **Diseño responsive pensado primero para celular.**

---

## 4. Cambios por sección

Para cada cambio se describe el problema, lo que hay que hacer y cómo saber que quedó bien.

### 4.1 Header (menú de navegación)

**Problema:** el menú tiene demasiadas opciones sin orden de importancia, y el estilo blanco plano hace que el sitio se vea poco llamativo.

**Qué hacer:**
- **Eliminar "Comunidades"** del menú (se integra en Productos, ver 4.4).
- Reordenar el menú por importancia, exactamente así:
  **INICIO – PRODUCTOS – MAPA – CALENDARIO – NOTICIAS – NOSOTRAS – CONTACTO**
- **Header translúcido** (efecto vidrio esmerilado):
  - Fondo semitransparente con desenfoque (por ejemplo `backdrop-blur-md` + un color con opacidad).
  - Como el header actual es blanco, **elegir un color que funcione bien con el efecto translúcido** y con la paleta del sitio. Opciones a evaluar: crema con opacidad (~70–80 %) o verde oscuro con opacidad (~60–70 %) con texto claro. Mostrar ambas opciones en la simulación visual.
  - Debe leerse bien tanto encima del video del inicio como encima del contenido claro de las demás secciones (cambiar a una versión más sólida al hacer scroll si hace falta para mantener el contraste).
  - **Si se cambia el color del header, adaptar todo el sitio para que sea coherente** (botones, acentos, pie de página, fondos de sección).
- El header queda fijo arriba al hacer scroll y marca claramente la sección activa.
- Cada ítem lleva un icono pequeño al lado del texto.
- En celular: menú tipo hamburguesa con opciones grandes, cada una con su icono.
- Mantener el botón "Sé parte →" a la derecha (ver 4.7 para su nuevo destino).

**Listo cuando:** "Comunidades" ya no aparece, el orden es el indicado, el header es translúcido y legible sobre cualquier fondo, y el resto del sitio combina con él.

### 4.2 Buscador

**Problema:** el buscador da vueltas innecesarias. Si alguien busca "mermelada", lo manda otra vez a la sección general de productos y tiene que volver a buscar ahí dentro.

**Qué hacer:**
- Mientras la persona escribe, mostrar **sugerencias en vivo agrupadas** por tipo: Productos, Categorías y Comunidades (con icono y miniatura).
- Al elegir un resultado, llevar **directamente a la página del producto específico** (por ejemplo, "Mermelada campesina") o al perfil de la comunidad, **nunca de vuelta a la sección general de productos**.
- Al presionar Enter: si hay un único resultado claro, abrirlo directamente; si hay varios, mostrar una lista de resultados ya filtrada (por ejemplo `/productos?q=mermelada`) con el texto buscado visible y un botón para quitar el filtro.
- Tolerar tildes, mayúsculas y plurales ("mermeladas", "Mermelada", "artesania" → "artesanía").
- Si no hay resultados, mostrar un mensaje amable y sugerir categorías.

**Listo cuando:** buscar "mermelada" lleva en un solo paso al producto específico.

### 4.3 Inicio (home)

**Problema:** el inicio no es llamativo, la descripción no refleja bien de qué trata la plataforma y tiene elementos que sobran.

**Qué hacer:**
1. **Fondo principal en video.** El hero (sección principal) reemplaza la foto actual por un **video de fondo**:
   - Atributos `autoplay muted loop playsInline`, con una imagen `poster` que se muestre mientras carga o si el video no se reproduce.
   - Capa oscura o degradado encima del video para que el texto se lea bien.
   - Video comprimido y liviano (idealmente menos de 5 MB, formato MP4/WebM) para que cargue rápido con conexiones lentas; en celular con conexión lenta o con "reducir movimiento" activado, mostrar solo la imagen.
   - Dejar la ruta del video en una constante (`HERO_VIDEO_URL = "PENDIENTE"`) si el equipo aún no lo entrega.
2. **Título (h1): una frase concreta que defina mejor el sitio.** Propuesta (el equipo puede ajustarla):
   **"Conectamos el trabajo de las mujeres de Bogotá y Cundinamarca"**
3. **Subtexto (p): una frase corta y concreta que complemente al h1.** Propuesta:
   **"Conoce sus productos, sus comunidades y sus ferias."**
4. **Eliminar las tres etiquetas** que aparecen justo debajo del h1 y el p: "Más mujeres conectadas", "Territorios más fuertes" y "Oportunidades reales".
5. **Eliminar el bloque "Mujeres que hacen la diferencia" completo**, es decir:
   - El texto "Un territorio lleno de vida".
   - El título "Mujeres que hacen la diferencia".
   - El párrafo "Conectamos iniciativas, productos y comunidades de mujeres en Bogotá y Cundinamarca para construir un futuro más justo, sostenible e inclusivo."
   - Las cuatro imágenes: "Mujer de una comunidad productora de la red", "Mujer de un emprendimiento textil de la red", "Mujer de una comunidad rural de Sumapaz" y "Mujer de un servicio de apoyo comunitario".
   - **Mantener el `container-page`** que lo envuelve, pero **quitarle las clases `mt-16 sm:mt-20`** para que no quede un espacio vacío.
6. **Accesos rápidos** (Eventos, Mapa, Productos, Historias): organizarlos como 4 tarjetas grandes y simétricas, cada una con icono grande, título y una línea de descripción. La frase "Cuando una mujer avanza, avanzamos todas" se separa de las tarjetas y se usa como frase destacada aparte.
7. **Banner deslizable de noticias y actividades** (pedido en la retroalimentación, referente: https://plazadepaloquemao.com/): ubicarlo **debajo del hero con video**, con diapositivas de próximos eventos y noticias recientes (imagen, título corto, botón), flechas, puntos indicadores, deslizamiento con el dedo y avance automático que se pausa al tocarlo.

**Listo cuando:** al entrar se ve un video de fondo con un h1 claro y un subtexto corto, sin las tres etiquetas ni el bloque "Mujeres que hacen la diferencia", y sin espacios vacíos donde estaba.

### 4.4 Productos y Comunidades (se unifican)

**Problema:** productos y comunidades están separados, no se sabe con claridad qué ofrece cada comunidad, no hay forma fácil de contactar para comprar, algunas fotos no corresponden al producto (se reutiliza la misma imagen para conservas y para turismo rural) y el buscador no puede llevar a un producto específico porque los productos no tienen su propia página.

**Qué hacer:**
1. **Analizar primero** cuál es la forma más óptima de resolverlo. Lo más probable es que sea necesario **agregar una página por producto** (por ejemplo `/productos/[slug]`) para que el buscador pueda llevar directamente a él. Agregar otras páginas solo si se justifican.
2. **Unificar Productos y Comunidades en una sola pestaña ("Productos"):**
   - Filtros por categoría (Artesanías, Turismo rural, Ropa y textiles, Souvenirs, Educación y formación, Gastronomía, Otros) como **botones horizontales con icono**, en lugar de la lista vertical actual que ocupa mucho espacio.
   - Filtros adicionales por localidad y por tipo de comunidad.
   - Cada tarjeta muestra foto, nombre, categoría, comunidad que lo produce y ubicación.
3. **Especificar los productos y servicios ofrecidos.** La página de cada producto muestra:
   - Descripción clara y características (material, presentación, tamaño, etc.).
   - Disponibilidad (disponible, por encargo, por temporada).
   - Enlace al catálogo o portafolio de la comunidad, si existe.
4. **Facilitar el contacto y la comercialización.** Botón grande y verde **"Pregunta por WhatsApp"** que abre `https://wa.me/<número>` con un mensaje ya escrito, por ejemplo: "Hola, vi su producto *Mermelada campesina* en Entre mujeres y quiero más información." Sirve para consultar precios, pedir información y contactar a las productoras.
5. **Conocer a la comunidad desde el producto.** Enlace "Conoce a la comunidad que lo hace" que lleva a su información: historia, ubicación, foto, todos sus productos y su WhatsApp.
6. **Fotografías reales y coherentes con cada producto:**
   - Cada producto tiene su propia foto en los datos; nunca se reutilizan imágenes entre productos distintos (si alguien busca miel orgánica, debe ver esa miel y no una ruana).
   - Si todavía no hay foto real, mostrar una imagen neutra con el icono de la categoría y el texto "Foto próximamente".
   - El equipo está recopilando las fotos reales de cada comunidad; dejar la estructura lista para reemplazarlas fácilmente.

**Listo cuando:** desde una sola pestaña se encuentra un producto, cada producto tiene su página con información, WhatsApp y enlace a su comunidad, y el buscador lleva directo a él.

### 4.5 Mapa de comunidades

**Problema:** el mapa funciona bien, pero el rosado de las localidades es muy fuerte y tapa las calles y nombres al acercar el zoom.

**Qué hacer:**
- Bajar la opacidad del relleno rosado (por ejemplo, `fillOpacity` alrededor de 0.25–0.3) y que disminuya aún más con zoom alto, para que se lean calles y veredas.
- Al pasar el mouse o tocar una localidad, subir un poco la opacidad para resaltarla.
- Puntos de comunidades más grandes y fáciles de tocar; al tocarlos se abre una tarjeta con foto, nombre, productos y botón "Ver comunidad".
- **Agregar debajo del mapa la invitación para unirse** (ver 4.7), con referencia en el bloque "Mapa de Cabras" de https://cabrasenred.com/.

**Listo cuando:** al hacer zoom se distinguen bien el mapa base y las comunidades.

### 4.6 Calendario

**Problema:** no es intuitivo para buscar una fecha o el próximo evento, y "Eventos destacados" repite información.

**Qué hacer:**
- **Eliminar "Eventos destacados"** y dejar en su lugar los **próximos eventos**, calculados automáticamente a partir de la fecha actual (los pasados no se muestran).
- Marcar con un punto de color los días con eventos; al tocar un día, la lista muestra solo los eventos de ese día.
- Botón "Hoy" y flechas grandes para cambiar de mes.
- Filtros (localidad, tipo de evento, organiza) detrás de un botón "Filtros", con "Limpiar filtros" visible.
- En celular, mostrar primero la lista de próximos eventos.

**Listo cuando:** al abrir el calendario se ve de inmediato el próximo evento y se puede ver qué hay en un día con un solo toque.

### 4.7 "Quiero ser parte" (registro)

**Problema:** el formulario es largo, tedioso, poco atractivo y ocupa mucho espacio.

**Qué hacer:**
- **Quitar el formulario largo.**
- Reemplazarlo por un bloque corto debajo del mapa: "¿Tienes una iniciativa de mujeres? Súmate y aparece en el mapa." con un botón grande **"Quiero aparecer en el mapa"** que abre un **formulario de Google** en una pestaña nueva.
- El botón "Sé parte →" del header lleva a ese bloque.
- URL del formulario en una constante: `GOOGLE_FORM_URL = "PENDIENTE"`.

### 4.8 Contacto

**Problema:** la sección muestra datos de ejemplo (`correo@pendiente.com`, `+57 000 000 0000`, `@usuario_pendiente`).

**Qué hacer:**
- Tarjetas grandes con icono para WhatsApp, teléfono, correo, redes y ubicación (Usme – Vereda Arrayanes), todas como enlaces que funcionen (`wa.me`, `tel:`, `mailto:`).
- Mismo bloque en el pie de página.
- **No inventar datos:** centralizarlos en un archivo de configuración con valores `PENDIENTE`.

### 4.9 Nosotras

- Reunir "Somos Red Mujer", "Quiénes somos / Qué buscamos / A quiénes conectamos / Dónde estamos" y "Construimos la red juntas", con fotos, iconos y bloques bien separados.

### 4.10 Historias y noticias

- Mantener las tarjetas (foto, etiqueta, título, fecha y "Leer más").
- Las noticias más recientes alimentan el banner deslizable del inicio.
- *Pendiente: el equipo tiene cambios por definir en esta sección.*

---

## 5. Requisitos técnicos

- Mantener Next.js, Tailwind, Leaflet y la identidad visual (adaptada al nuevo header si cambia de color).
- Guardar productos, comunidades, eventos, noticias y datos de contacto en archivos de datos o configuración separados del diseño, para que Red Mujer pueda actualizarlos sin tocar las páginas.
- Modelo de datos sugerido:
  - **Producto:** id, slug, nombre, categoría, descripción, características, disponibilidad, foto, comunidadId, enlace a catálogo (opcional).
  - **Comunidad:** id, slug, nombre, tipo, localidad, ubicación, coordenadas, historia, foto, WhatsApp, redes, catálogo.
  - **Evento:** id, nombre, tipo, fecha, hora inicio/fin, lugar, localidad, organiza, descripción, foto.
- Textos alternativos (`alt`) que describan la foto real.
- Verificar en celular, tablet y computador.

## 6. Orden sugerido de implementación

1. Análisis del código y propuesta del plan más óptimo (sección 2).
2. Header: quitar "Comunidades", nuevo orden y estilo translúcido, adaptando el sitio (4.1).
3. Inicio: video de fondo, nuevo h1 y p, eliminar etiquetas y bloque "Mujeres que hacen la diferencia" (4.3).
4. Productos y Comunidades unificados, con página por producto y WhatsApp (4.4).
5. Buscador preciso (4.2).
6. Calendario (4.6).
7. Mapa y bloque para unirse con formulario de Google (4.5 y 4.7).
8. Contacto, Nosotras y Noticias (4.8 – 4.10).
9. Revisión final de accesibilidad y simulaciones visuales de antes/después.

## 7. Datos pendientes que debe entregar el equipo

- Video para el fondo del inicio.
- Texto final del h1 y del subtexto (si no se aprueban las propuestas).
- URL del formulario de Google.
- WhatsApp de cada comunidad y uno general de Red Mujer.
- Correo, teléfono y redes sociales reales.
- Fotos reales de cada producto y comunidad, y enlaces a catálogos si existen.

Mientras falten, usa marcadores `PENDIENTE` visibles en la configuración, nunca datos inventados.
