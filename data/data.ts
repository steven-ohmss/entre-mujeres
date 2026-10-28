import { PENDIENTE, contacto } from "@/config/site";
import type {
  Community,
  Product,
  CalendarEvent,
  NewsItem,
  MapMarker,
  ContactInfo,
  CommunityCategory,
  ProductType,
  Localidad,
  EventTypeInfo,
  Organizer,
} from "@/types";

export const communityCategories: CommunityCategory[] = [
  "Comunidades rurales",
  "Productoras",
  "Emprendimientos",
  "Servicios de apoyo",
];

export const productTypes: ProductType[] = [
  "Artesanías",
  "Turismo rural",
  "Ropa y textiles",
  "Souvenirs",
  "Educación y formación",
  "Gastronomía",
  "Otros",
];

export const localidades: Localidad[] = [
  "Usaquén",
  "Chapinero",
  "Santa Fe",
  "San Cristóbal",
  "Usme",
  "Bosa",
  "Kennedy",
  "Fontibón",
  "Engativá",
  "Suba",
  "Ciudad Bolívar",
  "Sumapaz",
];

export const eventTypes: EventTypeInfo[] = [
  { value: "Feria", label: "Ferias", color: "#E2507F", icon: "Store" },
  { value: "Taller", label: "Talleres", color: "#E89B3C", icon: "Wrench" },
  { value: "Reunión", label: "Reuniones", color: "#3D6B8B", icon: "Users" },
  {
    value: "Actividad comunitaria",
    label: "Actividades comunitarias",
    color: "#6E8B3D",
    icon: "HeartHandshake",
  },
  {
    value: "Evento de apoyo",
    label: "Eventos de apoyo",
    color: "#F2C94C",
    icon: "HandHeart",
  },
  { value: "Otro", label: "Otros", color: "#9A9A9A", icon: "MoreHorizontal" },
];

export const organizers: Organizer[] = ["Red Mujer", "Otras comunidades", "Aliados"];

export const communities: Community[] = [
  {
    id: "red-mujer",
    slug: "red-mujer",
    name: "Red Mujer",
    category: "Comunidades rurales",
    localidad: "Usme",
    ubicacion: "Granja Agroecológica El Salero II",
    shortDescription:
      "Organización que fomenta la responsabilidad social empresarial y la igualdad de derechos de mujeres, jóvenes, niños y adultos mayores en el territorio.",
    // PENDIENTE DE CONFIRMAR: estos dos textos (y el contacto general de config/site.ts)
    // hablan de la Vereda Arrayanes, mientras que la ubicación de arriba y el punto del
    // mapa son la Granja Agroecológica El Salero II. Falta que el equipo confirme si son
    // el mismo lugar llamado de dos maneras o si son dos sitios distintos, así que el
    // texto se deja tal como lo escribió Red Mujer (ver docs/datos-pendientes.md).
    whoWeAre:
      "Somos una organización cuyo objetivo es fomentar con Responsabilidad Social Empresarial e Igualdad de derechos de mujeres, jóvenes, niños y adultos mayores, generando espacios para el fortalecimiento de la productividad de la región.",
    whatWeDo:
      "Generamos espacios para el fortalecimiento de la productividad de la región y buscamos que la red crezca y se relacione con otras iniciativas del territorio, como Mujer y Tierra.",
    image: "/images/red-mujer.jpg",
    contact: {
      whatsapp: PENDIENTE,
      phone: PENDIENTE,
      email: PENDIENTE,
      social: PENDIENTE,
    },
    isExample: false,
  },
  {
    id: "manos-de-usme",
    slug: "manos-de-usme",
    name: "Manos de Usme",
    category: "Productoras",
    localidad: "Usme",
    ubicacion: "Parque La Fiscala, Usme",
    shortDescription:
      "Grupo de mujeres productoras de conservas y encurtidos artesanales a partir de cultivos de la zona rural de Usme.",
    whoWeAre:
      "Somos un grupo de mujeres campesinas que nos unimos para transformar los productos de nuestras huertas en alimentos artesanales.",
    whatWeDo:
      "Producimos conservas, encurtidos y mermeladas artesanales, y ofrecemos talleres de transformación de alimentos a otras mujeres del territorio.",
    image: "/images/comunidad-1.jpg",
    contact: {
      whatsapp: PENDIENTE,
      phone: PENDIENTE,
      email: PENDIENTE,
      social: PENDIENTE,
    },
    isExample: true,
  },
  {
    id: "raices-de-sumapaz",
    slug: "raices-de-sumapaz",
    name: "Raíces de Sumapaz",
    category: "Comunidades rurales",
    localidad: "Sumapaz",
    ubicacion: "Sumapaz – Vereda Betania",
    shortDescription:
      "Comunidad de mujeres campesinas dedicada a la agricultura sostenible y al turismo rural en el páramo de Sumapaz.",
    whoWeAre:
      "Somos mujeres del páramo de Sumapaz que trabajamos por cuidar nuestro territorio y compartirlo con quienes nos visitan.",
    whatWeDo:
      "Cultivamos de manera sostenible y organizamos recorridos de turismo rural y educación ambiental para grupos y familias.",
    image: "/images/comunidad-3.jpg",
    contact: {
      whatsapp: PENDIENTE,
      phone: PENDIENTE,
      email: PENDIENTE,
      social: PENDIENTE,
    },
    isExample: true,
  },
  {
    // De esta comunidad solo están confirmados el nombre y el lugar. La categoría, la
    // descripción, la foto y el contacto están PENDIENTES y no se inventan: `category`
    // se omite a propósito, así que no entra en ningún filtro concreto pero sí aparece
    // con "Todas las categorías" y en el mapa, y su página muestra
    // "Información próximamente" donde todavía no hay texto (ver docs/datos-pendientes.md).
    id: "granja-la-dorada",
    slug: "granja-la-dorada",
    name: "Granja La Dorada",
    localidad: "Usme",
    ubicacion: "Vereda El Hato, Usme",
    shortDescription: PENDIENTE,
    whoWeAre: PENDIENTE,
    whatWeDo: PENDIENTE,
    image: "",
    contact: {
      whatsapp: PENDIENTE,
      phone: PENDIENTE,
      email: PENDIENTE,
      social: PENDIENTE,
    },
    isExample: false,
  },
];

