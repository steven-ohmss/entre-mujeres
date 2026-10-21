# Guía del material visual de Entre mujeres

Esta guía es para el equipo de Red Mujer. **No hay que saber programar para usarla.**

Dice exactamente qué fotos, video, logos e iconos necesita la página, cómo se debe
llamar cada archivo y en qué carpeta va. Si entregas los archivos con el nombre que
aparece aquí, quien los suba solo tiene que copiarlos a su carpeta y la página los
muestra sola.

Al final hay una **lista de chequeo** para ir marcando lo que ya está listo.

---

## 0. Material provisional que hay que reemplazar

> **Hay 8 archivos publicados que son de relleno, no del territorio.** Están conectados
> y se ven en la página, pero **ninguno es definitivo**. Esta es la lista para no
> olvidarlos.

| Archivo | Por qué es provisional |
| --- | --- |
| `public/video/inicio-portada.mp4` | Material de archivo. Técnicamente cumple (4,08 MB, 20 s, sin sonido), pero no muestra Bogotá ni Cundinamarca |
| `public/images/inicio/portada.jpg` | Un camino de tierra entre cultivos al atardecer. No aparece ninguna mujer y el paisaje no es el andino del territorio |
| `public/images/productos/conservas-de-la-huerta.jpg` | De archivo · 440 × 330 px, falta resolución |
| `public/images/productos/mermelada-campesina.jpg` | De archivo · 451 × 338 px, falta resolución |
| `public/images/productos/bolsos-tejidos-a-mano.jpg` | De archivo · 588 × 440 px, falta resolución |
| `public/images/productos/ruanas-de-lana.jpg` | De archivo · 588 × 440 px, falta resolución |
| `public/images/productos/recorrido-turismo-rural-sumapaz.jpg` | Se ve auténtica del páramo, pero 471 × 353 px, falta resolución |
| `public/images/productos/taller-formacion-emprendimiento.jpg` | De archivo · 588 × 440 px, falta resolución |

**Cómo se reemplazan: solo hay que sobrescribir el archivo, con el mismo nombre y en la
misma carpeta.** No hay que avisar a nadie ni tocar el código. Por eso los nombres
importan tanto.

Las seis fotos de producto están muy por debajo del ancho que pide esta guía
(1600 px). En la página del producto la foto se muestra a unos 720 px de ancho, que en
una pantalla moderna son 1440 px reales: una imagen de 588 px se estira dos veces y
media y se ve borrosa. Como pesan entre 44 y 63 KB, hay muchísimo margen para subirlas
más grandes sin acercarse al límite de 250 KB.

Cuando se reemplace la portada o el video, hay que avisar: **la frase que describe la
portada para los lectores de pantalla está escrita a la medida de la foto actual** y hay
que reescribirla junto con la imagen (ver 11.2).

---

## 1. La regla de los nombres (lo más importante)

Todos los archivos se nombran igual, con tres reglas:

1. **Todo en minúsculas.**
2. **Sin tildes, sin eñes y sin espacios.** `raíces` se escribe `raices`;
   `acompañamiento` se escribe `acompanamiento`.
3. **Las palabras se separan con guiones medios** (`-`), nunca con espacios ni con
   guion bajo.

Ejemplos de cómo se traduce un nombre real:

| Nombre real | Nombre del archivo |
| --- | --- |
| Mermelada campesina | `mermelada-campesina.jpg` |
| Raíces de Sumapaz | `raices-de-sumapaz.jpg` |
| Jornada de acompañamiento psicosocial | `jornada-acompanamiento-psicosocial.jpg` |

**Buena noticia: esos nombres ya existen.** Cada producto y cada comunidad ya tiene su
nombre corto dentro de la página. Por ejemplo, la comunidad Raíces de Sumapaz vive en
`entre-mujeres.vercel.app/comunidades/raices-de-sumapaz`. Lo que aparece en la
dirección después de la última barra es el nombre que debe llevar el archivo. No hay
que inventar nada: en las tablas de abajo está escrito uno por uno.

### Lo que NO sirve como nombre

