# Guía del material visual de Entre mujeres

Esta guía es para el equipo de Red Mujer. **No hay que saber programar para usarla.**

Dice exactamente qué fotos, video, logos e iconos necesita la página, cómo se debe
llamar cada archivo y en qué carpeta va. Si entregas los archivos con el nombre que
aparece aquí, quien los suba solo tiene que copiarlos a su carpeta y la página los
muestra sola.

Al final hay una **lista de chequeo** para ir marcando lo que ya está listo.

Los datos que faltan y que no son fotos (categorías, descripciones, disponibilidad,
contacto, y la duda de si la Vereda Arrayanes y El Salero II son el mismo lugar) están
en [`datos-pendientes.md`](./datos-pendientes.md).

---

## 0. Material provisional que hay que reemplazar

> **Hay 5 archivos publicados que todavía no son definitivos.** Están conectados y se
> ven en la página, pero ninguno cumple del todo. Esta es la lista para no olvidarlos.

| Archivo | Por qué es provisional |
| --- | --- |
| `public/video/inicio-portada.mp4` | Material de archivo. Técnicamente cumple (4,08 MB, 20 s, sin sonido), pero no muestra Bogotá ni Cundinamarca |
| `public/images/inicio/portada.jpg` | Un camino de tierra entre cultivos al atardecer. No aparece ninguna mujer y el paisaje no es el andino del territorio |
| `public/images/productos/mermelada-campesina.jpg` | De archivo · 451 × 338 px, falta resolución |
| `public/images/productos/yogurt-griego.jpg` | Lleva la marca de Red Mujer, pero son 588 × 440 px y falta resolución. Además la etiqueta dice **150 g** y el dato de la página dice 1 litro (ver `datos-pendientes.md`) |
| `public/images/productos/queso-campesino.jpg` | Lleva la marca de Red Mujer y los 500 g coinciden, pero son 588 × 440 px y falta resolución |

**Cómo se reemplazan: solo hay que sobrescribir el archivo, con el mismo nombre y en la
misma carpeta.** No hay que avisar a nadie ni tocar el código. Por eso los nombres
importan tanto.

Las tres fotos de producto están muy por debajo del ancho que pide esta guía (1600 px).
En la página del producto la foto se muestra a unos 720 px de ancho, que en una pantalla
moderna son 1440 px reales: una imagen de 588 px se estira dos veces y media y se ve
borrosa. Como pesan entre 44 y 78 KB, hay muchísimo margen para subirlas más grandes sin
acercarse al límite de 250 KB.

> **Cuatro fotos entregadas quedaron SIN publicar.** Son las de los yogures de fresa,
> mora, guanábana y frutos rojos. Los archivos están en `public/images/productos/` con
> el nombre correcto, pero la botella que se ve en las cuatro lleva impresa la marca
> **"Delicias del Campo"**, no la de Red Mujer. Hasta saber si esa es la marca comercial
> de Red Mujer o si son fotos de otra empresa, los cuatro productos siguen mostrando
> "Foto próximamente". Ya hubo que borrar una foto de yogures por este mismo motivo
> (ver la sección 10).

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
| Yogurt artesanal de guanábana | `yogurt-artesanal-de-guanabana.jpg` |

**Buena noticia: esos nombres ya existen.** Cada producto y cada comunidad ya tiene su
nombre corto dentro de la página. Por ejemplo, la comunidad Raíces de Sumapaz vive en
`entre-mujeres.vercel.app/comunidades/raices-de-sumapaz`. Lo que aparece en la
dirección después de la última barra es el nombre que debe llevar el archivo. No hay
que inventar nada: en las tablas de abajo está escrito uno por uno.

### Lo que NO sirve como nombre

- `Foto 1.jpg`, `IMG_20260312.jpg`, `WhatsApp Image 2026-03-12 at 10.14.jpg`
- `Mermelada Campesina.JPG` (mayúsculas y espacio)
- `raíces_de_sumapaz.jpg` (tilde y guion bajo)
- `producto-1.jpg`, `comunidad-1.jpg` (no dicen de qué son)

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

Hoy varias fotos están sueltas en `public/images/` con nombres genéricos
(`comunidad-1.jpg`, `evento-2.jpg`). La propuesta de cómo quedaría cada una está en la
sección 10.

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

