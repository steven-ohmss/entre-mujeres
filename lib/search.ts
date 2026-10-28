import { productTypes } from "@/lib/catalogos";
import { esPendiente } from "@/config/site";
import type { Community, Product, ProductType } from "@/types";

/**
 * Lo que el buscador necesita para trabajar. Antes se importaba aquí directamente; ahora
 * llega desde el servidor, porque el contenido vive en Supabase y no en un archivo. El
 * comportamiento de las funciones no cambió: solo de dónde reciben la lista.
 */
export interface Catalogo {
  comunidades: Community[];
  productos: Product[];
}

/**
 * Buscador de Entre mujeres (4.2).
 *
 * El problema que resuelve: antes, buscar "mermelada" llevaba otra vez a la sección
 * general de productos y había que volver a buscar ahí dentro. Aquí cada resultado sabe
 * exactamente a dónde va — a la página del producto o al perfil de la comunidad — y la
 * comparación tolera tildes, mayúsculas y plurales.
 */

export type TipoResultado = "producto" | "categoria" | "comunidad";

export interface Resultado {
  tipo: TipoResultado;
  id: string;
  titulo: string;
  /** Línea pequeña debajo del título: categoría, comunidad o ubicación. */
  detalle: string;
  href: string;
  /** Miniatura; null cuando todavía no hay foto real. */
  imagen: string | null;
  /** Categoría del producto, para elegir el icono cuando no hay miniatura. */
  categoria?: ProductType;
}

export interface GrupoResultados {
  tipo: TipoResultado;
  etiqueta: string;
  items: Resultado[];
}

const ETIQUETA_GRUPO: Record<TipoResultado, string> = {
  producto: "Productos",
  categoria: "Categorías",
  comunidad: "Comunidades",
};

const ORDEN_GRUPOS: TipoResultado[] = ["producto", "categoria", "comunidad"];

/** Mínimo de letras antes de empezar a sugerir. */
export const MINIMO_LETRAS = 2;

// --- Normalización ---------------------------------------------------------

/**
 * Deja el texto comparable: sin tildes, en minúsculas y sin espacios de sobra.
 * "Artesanía" y "artesania" terminan igual.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Plural castellano a singular, en la versión simple que necesita un buscador:
 * "mermeladas" → "mermelada", "artesanias" → "artesania", "panes" → "pan".
 * Las palabras muy cortas se dejan quietas para no romper "mes" o "pan".
 */
export function singularizar(palabra: string): string {
  if (palabra.length <= 3) return palabra;
  if (palabra.endsWith("ces")) return `${palabra.slice(0, -3)}z`;
  if (palabra.endsWith("es")) return palabra.slice(0, -2);
  if (palabra.endsWith("s")) return palabra.slice(0, -1);
  return palabra;
}

/** Normaliza y vuelve singular cada palabra, para comparar siempre contra la misma forma. */
export function raiz(texto: string): string {
  return normalizar(texto).split(" ").map(singularizar).join(" ");
}

// --- Puntaje ---------------------------------------------------------------

/**
 * Qué tan bien coincide un texto con lo que la persona escribió. Más alto es mejor;
 * 0 significa que no coincide. El orden importa: lo que empieza igual pesa más que lo
 * que apenas contiene las letras en la mitad.
 */
function puntaje(texto: string, consulta: string): number {
  const objetivo = raiz(texto);
  if (objetivo.length === 0) return 0;

  if (objetivo === consulta) return 100;
  if (objetivo.startsWith(consulta)) return 75;

  // Alguna palabra del texto empieza por lo buscado: "mermelada campesina" con "campe".
  const palabras = objetivo.split(" ");
  if (palabras.some((palabra) => palabra.startsWith(consulta))) return 50;

  if (objetivo.includes(consulta)) return 25;
  return 0;
}

/** El mejor puntaje entre varios campos, con un peso por campo para que el nombre mande. */
function mejorPuntaje(campos: { texto: string; peso: number }[], consulta: string): number {
  return campos.reduce((mejor, { texto, peso }) => {
    const valor = puntaje(texto, consulta) * peso;
    return valor > mejor ? valor : mejor;
  }, 0);
}

// --- Búsqueda --------------------------------------------------------------

function comunidadDe(producto: Product, comunidades: Community[]) {
  return comunidades.find((c) => c.id === producto.communityId);
}

export function hrefProducto(slug: string): string {
  return `/productos/${slug}`;
}

export function hrefComunidad(slug: string): string {
  return `/comunidades/${slug}`;
}

export function hrefCategoria(categoria: ProductType): string {
  return `/productos?categoria=${encodeURIComponent(categoria)}`;
}

export function hrefBusqueda(consulta: string): string {
  return `/productos?q=${encodeURIComponent(consulta.trim())}`;
}

/**
 * Resultados ordenados y agrupados por tipo. Cada uno trae su destino real: elegirlo
 * lleva al producto o a la comunidad, nunca de vuelta a la sección general.
 */