- `Foto 1.jpg`, `IMG_20260312.jpg`, `WhatsApp Image 2026-03-12 at 10.14.jpg`
- `Mermelada Campesina.JPG` (mayúsculas y espacio)
- `raíces_de_sumapaz.jpg` (tilde y guion bajo)
- `producto-1.jpg`, `comunidad-2.jpg` (no dicen de qué son)

---

## 2. Dónde van los archivos

Esta es la organización propuesta. Las carpetas `inicio`, `comunidades`, `productos`,
`eventos`, `noticias`, `logo` y `video` todavía no existen: se crean al subir el primer
archivo.

```
public/
  images/
    inicio/          → la foto de la pantalla de bienvenida
    comunidades/     → una foto por comunidad
    productos/       → una o varias fotos por producto
    eventos/         → una foto por evento del calendario
    noticias/        → una foto por noticia o historia
    logo/            → logos de Entre mujeres y de Red Mujer
  video/             → el video de la pantalla de bienvenida
app/
                     → favicon y la imagen que se ve al compartir el enlace
```

Hoy todas las fotos están sueltas en `public/images/` con nombres genéricos
(`producto-1.jpg`, `comunidad-2.jpg`). La propuesta de cómo quedaría cada una está en
la sección 10.

---

## 3. Tamaños, formatos y pesos: las reglas generales

**Formato.** `.jpg` para fotografías. `.png` solo para logos o imágenes que necesiten
fondo transparente. `.svg` si el diseñador entrega el logo en ese formato, que es el
mejor para logos porque nunca se pixela.

**Peso.** Este es el punto que más se descuida y el que más daño hace. El público de la
página son mujeres del campo, muchas con datos móviles limitados y señal lenta. Una
foto de 5 MB puede tardar más de un minuto en aparecer y gastarle los datos a quien
entra.

> **Nunca subas la foto tal como sale del celular.** Una foto de celular pesa entre
> 3 MB y 8 MB. Hay que reducirla antes.

**Cómo reducir el peso sin instalar nada.** Entra a <https://squoosh.app> desde el
navegador, arrastra la foto, elige `MozJPEG` en el panel de la derecha, baja la calidad
a **75**, ajusta el ancho al que pide la tabla correspondiente y descarga. Es gratis y
la foto no sale de tu computador.

**Las dos formas que se usan.**

- **Apaisada 16:9**, más ancha que alta, como la pantalla de un televisor: bienvenida,
  comunidades, eventos y noticias.
- **4:3**, apaisada pero más cuadrada: productos.

Si la foto viene vertical, la página la recorta por los lados y se pierde parte de la
imagen. **Pide siempre las fotos horizontales.**

---

## 4. Pantalla de bienvenida (lo primero que se ve)

### 4.1 Video de fondo

| | |
| --- | --- |
| **Dónde aparece** | De fondo en toda la primera pantalla, al entrar a la página |
| **Nombre y carpeta** | `public/video/inicio-portada.mp4` |
| **Qué debe mostrar** | Mujeres de la red trabajando: manos en la huerta, tejiendo, en la plaza de mercado, un plano del paisaje de la vereda. Movimientos suaves y lentos, sin cámara temblorosa. El texto de bienvenida va encima, así que el centro de la imagen debe quedar despejado, sin letreros ni caras pegadas al centro |
| **Duración** | Entre 10 y 20 segundos. Se repite solo, en bucle |
| **Tamaño** | 1920 × 1080 px (apaisado 16:9) |
| **Formato** | MP4 |
| **Peso máximo** | **5 MB.** Si pesa más, hay que acortarlo o bajarle la calidad |
| **Sonido** | **Sin sonido.** El video se reproduce callado, así que el sonido no se oiría nunca y solo haría el archivo más pesado |

### ¿Y si entro a la página y no veo el video, solo la foto?

El video **arranca solo para todo el mundo**, sin importar cómo tengas configuradas las
animaciones de tu computador o tu teléfono. Si quieres detenerlo, en la **esquina
inferior derecha** del inicio hay un botón redondo para pausarlo y volver a ponerlo.