Se necesitan **4 fotos, una por comunidad**. Cada foto aparece en tres lugares: en la
tarjeta de la comunidad, en la ventanita que se abre al tocar su punto en el mapa, y
grande en la parte de arriba de su página propia.

**Qué debe mostrar una foto de comunidad.** A las mujeres de esa comunidad, en su lugar
de trabajo y haciendo lo que hacen. Un grupo trabajando funciona mejor que un retrato
posado. Que se vea el entorno real (la huerta, el taller, el puesto en la plaza),
porque es lo que cuenta la historia.

**Todas:** 1600 × 900 px · JPG · **máximo 250 KB**

| Comunidad | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| Red Mujer | `public/images/comunidades/red-mujer.jpg` | Mujeres de Red Mujer reunidas en la Granja Agroecológica El Salero II, Usme. Es la más importante de las cuatro: también se usa grande en la sección "Nosotras" |
| Manos de Usme | `public/images/comunidades/manos-de-usme.jpg` | Las productoras preparando conservas y encurtidos, o en la huerta de donde salen los frutos. Están en el Parque La Fiscala, Usme |
| Raíces de Sumapaz | `public/images/comunidades/raices-de-sumapaz.jpg` | Mujeres campesinas en el páramo de Sumapaz, con el cultivo o el paisaje del páramo |
| Granja La Dorada | `public/images/comunidades/granja-la-dorada.jpg` | Las mujeres de la granja en la Vereda El Hato, Usme, trabajando. De esta comunidad todavía no sabemos a qué se dedica, así que **conviene esperar a que nos cuenten** antes de pedir la foto: hoy su página muestra "Información próximamente" |

---

## 6. Productos

Se necesitan **7 fotos, una por producto como mínimo**. Aparecen en la tarjeta del
producto, en su página propia y como miniatura en los resultados del buscador.

> **Regla que no se puede romper: cada producto lleva SU propia foto.**
>
> Ninguna foto se repite entre dos productos distintos. Si alguien busca "queso", tiene
> que ver ese queso y no un yogurt. Mientras falte la foto, el producto muestra el
> cartel "Foto próximamente": es mejor eso que mostrar un producto que no es.

> **Estado de los seis productos de Red Mujer:** el yogurt griego y el queso campesino
> ya tienen su foto publicada, con la marca de Red Mujer en la etiqueta. Los cuatro
> yogures de fruta siguen con el cartel "Foto próximamente", porque la foto que llegó
> lleva otra marca (ver la sección 0).

**Qué debe mostrar una foto de producto.** El producto solo, bien iluminado, sobre un
fondo sencillo que no distraiga: una mesa de madera, una tela lisa. Luz de día, nunca
flash directo. Que se entienda el tamaño: si es un frasco, poner algo al lado que sirva
de referencia. Sin logos ni teléfonos de otras marcas a la vista.

**Todas:** 1600 × 1200 px (4:3) · JPG · **máximo 250 KB**

| Producto | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| Mermelada campesina | `public/images/productos/mermelada-campesina.jpg` | El frasco de vidrio de 300 g de mermelada, si se puede con la fruta fresca al lado |
| Yogurt artesanal de fresa | `public/images/productos/yogurt-artesanal-de-fresa.jpg` | ⚠️ Entregada pero **sin publicar**: la botella lleva la marca "Delicias del Campo". Hace falta la del envase de Red Mujer, con fresas frescas al lado |
| Yogurt artesanal de mora | `public/images/productos/yogurt-artesanal-de-mora.jpg` | ⚠️ Entregada pero **sin publicar**, mismo motivo. Hace falta la del envase de Red Mujer, con moras frescas al lado |
| Yogurt artesanal de guanábana | `public/images/productos/yogurt-artesanal-de-guanabana.jpg` | ⚠️ Entregada pero **sin publicar**, mismo motivo. Hace falta la del envase de Red Mujer, con la guanábana al lado (entera o partida) |
| Yogurt artesanal de frutos rojos | `public/images/productos/yogurt-artesanal-de-frutos-rojos.jpg` | ⚠️ Entregada pero **sin publicar**, mismo motivo. Hace falta la del envase de Red Mujer, con arándanos, fresas y moras al lado |
| Yogurt griego | `public/images/productos/yogurt-griego.jpg` | ✅ Publicada. El pote blanco de Red Mujer junto a un bol de yogurt con fresas y arándanos |
| Queso campesino | `public/images/productos/queso-campesino.jpg` | ✅ Publicada. El queso redondo de Red Mujer con los cubos cortados al lado, que dejan ver la textura |