/**
 * Productos y servicios de la red.
 *
 * Sobre las fotos (4.4.6): cada producto muestra SU propia foto y ninguna se repite entre
 * productos distintos. Cada archivo se llama igual que el slug del producto, así que al
 * reemplazarlo basta con sobrescribir el archivo en public/images/productos/ sin tocar
 * este dato.
 *
 * Si un producto se queda sin foto, `images: []` no es un error: la interfaz muestra el
 * placeholder con el icono de la categoría y "Foto próximamente", que es preferible a
 * enseñar un producto que no es. Los seis productos de Red Mujer (los cinco yogures y el
 * queso) están así, a la espera de la foto real. La lista de lo que falta está en
 * docs/guia-material.md.
 *
 * PROVISIONAL: la foto de la mermelada campesina es material de archivo, no de la
 * comunidad, y está a baja resolución (451 px de ancho frente a los 1600 px que pide la
 * guía), así que se ve blanda en pantallas grandes. Se reemplazará por la foto real con
 * el mismo nombre de archivo.
 *
 * `availability` se omite mientras la comunidad no la confirme: la etiqueta simplemente
 * no se muestra, en vez de afirmar una disponibilidad que nadie verificó. La
 * `availability` y las `features` de los registros con isExample: true son valores de
 * ejemplo tomados de la descripción y la presentación; hay que confirmarlos.
 */
