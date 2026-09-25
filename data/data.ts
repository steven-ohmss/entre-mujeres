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

export const MAP_IMAGE = { width: 920, height: 1180 };

export const communities: Community[] = [
  {
    id: "red-mujer",
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
      phone: "[+57 000 000 0000]",
      email: "[correo@pendiente.com]",
      social: "[@usuario_pendiente]",
    },
    isExample: false,
  },
  {
    id: "manos-de-usme",
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
      phone: "[+57 000 000 0000]",
      email: "[correo@pendiente.com]",
      social: "[@usuario_pendiente]",
    },
    isExample: true,
  },
  {
    id: "telar-y-tierra",
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
      phone: "[+57 000 000 0000]",
      email: "[correo@pendiente.com]",
      social: "[@usuario_pendiente]",
    },
    isExample: true,
  },
  {
    id: "raices-de-sumapaz",
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
      phone: "[+57 000 000 0000]",
      email: "[correo@pendiente.com]",
      social: "[@usuario_pendiente]",
    },
    isExample: true,
  },
  {
    id: "semillas-de-bosa",
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
      phone: "[+57 000 000 0000]",
      email: "[correo@pendiente.com]",
      social: "[@usuario_pendiente]",
    },
    isExample: true,
  },
  {
    id: "sabores-de-la-concordia",
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
    image: "/images/producto-4.jpg",
    contact: {
      phone: "[+57 000 000 0000]",
      email: "[correo@pendiente.com]",
      social: "[@usuario_pendiente]",
    },
    isExample: true,
  },
];

export const products: Product[] = [
  {
    id: "conservas-de-la-huerta",
    name: "Conservas de la huerta",
    type: "Gastronomía",
    communityId: "manos-de-usme",
    description:
      "Conservas artesanales de frutas y verduras cultivadas en huertas familiares de la zona rural de Usme.",
    presentation: "Frascos de vidrio de 250 g y 500 g.",
    images: ["/images/producto-1.jpg"],
    isExample: true,
  },
  {
    id: "mermelada-campesina",
    name: "Mermelada campesina",
    type: "Gastronomía",
    communityId: "red-mujer",
    description:
      "Mermeladas elaboradas con fruta fresca de la vereda Arrayanes, sin conservantes artificiales.",
    presentation: "Frascos de vidrio de 300 g.",
    images: ["/images/producto-2.jpg"],
    isExample: true,
  },
  {
    id: "bolsos-tejidos-a-mano",
    name: "Bolsos tejidos a mano",
    type: "Ropa y textiles",
    communityId: "telar-y-tierra",
    description:
      "Bolsos y accesorios tejidos a mano con fibras naturales, en diseños y colores inspirados en el territorio.",
    presentation: "Piezas únicas, tejidas por encargo.",
    images: ["/images/producto-3.jpg"],
    isExample: true,
  },
  {
    id: "ruanas-de-lana",
    name: "Ruanas de lana",
    type: "Ropa y textiles",
    communityId: "telar-y-tierra",
    description: "Ruanas tejidas en lana virgen, ideales para el clima frío de la sabana y el páramo.",
    presentation: "Tallas única y ajustable.",
    images: ["/images/producto-4.jpg"],
    isExample: true,
  },
  {
    id: "recorrido-turismo-rural-sumapaz",
    name: "Recorrido de turismo rural en Sumapaz",
    type: "Turismo rural",
    communityId: "raices-de-sumapaz",
    description:
      "Recorrido guiado por senderos del páramo de Sumapaz, con explicación sobre cultivos sostenibles y cuidado del agua.",
    presentation: "Grupos de hasta 15 personas, jornada de medio día.",
    images: ["/images/producto-1.jpg"],
    isExample: true,
  },
  {
    id: "taller-formacion-emprendimiento",
    name: "Taller de formación en emprendimiento",
    type: "Educación y formación",
    communityId: "semillas-de-bosa",
    description:
      "Taller práctico dirigido a mujeres que quieren iniciar o fortalecer su propio emprendimiento.",
    presentation: "Sesiones grupales de 3 horas.",
    images: ["/images/producto-2.jpg"],
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
  { id: "marker-red-mujer", communityId: "red-mujer", x: 43, y: 63, lat: 4.348, lng: -74.115 },
  { id: "marker-manos-de-usme", communityId: "manos-de-usme", x: 46, y: 58, lat: 4.39, lng: -74.12 },
  {
    id: "marker-telar-y-tierra",
    communityId: "telar-y-tierra",
    x: 38,
    y: 60,
    lat: 4.35,
    lng: -74.19,
  },
  {
    id: "marker-raices-de-sumapaz",
    communityId: "raices-de-sumapaz",
    x: 41,
    y: 78,
    lat: 4.03,
    lng: -74.22,
  },
  { id: "marker-semillas-de-bosa", communityId: "semillas-de-bosa", x: 34, y: 52, lat: 4.62, lng: -74.2 },
  {
    id: "marker-sabores-de-la-concordia",
    communityId: "sabores-de-la-concordia",
    x: 45,
    y: 38,
    lat: 4.6,
    lng: -74.07,
  },
];

export const contactInfo: ContactInfo = {
  email: "[correo@pendiente.com]",
  phone: "[+57 000 000 0000]",
  social: "[@usuario_pendiente]",
};

export const localidadesConOtro = [...localidades, "Otro municipio de Cundinamarca"] as const;

export const initiativeTypes: CommunityCategory[] = communityCategories;