> **Ojo con los cinco yogures: los envases se parecen entre sí.** Si las cinco fotos
> salen iguales, en la lista de productos no se va a poder distinguir un sabor de otro.
> Por eso cada una pide la fruta al lado: es lo que diferencia una foto de la
> siguiente. Vale la pena hacerlas todas en la misma sesión, con la misma luz y el
> mismo fondo, para que se vean como una familia.

### Si un producto tiene varias fotos

Se pueden entregar varias. La primera es la que se ve en la tarjeta. Se numeran así:

```
mermelada-campesina.jpg      ← esta es la principal
mermelada-campesina-2.jpg
mermelada-campesina-3.jpg
```

---

## 7. Eventos del calendario

Se necesitan **2 fotos, una por evento**. Aparecen en el banner deslizable del inicio,
como miniatura en la lista del calendario y grande al abrir el evento.

> Hoy estos 2 eventos usan 2 fotos de archivo, y una de ellas se usa además en la
> noticia del origen de Red Mujer. Por eso se repite una imagen al bajar por la página.

**Todas:** 1200 × 675 px (16:9) · JPG · **máximo 200 KB**

| Evento | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| Feria Campesina de Usme | `public/images/eventos/feria-campesina-usme.jpg` | Los puestos de la feria con productos y gente comprando |
| Minga comunitaria en la vereda Arrayanes | `public/images/eventos/minga-comunitaria-arrayanes.jpg` | La minga: la comunidad trabajando junta en la vereda |

Si de un evento todavía no hay foto porque aún no ha pasado, sirve una foto de la
edición anterior o del lugar donde se va a hacer.

---

## 8. Noticias e historias

Se necesita **1 foto**, una por publicación.

**Todas:** 1200 × 675 px (16:9) · JPG · **máximo 200 KB**

| Publicación | Nombre del archivo | Qué debe mostrar |
| --- | --- | --- |
| El origen de Red Mujer en la vereda Arrayanes | `public/images/noticias/historia-red-mujer.jpg` | Las fundadoras, o el lugar donde empezó todo en la vereda Arrayanes. Si hay una foto de archivo de los primeros años, mejor |

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

La pantalla de bienvenida, la mermelada campesina, el yogurt griego y el queso campesino
ya tienen su archivo en la carpeta correcta y con el nombre correcto, y están conectados
a la página. Siguen siendo provisionales: la lista está en la sección 0.

Las fotos de los cuatro yogures de fruta también están en su carpeta y con el nombre
correcto, pero **no están conectadas ni subidas al repositorio**, porque llevan la marca
de otra empresa. Los archivos se dejaron en el computador de quien los entregó para no
perderlos mientras se aclara: todo lo que se copia a `public/` queda accesible en
internet, aunque ninguna página lo muestre.

Se borraron tres fotos que no se podían publicar:

| Archivo borrado | Por qué |
| --- | --- |
| `producto-2.jpg` | Frascos de miel y panal. En la red no hay ningún producto de miel |
| `producto-3.jpg` | Materas biodegradables, que tampoco son un producto de la red, y la foto traía texto de publicidad incrustado ("Material natural", "Biodegradable") |
| `producto-4.jpg` | Yogures con la marca, la página web y el teléfono de otra empresa (BBG) impresos en la etiqueta. No es de la red y no se debía publicar |

Y se borraron estas, porque el producto, la comunidad o el evento al que acompañaban ya
no está en la página:

| Archivo borrado | Por qué |
| --- | --- |
| `productos/conservas-de-la-huerta.jpg` | El producto salió de la página |
| `productos/bolsos-tejidos-a-mano.jpg` | El producto salió de la página |
| `productos/ruanas-de-lana.jpg` | El producto salió de la página |
| `productos/recorrido-turismo-rural-sumapaz.jpg` | El producto salió de la página |
| `productos/taller-formacion-emprendimiento.jpg` | El producto salió de la página |
| `producto-1.jpg` | Era la foto de las ruanas antes de mudarse a su carpeta |
| `comunidad-2.jpg` | Era de Telar y Tierra, que salió de la página |
| `comunidad-4.jpg` | Era de Semillas de Bosa, que salió de la página |
| `evento-3.jpg` | Acompañaba dos eventos y una noticia que salieron de la página |

