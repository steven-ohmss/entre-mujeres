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
    ubicacion: "Usme – Vereda Arrayanes",
    shortDescription:
      "Organización que fomenta la responsabilidad social empresarial y la igualdad de derechos de mujeres, jóvenes, niños y adultos mayores en el territorio.",
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
    ubicacion: "Usme – Barrio La Fiscala",
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
    id: "telar-y-tierra",
    slug: "telar-y-tierra",
    name: "Telar y Tierra",
    category: "Emprendimientos",
    localidad: "Ciudad Bolívar",
    ubicacion: "Ciudad Bolívar – Vereda Quiba",
    shortDescription:
      "Emprendimiento textil de mujeres que elaboran prendas y accesorios tejidos a mano con fibras naturales.",
    whoWeAre:
      "Somos un colectivo de mujeres tejedoras que aprendimos el oficio de nuestras madres y abuelas.",
    whatWeDo:
      "Diseñamos y confeccionamos prendas, bolsos y accesorios tejidos a mano, y dictamos talleres de tejido para jóvenes del territorio.",
    image: "/images/comunidad-2.jpg",
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
    id: "semillas-de-bosa",
    slug: "semillas-de-bosa",
    name: "Semillas de Bosa",
    category: "Servicios de apoyo",
    localidad: "Bosa",
    ubicacion: "Bosa – Barrio San Bernardino",
    shortDescription:
      "Colectivo que ofrece acompañamiento psicosocial y formación en emprendimiento a mujeres cabeza de hogar.",
    whoWeAre:
      "Somos un equipo de mujeres profesionales y lideresas comunitarias comprometidas con el bienestar de otras mujeres.",
    whatWeDo:
      "Brindamos acompañamiento psicosocial, formación en emprendimiento y espacios de escucha para mujeres cabeza de hogar.",
    image: "/images/comunidad-4.jpg",
    contact: {
      whatsapp: PENDIENTE,
      phone: PENDIENTE,
      email: PENDIENTE,
      social: PENDIENTE,
    },
    isExample: true,
  },
  {
    id: "sabores-de-la-concordia",
    slug: "sabores-de-la-concordia",
    name: "Sabores de la Concordia",
    category: "Productoras",
    localidad: "Santa Fe",
    ubicacion: "Santa Fe – La Concordia",
    shortDescription:
      "Red de vendedoras de comida tradicional y productos campesinos en la plaza de mercado de La Concordia.",
    whoWeAre:
      "Somos vendedoras y cocineras que llevamos años ofreciendo sabores tradicionales del campo en la plaza de mercado.",
    whatWeDo:
      "Preparamos y vendemos comida tradicional, y participamos en ferias y mercados campesinos por toda la ciudad.",
    // La foto que estaba aquí era de yogures con la marca y el teléfono de otra empresa
    // impresos en la etiqueta: no era de esta comunidad y no se debía publicar, así que
    // se borró del repositorio. Vacío = la interfaz muestra "Foto próximamente", a la
    // espera de la foto real (ver docs/guia-material.md).
    image: "",
    contact: {
      whatsapp: PENDIENTE,
      phone: PENDIENTE,
      email: PENDIENTE,
      social: PENDIENTE,
    },
    isExample: true,
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
 * PROVISIONAL: las seis fotos de abajo son material de archivo entregado como relleno,
 * no fotos de las comunidades, y están a baja resolución (entre 440 y 588 px de ancho,
 * frente a los 1600 px que pide la guía), así que se ven blandas en pantallas grandes.
 * Se reemplazarán por las fotos reales con el mismo nombre de archivo. La lista completa
 * de lo que falta está en docs/guia-material.md.
 *
 * Si un producto se queda sin foto, `images: []` no es un error: la interfaz muestra el
 * placeholder con el icono de la categoría y "Foto próximamente", que es preferible a
 * enseñar un producto que no es.
 *
 * `availability` y `features` de los registros con isExample: true son valores de ejemplo
 * tomados de la descripción y la presentación; hay que confirmarlos con cada comunidad.
 */
export const products: Product[] = [
  {
    id: "conservas-de-la-huerta",
    slug: "conservas-de-la-huerta",
    name: "Conservas de la huerta",
    type: "Gastronomía",
    communityId: "manos-de-usme",
    description:
      "Conservas artesanales de frutas y verduras cultivadas en huertas familiares de la zona rural de Usme.",
    presentation: "Frascos de vidrio de 250 g y 500 g.",
    features: [
      "Frascos de vidrio",
      "Presentaciones de 250 g y 500 g",
      "Frutas y verduras de huertas familiares de Usme",
    ],
    availability: "Disponible",
    images: ["/images/productos/conservas-de-la-huerta.jpg"],
    isExample: true,
  },
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
    images: ["/images/productos/mermelada-campesina.jpg"],
    isExample: true,
  },
  {
    id: "bolsos-tejidos-a-mano",
    slug: "bolsos-tejidos-a-mano",
    name: "Bolsos tejidos a mano",
    type: "Ropa y textiles",
    communityId: "telar-y-tierra",
    description:
      "Bolsos y accesorios tejidos a mano con fibras naturales, en diseños y colores inspirados en el territorio.",
    presentation: "Piezas únicas, tejidas por encargo.",
    features: [
      "Tejido a mano",
      "Fibras naturales",
      "Piezas únicas, diseños inspirados en el territorio",
    ],
    availability: "Por encargo",
    images: ["/images/productos/bolsos-tejidos-a-mano.jpg"],
    isExample: true,
  },
  {
    id: "ruanas-de-lana",
    slug: "ruanas-de-lana",
    name: "Ruanas de lana",
    type: "Ropa y textiles",
    communityId: "telar-y-tierra",
    description: "Ruanas tejidas en lana virgen, ideales para el clima frío de la sabana y el páramo.",
    presentation: "Tallas única y ajustable.",
    features: ["Lana virgen", "Tejido a mano", "Talla única y ajustable"],
    availability: "Por encargo",
    images: ["/images/productos/ruanas-de-lana.jpg"],
    isExample: true,
  },
  {
    id: "recorrido-turismo-rural-sumapaz",
    slug: "recorrido-turismo-rural-sumapaz",
    name: "Recorrido de turismo rural en Sumapaz",
    type: "Turismo rural",
    communityId: "raices-de-sumapaz",
    description:
      "Recorrido guiado por senderos del páramo de Sumapaz, con explicación sobre cultivos sostenibles y cuidado del agua.",
    presentation: "Grupos de hasta 15 personas, jornada de medio día.",
    features: [
      "Jornada de medio día",
      "Grupos de hasta 15 personas",
      "Recorrido guiado por senderos del páramo",
      "Incluye explicación sobre cultivos sostenibles y cuidado del agua",
    ],
    availability: "Por encargo",
    images: ["/images/productos/recorrido-turismo-rural-sumapaz.jpg"],
    isExample: true,
  },
  {
    id: "taller-formacion-emprendimiento",
    slug: "taller-formacion-emprendimiento",
    name: "Taller de formación en emprendimiento",
    type: "Educación y formación",
    communityId: "semillas-de-bosa",
    description:
      "Taller práctico dirigido a mujeres que quieren iniciar o fortalecer su propio emprendimiento.",
    presentation: "Sesiones grupales de 3 horas.",
    features: [
      "Sesiones grupales de 3 horas",
      "Taller práctico",
      "Dirigido a mujeres que inician o fortalecen su emprendimiento",
    ],
    availability: "Por encargo",
    images: ["/images/productos/taller-formacion-emprendimiento.jpg"],
    isExample: true,
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
    id: "encuentro-mujeres-rurales",
    title: "Encuentro de Mujeres Rurales",
    date: "2026-10-17",
    startTime: "2:00 p.m.",
    endTime: "5:00 p.m.",
    location: "Casa de la Cultura, Suba",
    localidad: "Suba",
    type: "Reunión",
    organizer: "Otras comunidades",
    communityId: "semillas-de-bosa",
    description: "Un espacio para compartir experiencias, fortalecer redes y construir juntas.",
    image: "/images/evento-2.jpg",
    isExample: true,
  },
  {
    id: "huertas-para-la-vida",
    title: "Huertas para la vida",
    date: "2026-10-24",
    startTime: "10:00 a.m.",
    endTime: "12:00 p.m.",
    location: "Centro Comunitario Ciudad Bolívar",
    localidad: "Ciudad Bolívar",
    type: "Taller",
    organizer: "Otras comunidades",
    communityId: "telar-y-tierra",
    description:
      "Taller práctico con niños y niñas sobre cultivo en casa y cuidado del territorio.",
    image: "/images/evento-3.jpg",
    isExample: true,
  },
  {
    id: "mercado-saberes-sabores",
    title: "Mercado de Saberes y Sabores",
    date: "2026-11-07",
    startTime: "9:00 a.m.",
    endTime: "3:00 p.m.",
    location: "Plaza de Mercado La Concordia, Bogotá D.C.",
    localidad: "Santa Fe",
    type: "Feria",
    organizer: "Aliados",
    communityId: "sabores-de-la-concordia",
    description: "Ven y apoya los productos de mujeres campesinas de Bogotá y Cundinamarca.",
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
  {
    id: "jornada-acompanamiento-psicosocial",
    title: "Jornada de acompañamiento psicosocial",
    date: "2026-12-05",
    startTime: "9:00 a.m.",
    endTime: "12:00 p.m.",
    location: "Salón Comunal San Bernardino, Bosa",
    localidad: "Bosa",
    type: "Evento de apoyo",
    organizer: "Aliados",
    communityId: "semillas-de-bosa",
    description:
      "Espacio gratuito de escucha y orientación para mujeres cabeza de hogar del sector.",
    image: "/images/evento-3.jpg",
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
  {
    id: "noticia-nuevas-comunidades",
    type: "Noticia",
    title: "Nuevas comunidades se suman a la red",
    date: "2026-09-02",
    summary:
      "Tres nuevos colectivos de mujeres de Bosa, Ciudad Bolívar y Sumapaz se unieron a la plataforma este mes.",
    fullText:
      "Este es un texto de ejemplo. Aquí se anunciará la llegada de nuevas comunidades a la red y una breve reseña de su trabajo en el territorio.",
    image: "/images/evento-2.jpg",
    isExample: true,
  },
  {
    id: "actividad-reciente-taller-tejido",
    type: "Actividad reciente",
    title: "Taller de tejido reunió a más de 20 mujeres",
    date: "2026-09-18",
    summary:
      "El taller de Telar y Tierra fue un espacio de aprendizaje y encuentro entre mujeres de distintas localidades.",
    fullText:
      "Este es un texto de ejemplo. Aquí se describirá cómo se desarrolló la actividad, quiénes participaron y qué aprendizajes dejó para la comunidad.",
    image: "/images/evento-3.jpg",
    isExample: true,
  },
];

export const mapMarkers: MapMarker[] = [
  // TODO: reemplazar por coordenadas reales
  { id: "marker-red-mujer", communityId: "red-mujer", lat: 4.405, lng: -74.125 },
  // TODO: reemplazar por coordenadas reales
  { id: "marker-manos-de-usme", communityId: "manos-de-usme", lat: 4.527, lng: -74.113 },
  // TODO: reemplazar por coordenadas reales
  { id: "marker-telar-y-tierra", communityId: "telar-y-tierra", lat: 4.535, lng: -74.172 },
  // TODO: reemplazar por coordenadas reales
  { id: "marker-raices-de-sumapaz", communityId: "raices-de-sumapaz", lat: 4.12, lng: -74.23 },
  // TODO: reemplazar por coordenadas reales
  { id: "marker-semillas-de-bosa", communityId: "semillas-de-bosa", lat: 4.628, lng: -74.205 },
  // TODO: reemplazar por coordenadas reales
  {
    id: "marker-sabores-de-la-concordia",
    communityId: "sabores-de-la-concordia",
    lat: 4.6,
    lng: -74.06,
  },
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