Solo hay dos casos en los que el video no se carga y queda la foto, y los dos son a
propósito, porque el archivo pesa 4 MB:

- El teléfono está en **modo de ahorro de datos**.
- La **conexión es muy lenta** (red 2G).

En ambos la página se ve completa, solo que quieta. No hay nada que arreglar.

Si no ves el video y no estás en ninguno de esos dos casos, lo más probable es que
estés mirando la versión publicada y los cambios todavía no se hayan subido. Avísanos.

### 4.2 Foto de respaldo de la bienvenida

Esta foto es obligatoria **aunque haya video**. Se ve mientras el video carga, y es lo
único que se ve si la persona tiene señal lenta o si pidió en su teléfono que se
reduzcan las animaciones.

| | |
| --- | --- |
| **Dónde aparece** | Primera pantalla, mientras carga el video o en lugar de él |
| **Nombre y carpeta** | `public/images/inicio/portada.jpg` |
| **Qué debe mostrar** | Lo mismo que el video, en una sola imagen. Lo ideal es un fotograma del propio video, para que el cambio no se note. Centro despejado |
| **Tamaño** | 1920 × 1080 px |
| **Formato** | JPG |
| **Peso máximo** | 300 KB |

---

## 5. Comunidades

Se necesitan **6 fotos, una por comunidad**. Cada foto aparece en tres lugares: en la
tarjeta de la comunidad, en la ventanita que se abre al tocar su punto en el mapa, y
grande en la parte de arriba de su página propia.

**Qué debe mostrar una foto de comunidad.** A las mujeres de esa comunidad, en su lugar
de trabajo y haciendo lo que hacen. Un grupo trabajando funciona mejor que un retrato
posado. Que se vea el entorno real (la huerta, el taller, el puesto en la plaza),
porque es lo que cuenta la historia.

**Todas:** 1600 × 900 px · JPG · **máximo 250 KB**

| Comunidad | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| Red Mujer | `public/images/comunidades/red-mujer.jpg` | Mujeres de Red Mujer reunidas en la vereda Arrayanes, Usme. Es la más importante de las seis: también se usa grande en la sección "Nosotras" |
| Manos de Usme | `public/images/comunidades/manos-de-usme.jpg` | Las productoras preparando conservas y encurtidos, o en la huerta de donde salen los frutos |
| Telar y Tierra | `public/images/comunidades/telar-y-tierra.jpg` | Las tejedoras trabajando en el telar, con las fibras y las piezas a la vista |
| Raíces de Sumapaz | `public/images/comunidades/raices-de-sumapaz.jpg` | Mujeres campesinas en el páramo de Sumapaz, con el cultivo o el paisaje del páramo |
| Semillas de Bosa | `public/images/comunidades/semillas-de-bosa.jpg` | Un encuentro o taller del colectivo con mujeres participando. Al ser acompañamiento psicosocial, cuidar que nadie quede identificable sin haberlo autorizado |
| Sabores de la Concordia | `public/images/comunidades/sabores-de-la-concordia.jpg` | Las vendedoras en su puesto de la plaza de mercado de La Concordia, con la comida tradicional |

---

## 6. Productos

Se necesitan **6 fotos, una por producto como mínimo**. Aparecen en la tarjeta del
producto, en su página propia y como miniatura en los resultados del buscador.

> **Regla que no se puede romper: cada producto lleva SU propia foto.**
>
> Ninguna foto se repite entre dos productos distintos. Si alguien busca "miel", tiene
> que ver esa miel y no una ruana. Hoy la página tiene ese problema, y por eso casi
> todos los productos muestran el cartel "Foto próximamente": es mejor eso que mostrar
> un producto que no es.

**Qué debe mostrar una foto de producto.** El producto solo, bien iluminado, sobre un
fondo sencillo que no distraiga: una mesa de madera, una tela lisa. Luz de día, nunca
flash directo. Que se entienda el tamaño: si es un frasco, poner algo al lado que sirva
de referencia. Sin logos ni teléfonos de otras marcas a la vista.