### Pendiente de renombrar

Estas fotos siguen sueltas en `public/images/` con nombres genéricos. Son de archivo,
no de las comunidades. Se renombrarán cuando lleguen las fotos reales, para no hacer el
trabajo dos veces:

| Archivo hoy | Pasaría a llamarse | Nota |
| --- | --- | --- |
| `red-mujer.jpg` | `comunidades/red-mujer.jpg` | Reemplazar por una foto real de Red Mujer |
| `comunidad-1.jpg` | `comunidades/manos-de-usme.jpg` | Reemplazar por foto real |
| `comunidad-3.jpg` | `comunidades/raices-de-sumapaz.jpg` | Reemplazar por foto real |
| `evento-1.jpg` | `eventos/feria-campesina-usme.jpg` | Hoy se usa en 1 evento y 1 noticia a la vez |
| `evento-2.jpg` | `eventos/minga-comunitaria-arrayanes.jpg` | Reemplazar por foto real |

Un archivo quedó sin uso y se borrará cuando llegue su reemplazo: `hero-mujeres.jpg`,
que era la portada anterior.

Faltan por completo, sin nada que renombrar: los 4 yogures de fruta, la foto de Granja
La Dorada, la noticia, los logos, el favicon y la imagen para compartir.

---

## 11. Dos cosas que hay que entregar junto con cada foto

### 11.1 Permiso de las personas que salen

Las fotos van a una página pública en internet. **Antes de entregar una foto donde se
reconozca a alguien, hay que tener su permiso.** Hay que pedirlo siempre, incluso para
las fotos de grupo en la huerta o en la feria.

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

**Dónde queda escrita esa frase.** Cada foto de producto guarda la suya al lado de la
imagen, en `data/data.ts`. Si llega una foto nueva sin su frase, quien la suba tiene que
escribirla mirando la imagen: una foto sin descripción deja por fuera a quien usa lector
de pantalla. Y si se reemplaza una foto por otra distinta, **hay que reescribir la
frase**, porque la vieja ya no describe lo que se ve.

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
- [ ] `comunidades/raices-de-sumapaz.jpg`
- [ ] `comunidades/granja-la-dorada.jpg` — esperar a que nos cuenten a qué se dedican

### Productos (1600 × 1200, máx. 250 KB cada una)

- [x] 🟡 `productos/mermelada-campesina.jpg` — 451 × 338, falta resolución
- [ ] `productos/yogurt-artesanal-de-fresa.jpg` — ⚠️ entregada con otra marca, sin publicar
- [ ] `productos/yogurt-artesanal-de-mora.jpg` — ⚠️ entregada con otra marca, sin publicar
- [ ] `productos/yogurt-artesanal-de-guanabana.jpg` — ⚠️ entregada con otra marca, sin publicar
- [ ] `productos/yogurt-artesanal-de-frutos-rojos.jpg` — ⚠️ entregada con otra marca, sin publicar
- [x] 🟡 `productos/yogurt-griego.jpg` — 588 × 440, falta resolución; la etiqueta dice 150 g
- [x] 🟡 `productos/queso-campesino.jpg` — 588 × 440, falta resolución

### Eventos (1200 × 675, máx. 200 KB cada una)

- [ ] `eventos/feria-campesina-usme.jpg`
- [ ] `eventos/minga-comunitaria-arrayanes.jpg`

### Noticias (1200 × 675, máx. 200 KB cada una)

- [ ] `noticias/historia-red-mujer.jpg`

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
| Productos | 7 | 3 publicadas, **provisionales** y en baja resolución. Faltan las de los 4 yogures de fruta: llegaron, pero con la marca de otra empresa |
| Comunidades | 4 | Faltan. Hay 3 de archivo sin renombrar |
| Eventos | 2 | Faltan. Hay 2 de archivo, una compartida con la noticia |
| Noticias | 1 | Falta |
| Logos | 3 | Faltan |
| Favicon e iconos | 3 | Falta. Es el de la plantilla |
| Imagen para compartir | 1 | Falta |
| **Total** | **23 archivos** | **5 publicados (provisionales), 18 por entregar** |

Mientras falten, la página **no se ve rota**: donde no hay foto aparece un recuadro
discreto con el icono de la categoría y el texto "Foto próximamente". Se pueden ir
subiendo de a poco, en cualquier orden.