export const products: Product[] = [
  {
    id: "mermelada-campesina",
    slug: "mermelada-campesina",
    name: "Mermelada campesina",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Mermeladas elaboradas con fruta fresca de la vereda Arrayanes, sin conservantes artificiales.",
    presentation: "Frascos de vidrio de 300 g.",
    features: [
      "Frascos de vidrio de 300 g",
      "Fruta fresca de la vereda Arrayanes",
      "Sin conservantes artificiales",
    ],
    availability: "Disponible",
    images: [
      {
        src: "/images/productos/mermelada-campesina.jpg",
        alt: "Cinco frascos de vidrio con mermeladas de distintos colores, sobre rodajas de tronco, rodeados de higos, durazno, moras, frambuesas y hojas de fresa",
      },
    ],
    isExample: true,
  },
  // SIN CONECTAR, PENDIENTE DE CONFIRMAR (los cuatro yogures de fruta que siguen):
  // en public/images/productos/ ya están los archivos yogurt-artesanal-de-fresa.jpg,
  // -de-mora.jpg, -de-guanabana.jpg y -de-frutos-rojos.jpg, pero la botella que se ve en
  // las cuatro lleva impresa la marca "Delicias del Campo", no la de Red Mujer, y dice
  // "Yogur Artesanal" donde el dato dice "Yogurt artesanal". No se publican hasta saber
  // si esa es la marca comercial de Red Mujer o si son fotos de otra empresa, porque ya
  // hubo que borrar una foto de yogures por traer la marca de un tercero (ver la sección
  // 10 de docs/guia-material.md). Mientras tanto sale "Foto próximamente", que es
  // preferible a publicar la marca de alguien más.
  {
    id: "yogurt-artesanal-de-fresa",
    slug: "yogurt-artesanal-de-fresa",
    name: "Yogurt artesanal de fresa",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Yogurt 100% artesanal de fresa, cremoso y naturalmente delicioso. Elaborado con 100% leche sin agua ni conservantes añadidos.",
    presentation: "1 litro.",
    features: [],
    images: [],
    isExample: false,
  },
  {
    id: "yogurt-artesanal-de-mora",
    slug: "yogurt-artesanal-de-mora",
    name: "Yogurt artesanal de mora",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Yogurt 100% artesanal de mora, cremoso y naturalmente delicioso. Elaborado con 100% leche sin agua ni conservantes añadidos.",
    presentation: "1 litro.",
    features: [],
    images: [],
    isExample: false,
  },
  {
    id: "yogurt-artesanal-de-guanabana",
    slug: "yogurt-artesanal-de-guanabana",
    name: "Yogurt artesanal de guanábana",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Yogurt 100% artesanal de guanábana, cremoso y naturalmente delicioso. Elaborado con 100% leche sin agua ni conservantes añadidos.",
    presentation: "1 litro.",
    features: [],
    images: [],
    isExample: false,
  },
  {
    id: "yogurt-artesanal-de-frutos-rojos",
    slug: "yogurt-artesanal-de-frutos-rojos",
    name: "Yogurt artesanal de frutos rojos",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Yogurt 100% artesanal de frutos rojos, con arándanos, fresa y mora, cremoso y naturalmente delicioso. Elaborado con 100% leche sin agua ni conservantes añadidos.",
    presentation: "1 litro.",
    features: [],
    images: [],
    isExample: false,
  },
  {
    id: "yogurt-griego",
    slug: "yogurt-griego",
    name: "Yogurt griego",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Yogurt griego 100% artesanal, cremoso y naturalmente delicioso. Elaborado con 100% leche sin agua ni conservantes añadidos.",
    presentation: "1 litro.",
    features: [],
    images: [
      {
        src: "/images/productos/yogurt-griego.jpg",
        alt: "Pote blanco de yogurt griego natural de Red Mujer sobre una mesa de madera, junto a un bol de yogurt con fresas y arándanos, con el campo al fondo",
      },
    ],
    isExample: false,
  },
  {
    id: "queso-campesino",
    slug: "queso-campesino",
    name: "Queso campesino",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "El auténtico sabor del campo en cada bocado. Nuestro queso campesino natural, elaborado artesanalmente con leche fresca, ofrece una textura suave y firme, con el toque justo de sal. Fresco, versátil e ideal para disfrutar en cualquier momento del día.",
    presentation: "500 gramos.",
    features: [],
    images: [
      {
        src: "/images/productos/queso-campesino.jpg",
        alt: "Queso campesino redondo con la etiqueta de Red Mujer, sobre una tabla de madera junto a cubos de queso cortados y una jarra de leche, con el campo al fondo",
      },
    ],
    isExample: false,
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: "feria-campesina-usme",
    title: "Feria Campesina de Usme",
    date: "2026-10-10",
    startTime: "8:00 a.m.",
    endTime: "4:00 p.m.",
    location: "Parque Principal de Usme, Bogotá D.C.",
    localidad: "Usme",
    type: "Feria",
    organizer: "Red Mujer",
    communityId: "red-mujer",
    description: "Productos locales, gastronomía, artesanías y mucho más. ¡Te esperamos!",
    image: "/images/evento-1.jpg",
    isExample: true,
  },
  {
    id: "minga-comunitaria-arrayanes",
    title: "Minga comunitaria en la vereda Arrayanes",
    date: "2026-11-21",
    startTime: "8:00 a.m.",
    endTime: "1:00 p.m.",
    location: "Vereda Arrayanes, Usme",
    localidad: "Usme",
    type: "Actividad comunitaria",
    organizer: "Red Mujer",
    communityId: "red-mujer",
    description:
      "Jornada comunitaria de siembra y cuidado de la huerta colectiva de la vereda Arrayanes.",
    image: "/images/evento-2.jpg",
    isExample: true,
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "historia-red-mujer",
    type: "Historia",
    title: "El origen de Red Mujer en la vereda Arrayanes",
    date: "2026-08-14",
    summary:
      "Cómo un grupo de mujeres de la zona rural de Usme se organizó para fortalecer la productividad de su territorio.",
    fullText:
      "Este es un texto de ejemplo. Aquí se contará, con la voz de las propias mujeres de Red Mujer, cómo nació la organización en la vereda Arrayanes y qué las motivó a trabajar juntas por su territorio.",
    image: "/images/evento-1.jpg",
    isExample: true,
  },
];

export const mapMarkers: MapMarker[] = [
  // Coordenadas confirmadas por el equipo. Las tres caen dentro de Usme según la capa de
  // localidades de public/data/localidades-bogota.geojson, que es lo que verifica
  // `node --import ./scripts/alias-arroba.mjs scripts/verificar-marcadores.mjs`.
  { id: "marker-red-mujer", communityId: "red-mujer", lat: 4.372639, lng: -74.1414653 },
  { id: "marker-manos-de-usme", communityId: "manos-de-usme", lat: 4.5321262, lng: -74.1097545 },
  {
    id: "marker-granja-la-dorada",
    communityId: "granja-la-dorada",
    lat: 4.3829212,
    lng: -74.1659716,
  },
  // TODO: reemplazar por coordenadas reales
  { id: "marker-raices-de-sumapaz", communityId: "raices-de-sumapaz", lat: 4.12, lng: -74.23 },
];

/**
 * Contacto general de Red Mujer. El dato real vive en config/site.ts, que es el único
 * archivo que el equipo tiene que tocar para actualizarlo.
 */
export const contactInfo: ContactInfo = {
  email: contacto.correo,
  phone: contacto.telefono,
  social: contacto.instagram,
};

export const localidadesConOtro = [...localidades, "Otro municipio de Cundinamarca"] as const;

export const initiativeTypes: CommunityCategory[] = communityCategories;