**Todas:** 1600 × 1200 px (4:3) · JPG · **máximo 250 KB**

| Producto | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| Conservas de la huerta | `public/images/productos/conservas-de-la-huerta.jpg` | Los frascos de vidrio de conservas y encurtidos, de 250 g y 500 g, con la etiqueta visible |
| Mermelada campesina | `public/images/productos/mermelada-campesina.jpg` | El frasco de vidrio de 300 g de mermelada, si se puede con la fruta fresca al lado |
| Bolsos tejidos a mano | `public/images/productos/bolsos-tejidos-a-mano.jpg` | Uno o dos bolsos tejidos, donde se vea la textura de la fibra natural y el diseño |
| Ruanas de lana | `public/images/productos/ruanas-de-lana.jpg` | Una ruana de lana virgen, puesta o colgada de modo que se vea completa |
| Recorrido de turismo rural en Sumapaz | `public/images/productos/recorrido-turismo-rural-sumapaz.jpg` | Un grupo en el sendero del páramo con la guía explicando. Aquí el "producto" es la experiencia, así que la foto muestra el recorrido |
| Taller de formación en emprendimiento | `public/images/productos/taller-formacion-emprendimiento.jpg` | El taller en marcha: mujeres trabajando en grupo, la facilitadora, el material |

### Si un producto tiene varias fotos

Se pueden entregar varias. La primera es la que se ve en la tarjeta. Se numeran así:

```
mermelada-campesina.jpg      ← esta es la principal
mermelada-campesina-2.jpg
mermelada-campesina-3.jpg
```

---

## 7. Eventos del calendario

Se necesitan **6 fotos, una por evento**. Aparecen en el banner deslizable del inicio,
como miniatura en la lista del calendario y grande al abrir el evento.

> Hoy estos 6 eventos comparten solo 3 fotos, y esas mismas 3 se usan además en las
> noticias: **3 fotos haciendo 9 trabajos.** Por eso se repiten imágenes al bajar por
> la página.

**Todas:** 1200 × 675 px (16:9) · JPG · **máximo 200 KB**

| Evento | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| Feria Campesina de Usme | `public/images/eventos/feria-campesina-usme.jpg` | Los puestos de la feria con productos y gente comprando |
| Encuentro de Mujeres Rurales | `public/images/eventos/encuentro-mujeres-rurales.jpg` | El grupo reunido en el encuentro, en círculo o en plenaria |
| Huertas para la vida | `public/images/eventos/huertas-para-la-vida.jpg` | El taller de huerta: manos en la tierra, semillas, herramientas |
| Mercado de Saberes y Sabores | `public/images/eventos/mercado-saberes-sabores.jpg` | El mercado montado, con la comida y los productos campesinos |
| Minga comunitaria en la vereda Arrayanes | `public/images/eventos/minga-comunitaria-arrayanes.jpg` | La minga: la comunidad trabajando junta en la vereda |
| Jornada de acompañamiento psicosocial | `public/images/eventos/jornada-acompanamiento-psicosocial.jpg` | La jornada de manera respetuosa y no identificable: manos, un círculo de sillas, un plano general de espaldas |

Si de un evento todavía no hay foto porque aún no ha pasado, sirve una foto de la
edición anterior o del lugar donde se va a hacer.

---

## 8. Noticias e historias

Se necesitan **3 fotos**, una por publicación.

**Todas:** 1200 × 675 px (16:9) · JPG · **máximo 200 KB**

| Publicación | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| El origen de Red Mujer en la vereda Arrayanes | `public/images/noticias/historia-red-mujer.jpg` | Las fundadoras, o el lugar donde empezó todo en la vereda Arrayanes. Si hay una foto de archivo de los primeros años, mejor |
| Nuevas comunidades se suman a la red | `public/images/noticias/noticia-nuevas-comunidades.jpg` | El momento en que las nuevas comunidades se integran: una reunión, una firma, un grupo grande |
| Taller de tejido reunió a más de 20 mujeres | `public/images/noticias/actividad-reciente-taller-tejido.jpg` | El taller de tejido lleno, con las participantes y sus trabajos |

