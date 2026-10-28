# Datos pendientes de confirmar con el equipo

Esta lista es lo que la página **todavía no sabe** y que no se puede inventar. Mientras
falte un dato, la interfaz muestra un marcador honesto ("Información próximamente",
"Foto próximamente") en vez de rellenarlo con algo que nadie verificó.

Las fotos y el video van aparte, en [`guia-material.md`](./guia-material.md).

---

## 1. Red Mujer: ¿Vereda Arrayanes y El Salero II son el mismo lugar?

**Esto es lo que hay que resolver primero**, porque hoy la página dice las dos cosas.

| Dónde | Qué dice hoy |
| --- | --- |
| Ubicación de la comunidad y punto del mapa | **Granja Agroecológica El Salero II** (lat 4.372639, lng -74.1414653) |
| "Somos Red Mujer" y "Dónde estamos" | **Vereda Arrayanes** |
| Contacto general (`config/site.ts`) | **Usme – Vereda Arrayanes** |
| Descripción de la mermelada campesina | "fruta fresca de la **vereda Arrayanes**" |
| Evento "Minga comunitaria en la vereda Arrayanes" | **Vereda Arrayanes** |
| Noticia "El origen de Red Mujer en la vereda Arrayanes" | **Vereda Arrayanes** |

La coordenada nueva de El Salero II la entregó el equipo y cae dentro de Usme, igual
que la vereda Arrayanes, así que las dos son compatibles con la localidad. Falta saber
cuál de estas tres es:

1. **Son el mismo lugar con dos nombres.** Entonces hay que elegir cómo se va a llamar
   en toda la página y cambiarlo en los seis sitios de la tabla.
2. **Son dos lugares distintos y la sede es El Salero II.** Entonces hay que reescribir
   los textos que dicen Arrayanes.
3. **Son dos lugares distintos y los dos se usan.** Entonces hay que decir cuál es la
   sede (la del mapa) y dejar el otro solo donde corresponda.

Hasta que se confirme, **los textos se dejaron tal como los escribió Red Mujer**: no se
tocó ni "Somos Red Mujer" ni "Dónde estamos". Solo se actualizaron la ubicación y el
punto del mapa, que son los datos que el equipo entregó explícitamente.

---

## 2. Granja La Dorada: falta casi todo

De esta comunidad solo están confirmados el nombre y el lugar (Vereda El Hato, Usme,
lat 4.3829212, lng -74.1659716, que cae en Usme).

| Dato | Estado | Qué pasa mientras falte |
| --- | --- | --- |
| Categoría | **Pendiente** | No aparece bajo ninguna categoría concreta del filtro, pero sí con "Todas las categorías" y en el mapa |
| Descripción corta | **Pendiente** | La ficha del mapa dice "Información próximamente" |
| Su historia / Qué hacen | **Pendiente** | Su página dice "Información próximamente" |
| Foto | **Pendiente** | Se ve el recuadro de "Foto próximamente" |
| WhatsApp, teléfono, correo, redes | **Pendiente** | No se muestra el botón de contacto |
| Productos | **Pendiente** | Su página dice "Todavía no hemos publicado sus productos" |

La categoría tiene que ser una de estas cuatro: Comunidades rurales, Productoras,
Emprendimientos o Servicios de apoyo.

---

## 3. Los seis productos nuevos de Red Mujer

Son los cinco yogures (fresa, mora, guanábana, frutos rojos y griego) y el queso
campesino. El nombre, la descripción y la presentación están confirmados.

| Dato | Estado | Qué pasa mientras falte |
| --- | --- | --- |
| Disponibilidad | **Pendiente** | No se muestra la etiqueta. Hay que decir si cada uno es "Disponible", "Por encargo" o "Por temporada" |
| Características | **Pendiente** | La página muestra solo la presentación (1 litro, o 500 gramos) |
| Precio | No se publica | La página no muestra precios: la gente pregunta por WhatsApp |

### 3.1 Las dos marcas: resuelto

Las seis fotos muestran dos marcas distintas, y **las dos son de Red Mujer**
(confirmado por el equipo). Las siete fotos de producto están publicadas.

| Foto | Marca en la etiqueta |
| --- | --- |
| Yogurt de fresa, mora, guanábana y frutos rojos | **Delicias del Campo**, la marca comercial de los yogures de Red Mujer |
| Yogurt griego | **Red Mujer** ("Del campo a tu mesa") |
| Queso campesino | **Red Mujer** |

Queda una diferencia menor sin resolver: las cuatro botellas dicen **"Yogur Artesanal"**
(sin t) en la etiqueta, mientras que el nombre del producto en la página es **"Yogurt
artesanal"**. Hay que decidir cuál de las dos grafías se usa, y si conviene que el
nombre en la página mencione la marca Delicias del Campo, que hoy no aparece en ningún
texto: solo se ve en la foto.

### 3.2 El yogurt griego: ¿150 g o 1 litro?

**Este es el pendiente que queda de los productos.** El dato de la página dice
**"Presentación: 1 litro"**, pero la etiqueta del pote que se ve en la foto publicada
dice **"CONT. NETO 150 g"**. Una de las dos está mal, y hoy la página muestra las dos a
la vez: el texto dice un litro y la foto, al lado, dice 150 gramos.

El queso campesino no tiene este problema: el dato dice 500 gramos y la etiqueta también.

De los cuatro yogures de fruta no se puede verificar, porque vienen en botella de vidrio
y no se alcanza a leer el contenido neto en la foto.

---

## 4. Contacto general de Red Mujer

Todo el bloque de contacto está pendiente en `config/site.ts`: WhatsApp, teléfono,
correo, Instagram y Facebook. Mientras falte, los botones no se muestran en vez de
llevar a un enlace roto.

Es el dato que más falta hace: sin WhatsApp, quien entra a la página no tiene cómo
preguntar por un producto.

---

## 5. Datos de ejemplo que hay que confirmar o quitar

Estos registros llevan la marca `is_example` en true en Supabase, es decir que su
contenido se escribió como relleno para poder ver la página armada, **no lo entregó la
comunidad**:

- **Manos de Usme** y **Raíces de Sumapaz**: toda su descripción.
- **Mermelada campesina**: su disponibilidad y sus características.
- Los **2 eventos** del calendario y la **noticia** del origen de Red Mujer.

Hay que confirmarlos con cada comunidad o sacarlos de la página.

---

## 6. Coordenadas que faltan

**Raíces de Sumapaz** sigue con una coordenada aproximada (lat 4.12, lng -74.23). Cae
dentro de Sumapaz, así que el punto no está mal puesto en el mapa, pero no es la
ubicación real de la comunidad.

Cada vez que se agregue o se corrija una coordenada conviene correr:

```
node --import ./scripts/alias-arroba.mjs scripts/verificar-marcadores.mjs
```

Compara cada punto contra la capa de localidades de Bogotá y avisa si alguno cae en una
localidad distinta de la que declara su comunidad.