export function buscar(
  consulta: string,
  { comunidades, productos }: Catalogo,
  porGrupo = 5
): GrupoResultados[] {
  const termino = raiz(consulta);
  if (termino.length < MINIMO_LETRAS) return [];

  const conPuntaje: { resultado: Resultado; puntos: number }[] = [];

  for (const producto of productos) {
    const comunidad = comunidadDe(producto, comunidades);
    const puntos = mejorPuntaje(
      [
        { texto: producto.name, peso: 1 },
        { texto: producto.type, peso: 0.7 },
        { texto: comunidad?.name ?? "", peso: 0.6 },
        { texto: producto.description, peso: 0.3 },
      ],
      termino
    );
    if (puntos > 0) {
      conPuntaje.push({
        puntos,
        resultado: {
          tipo: "producto",
          id: producto.id,
          titulo: producto.name,
          detalle: comunidad ? `${producto.type} · ${comunidad.name}` : producto.type,
          href: hrefProducto(producto.slug),
          imagen: producto.images[0]?.src ?? null,
          categoria: producto.type,
        },
      });
    }
  }

  for (const categoria of productTypes) {
    const puntos = mejorPuntaje([{ texto: categoria, peso: 0.95 }], termino);
    if (puntos > 0) {
      const cuantos = productos.filter((p) => p.type === categoria).length;
      conPuntaje.push({
        puntos,
        resultado: {
          tipo: "categoria",
          id: `categoria-${categoria}`,
          titulo: categoria,
          detalle: cuantos === 1 ? "1 producto" : `${cuantos} productos`,
          href: hrefCategoria(categoria),
          imagen: null,
          categoria,
        },
      });
    }
  }

  for (const comunidad of comunidades) {
    const puntos = mejorPuntaje(
      [
        { texto: comunidad.name, peso: 1 },
        { texto: comunidad.ubicacion, peso: 0.6 },
        { texto: comunidad.localidad, peso: 0.6 },
        { texto: comunidad.category ?? "", peso: 0.5 },
        // Un texto todavía pendiente no entra al buscador: si no, buscar "pendiente"
        // devolvería justo las comunidades a las que les falta la descripción.
        { texto: esPendiente(comunidad.shortDescription) ? "" : comunidad.shortDescription, peso: 0.3 },
      ],
      termino
    );
    if (puntos > 0) {
      conPuntaje.push({
        puntos,
        resultado: {
          tipo: "comunidad",
          id: comunidad.id,
          titulo: comunidad.name,
          detalle: comunidad.ubicacion,
          href: hrefComunidad(comunidad.slug),
          imagen: comunidad.image.trim().length > 0 ? comunidad.image : null,
        },
      });
    }
  }

  conPuntaje.sort((a, b) => b.puntos - a.puntos || a.resultado.titulo.localeCompare(b.resultado.titulo));

  return ORDEN_GRUPOS.map((tipo) => ({
    tipo,
    etiqueta: ETIQUETA_GRUPO[tipo],
    items: conPuntaje
      .filter(({ resultado }) => resultado.tipo === tipo)
      .slice(0, porGrupo)
      .map(({ resultado }) => resultado),
  })).filter((grupo) => grupo.items.length > 0);
}

/** Todos los resultados en una sola lista, ya ordenados. */
export function resultadosPlanos(grupos: GrupoResultados[]): Resultado[] {
  return grupos.flatMap((grupo) => grupo.items);
}

/**
 * A dónde ir al presionar Enter: si hay un único resultado claro se abre directamente,
 * y si hay varios se muestra la lista ya filtrada (4.2).
 */
export function destinoAlEnviar(consulta: string, catalogo: Catalogo): string | null {
  const texto = consulta.trim();
  if (texto.length < MINIMO_LETRAS) return null;

  const todos = resultadosPlanos(buscar(texto, catalogo));
  if (todos.length === 0) return hrefBusqueda(texto);
  if (todos.length === 1) return todos[0].href;
  return hrefBusqueda(texto);
}

/** Productos que coinciden con el texto buscado, para la lista de /productos?q=… */
export function filtrarProductos(
  consulta: string,
  { comunidades, productos }: Catalogo
): Product[] {
  const termino = raiz(consulta);
  if (termino.length === 0) return productos;

  return productos
    .map((producto) => {
      const comunidad = comunidadDe(producto, comunidades);
      return {
        producto,
        puntos: mejorPuntaje(
          [
            { texto: producto.name, peso: 1 },
            { texto: producto.type, peso: 0.7 },
            { texto: comunidad?.name ?? "", peso: 0.6 },
            { texto: producto.description, peso: 0.3 },
            { texto: producto.features.join(" "), peso: 0.3 },
          ],
          termino
        ),
      };
    })
    .filter(({ puntos }) => puntos > 0)
    .sort((a, b) => b.puntos - a.puntos)
    .map(({ producto }) => producto);
}

/** Categorías sugeridas cuando una búsqueda no encontró nada (4.2). */
export function categoriasSugeridas(productos: Product[], cuantas = 4): ProductType[] {
  const conProductos = productTypes.filter((categoria) =>
    productos.some((p) => p.type === categoria)
  );
  return conProductos.slice(0, cuantas);
}