**Para cada noticia nueva que se publique de aquí en adelante** hace falta su foto, con
el nombre armado igual: en minúsculas, sin tildes, con guiones, y que describa de qué
es. Por ejemplo, "Primera feria en Sumapaz" sería
`public/images/noticias/primera-feria-sumapaz.jpg`.

---

## 9. Logos e iconos

### 9.1 Logo de Entre mujeres

**Hoy la página no usa ningún archivo de logo:** en la barra de arriba hay un símbolo
dibujado por código junto al texto "Entre mujeres". Si el equipo entrega un logo de
verdad, hay que entregarlo así:

| | |
| --- | --- |
| **Dónde aparecería** | Barra de navegación de arriba y pie de página |
| **Nombre y carpeta** | `public/images/logo/entre-mujeres.svg` |
| **Versión clara** | `public/images/logo/entre-mujeres-blanco.svg` — hace falta porque la barra de arriba es verde oscuro y un logo de color oscuro no se vería |
| **Qué debe mostrar** | El logo solo, sin recuadro ni fondo de color. Fondo transparente |
| **Formato** | SVG, que es el mejor porque nunca se pixela. Si no hay SVG, PNG con fondo transparente de 600 px de ancho |
| **Peso máximo** | 50 KB |

> Ojo: poner el logo **sí necesita un cambio en el código**, no es solo copiar el
> archivo a su carpeta. Avísanos cuando lo tengan y lo conectamos.

### 9.2 Logo de Red Mujer

| | |
| --- | --- |
| **Dónde aparecería** | Pie de página, como "Una iniciativa de Red Mujer" |
| **Nombre y carpeta** | `public/images/logo/red-mujer.svg` |
| **Formato y peso** | SVG, o PNG transparente de 600 px de ancho · máximo 50 KB |

### 9.3 Favicon (el iconito de la pestaña del navegador)

Ahora mismo la página muestra **el icono que venía con la plantilla del proyecto**: es
el mismo archivo desde el primer día y nunca se ha cambiado, así que no es un icono de
Entre mujeres. Conviene reemplazarlo. Son tres archivos, los tres con el mismo dibujo:

| Para qué sirve | Nombre y carpeta | Tamaño | Formato | Peso máximo |
| --- | --- | --- | --- | --- |
| Icono de la pestaña | `app/favicon.ico` | 32 × 32 px | ICO | 15 KB |
| Icono grande | `app/icon.png` | 512 × 512 px | PNG | 50 KB |
| Icono para iPhone y iPad | `app/apple-icon.png` | 180 × 180 px | PNG | 30 KB |

**Qué debe mostrar:** el símbolo del logo solo, sin el texto. A 32 × 32 px el texto no
se alcanza a leer y queda una mancha. Cuadrado y con buen contraste.

### 9.4 Imagen para cuando se comparte el enlace

Es la imagen que aparece sola cuando alguien pega el enlace de la página en WhatsApp,
Facebook o Instagram. Hoy no existe, así que el enlace se comparte sin imagen y se ve
pobre.

| | |
| --- | --- |
| **Dónde aparece** | Al compartir `entre-mujeres.vercel.app` por WhatsApp o redes |
| **Nombre y carpeta** | `app/opengraph-image.jpg` |
| **Qué debe mostrar** | Una foto fuerte de las mujeres de la red, con el logo y el nombre "Entre mujeres" encima. Es una pieza de diseño, no una foto suelta. El texto tiene que leerse en pequeño, porque en WhatsApp se ve del tamaño de una tarjeta |
| **Tamaño** | 1200 × 630 px (esta medida es fija, no se puede cambiar) |
| **Formato** | JPG |
| **Peso máximo** | 300 KB |

---

## 10. Lo que hay hoy y cómo quedaría

### Ya resuelto

La pantalla de bienvenida y los seis productos ya tienen su archivo en la carpeta
correcta y con el nombre correcto, y están conectados a la página. Siguen siendo
provisionales: la lista está en la sección 0.

