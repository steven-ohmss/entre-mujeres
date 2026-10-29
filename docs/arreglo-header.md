# Arreglo: el header se desborda y se corre con la sesión iniciada

## El problema

En pantalla de computador (aprox. 1280 a 1920 px de ancho), cuando hay una sesión iniciada el menú tiene dos enlaces más ("Panel" y "Cerrar sesión") además del buscador y del botón "Sé parte". Ya no cabe:

- El botón "Sé parte" queda cortado en el borde derecho de la pantalla.
- El header se corre un instante al volver a la página de inicio, porque el estado de la sesión se resuelve en el navegador y, al aparecer esos enlaces, mueve el diseño.

## Qué hacer

1. **Un solo botón de cuenta.** "Panel" y "Cerrar sesión" pasan a vivir dentro de un único botón de cuenta (icono de persona) con un menú desplegable. Áreas táctiles de 48 px como mínimo, accesible con teclado y con etiqueta para lectores de pantalla.
2. **Mismo lugar sin sesión.** Cuando no hay sesión, el enlace "Iniciar sesión" ocupa ese mismo lugar y tamaño que el botón de cuenta.
3. **Sin saltos de diseño.** Reserva el espacio del botón de cuenta desde el primer render (mismo ancho con sesión y sin ella), para que el header no se mueva cuando se resuelve la sesión. Mientras se resuelve, que se vea un espacio neutro del mismo tamaño.
4. **El buscador no empuja al resto.** Hazlo más angosto o solo con icono en anchos medios, sin cambiar el diseño que ya funciona en pantallas grandes.
5. **Sin desbordamiento horizontal** en ningún ancho: la página no debe tener barra de desplazamiento horizontal.
6. **En celular** el menú de hamburguesa también debe mostrar las opciones de cuenta (Iniciar sesión, o Panel y Cerrar sesión) de forma clara.

## Cómo probarlo

- Con sesión y sin sesión, en anchos de 1280, 1366, 1440, 1920 y 360 px.
- Volviendo al inicio desde Productos, Mapa, Calendario y desde el panel (/admin), y mirando que el header no se mueva al cargar.
- Que "Sé parte" se vea completo en todos esos anchos.
- Que cerrar sesión desde el menú siga funcionando y devuelva al inicio.
- Que el menú de cuenta se pueda abrir y cerrar con el teclado (Enter, Escape).

## Al terminar

Haz commit, push y confirma que `npm run build` pasa y que el despliegue en Vercel termina bien. Dime qué cambió en el diseño del header para que lo revise.
