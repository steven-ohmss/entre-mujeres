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

## Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com) conectando este repositorio de GitHub. No requiere variables de entorno.