Se borraron tres fotos que no se podían publicar:

| Archivo borrado | Por qué |
| --- | --- |
| `producto-2.jpg` | Frascos de miel y panal. En la red no hay ningún producto de miel |
| `producto-3.jpg` | Materas biodegradables, que tampoco son un producto de la red, y la foto traía texto de publicidad incrustado ("Material natural", "Biodegradable") |
| `producto-4.jpg` | Yogures con la marca, la página web y el teléfono de otra empresa (BBG) impresos en la etiqueta. No es de la red y no se debía publicar |

### Pendiente de renombrar

Estas fotos siguen sueltas en `public/images/` con nombres genéricos. Son de archivo,
no de las comunidades. Se renombrarán cuando lleguen las fotos reales, para no hacer el
trabajo dos veces:

| Archivo hoy | Pasaría a llamarse | Nota |
| --- | --- | --- |
| `red-mujer.jpg` | `comunidades/red-mujer.jpg` | Reemplazar por una foto real de Red Mujer |
| `comunidad-1.jpg` | `comunidades/manos-de-usme.jpg` | Reemplazar por foto real |
| `comunidad-2.jpg` | `comunidades/telar-y-tierra.jpg` | Reemplazar por foto real |
| `comunidad-3.jpg` | `comunidades/raices-de-sumapaz.jpg` | Reemplazar por foto real |
| `comunidad-4.jpg` | `comunidades/semillas-de-bosa.jpg` | Reemplazar por foto real |
| `evento-1.jpg` | `eventos/feria-campesina-usme.jpg` | Hoy se usa en 2 eventos y 1 noticia a la vez |
| `evento-2.jpg` | `eventos/encuentro-mujeres-rurales.jpg` | Hoy se usa en 2 eventos y 1 noticia a la vez |
| `evento-3.jpg` | `eventos/huertas-para-la-vida.jpg` | Hoy se usa en 2 eventos y 1 noticia a la vez |

Dos archivos quedaron sin uso y se borrarán cuando llegue su reemplazo:
`hero-mujeres.jpg`, que era la portada anterior, y `producto-1.jpg`, que era la foto de
las ruanas antes de mudarse a su carpeta.

Faltan por completo, sin nada que renombrar: 3 eventos, las 3 noticias, los logos, el
favicon y la imagen para compartir.

---

## 11. Dos cosas que hay que entregar junto con cada foto

### 11.1 Permiso de las personas que salen

Las fotos van a una página pública en internet. **Antes de entregar una foto donde se
reconozca a alguien, hay que tener su permiso.** Es especialmente delicado en las fotos
de Semillas de Bosa y de la jornada de acompañamiento psicosocial, por el tipo de
trabajo que hacen.

Cuando no haya permiso pero la foto sea necesaria, sirve fotografiar manos, el trabajo,
el producto, o a las personas de espaldas o en plano general.

### 11.2 Una línea que describa la foto

Por cada foto, escribe **una frase corta que diga lo que se ve**. No el nombre del
producto: lo que de verdad aparece en la imagen.

- Bien: "Dos mujeres llenando frascos de mermelada en una mesa de madera"
- Mal: "Mermelada campesina"

Sirve para dos cosas: que una persona ciega que usa lector de pantalla sepa qué hay en
la foto, y que si la foto no carga por mala señal, al menos se lea la descripción.

Lo más fácil es mandar un archivo de texto o una hoja de cálculo con dos columnas:
nombre del archivo y descripción.

---

## 12. Lista de chequeo

Las casillas marcadas con 🟡 tienen un archivo publicado pero **provisional**: siguen
pendientes de reemplazo (sección 0).

### Pantalla de bienvenida

- [x] 🟡 `public/video/inicio-portada.mp4` — máx. 5 MB, sin sonido, 10 a 20 segundos
- [x] 🟡 `public/images/inicio/portada.jpg` — 1920 × 1080, máx. 300 KB

### Comunidades (1600 × 900, máx. 250 KB cada una)

- [ ] `comunidades/red-mujer.jpg`
- [ ] `comunidades/manos-de-usme.jpg`
- [ ] `comunidades/telar-y-tierra.jpg`
- [ ] `comunidades/raices-de-sumapaz.jpg`
- [ ] `comunidades/semillas-de-bosa.jpg`
- [ ] `comunidades/sabores-de-la-concordia.jpg`

### Productos (1600 × 1200, máx. 250 KB cada una)

- [x] 🟡 `productos/conservas-de-la-huerta.jpg` — 440 × 330, falta resolución
- [x] 🟡 `productos/mermelada-campesina.jpg` — 451 × 338, falta resolución
- [x] 🟡 `productos/bolsos-tejidos-a-mano.jpg` — 588 × 440, falta resolución
- [x] 🟡 `productos/ruanas-de-lana.jpg` — 588 × 440, falta resolución
- [x] 🟡 `productos/recorrido-turismo-rural-sumapaz.jpg` — 471 × 353, falta resolución
- [x] 🟡 `productos/taller-formacion-emprendimiento.jpg` — 588 × 440, falta resolución

### Eventos (1200 × 675, máx. 200 KB cada una)

- [ ] `eventos/feria-campesina-usme.jpg`
- [ ] `eventos/encuentro-mujeres-rurales.jpg`
- [ ] `eventos/huertas-para-la-vida.jpg`
- [ ] `eventos/mercado-saberes-sabores.jpg`
- [ ] `eventos/minga-comunitaria-arrayanes.jpg`
- [ ] `eventos/jornada-acompanamiento-psicosocial.jpg`

### Noticias (1200 × 675, máx. 200 KB cada una)

- [ ] `noticias/historia-red-mujer.jpg`
- [ ] `noticias/noticia-nuevas-comunidades.jpg`
- [ ] `noticias/actividad-reciente-taller-tejido.jpg`

### Logos e iconos

- [ ] `logo/entre-mujeres.svg` — logo principal
- [ ] `logo/entre-mujeres-blanco.svg` — versión clara para la barra verde
- [ ] `logo/red-mujer.svg`
- [ ] `app/favicon.ico` — 32 × 32
- [ ] `app/icon.png` — 512 × 512
- [ ] `app/apple-icon.png` — 180 × 180
- [ ] `app/opengraph-image.jpg` — 1200 × 630, para compartir el enlace

### Antes de dar por cerrado

- [ ] Ninguna foto se repite entre dos productos, comunidades, eventos o noticias
- [ ] Todos los nombres van en minúsculas, sin tildes y con guiones
- [ ] Todas las fotos son horizontales, ninguna vertical
- [ ] Ninguna foto pasa su peso máximo
- [ ] Ninguna foto muestra marcas, logos ni teléfonos de otras empresas
- [ ] Hay permiso de las personas que se reconocen en las fotos
- [ ] Cada foto viene con su frase de descripción
- [x] Se borraron `producto-2.jpg`, `producto-3.jpg` y `producto-4.jpg`
- [ ] Ya no queda ningún archivo marcado con 🟡 en esta lista

---

## 13. Resumen de cuánto falta

| Grupo | Archivos | Cómo está hoy |
| --- | --- | --- |
| Video de bienvenida | 1 | Publicado, **provisional** |
| Foto de bienvenida | 1 | Publicada, **provisional** |
| Productos | 6 | Publicadas, **provisionales** y en baja resolución |
| Comunidades | 6 | Faltan. Hay 5 de archivo sin renombrar |
| Eventos | 6 | Faltan. Hay 3 de archivo, repetidas entre sí |
| Noticias | 3 | Faltan |
| Logos | 3 | Faltan |
| Favicon e iconos | 3 | Falta. Es el de la plantilla |
| Imagen para compartir | 1 | Falta |
| **Total** | **30 archivos** | **8 publicados (provisionales), 22 por entregar** |

Mientras falten, la página **no se ve rota**: donde no hay foto aparece un recuadro
discreto con el icono de la categoría y el texto "Foto próximamente". Se pueden ir
subiendo de a poco, en cualquier orden.
