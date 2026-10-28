export type CommunityCategory =
  | "Comunidades rurales"
  | "Productoras"
  | "Emprendimientos"
  | "Servicios de apoyo";

export type ProductType =
  | "Artesanías"
  | "Turismo rural"
  | "Ropa y textiles"
  | "Souvenirs"
  | "Educación y formación"
  | "Gastronomía"
  | "Otros";

/** Disponibilidad de un producto o servicio (4.4.3). */
export type Availability = "Disponible" | "Por encargo" | "Por temporada";

/** Una foto de producto, con la frase que la describe. */
export interface ProductImage {
  /** Ruta dentro de public/, por ejemplo "/images/productos/queso-campesino.jpg". */
  src: string;
  /**
   * Lo que de verdad se ve en la foto, no el nombre del producto (11.2 de
   * docs/guia-material.md). Es lo que oye quien usa lector de pantalla y lo que se lee
   * si la foto no carga por mala señal, así que se reescribe junto con la imagen.
   */
  alt: string;
}

export type EventType =
  | "Feria"
  | "Taller"
  | "Reunión"
  | "Actividad comunitaria"
  | "Evento de apoyo"
  | "Otro";

export type Organizer = "Red Mujer" | "Otras comunidades" | "Aliados";

export type Localidad =
  | "Usaquén"
  | "Chapinero"
  | "Santa Fe"
  | "San Cristóbal"
  | "Usme"
  | "Bosa"
  | "Kennedy"
  | "Fontibón"
  | "Engativá"
  | "Suba"
  | "Ciudad Bolívar"
  | "Sumapaz";

export interface CommunityContact {
  /** Número con indicativo del país. PENDIENTE mientras el equipo no lo entregue. */
  whatsapp: string;
  phone: string;
  email: string;
  social: string;
}

export interface Community {
  id: string;
  /** Parte final de la URL de su perfil: /comunidades/<slug>. */
  slug: string;
  name: string;
  /**
   * Se omite mientras la comunidad no confirme a qué categoría pertenece. Sin categoría
   * no entra en ningún filtro concreto, pero sí sigue apareciendo con "Todas las
   * categorías" y en el mapa, y su página muestra "Información próximamente".
   */
  category?: CommunityCategory;
  localidad: Localidad;
  ubicacion: string;
  shortDescription: string;
  whoWeAre: string;
  whatWeDo: string;
  image: string;
  contact: CommunityContact;
  /** Catálogo o portafolio propio de la comunidad, si existe. */
  catalogUrl?: string;
  isExample: boolean;
}

export interface Product {
  id: string;
  /** Parte final de la URL de su página: /productos/<slug>. */
  slug: string;
  name: string;
  type: ProductType;
  communityId: string;
  description: string;
  presentation: string;
  /** Características concretas: material, tamaño, presentación, duración… (4.4.3). */
  features: string[];
  /** Se omite mientras la comunidad no la confirme; la interfaz no muestra la etiqueta. */
  availability?: Availability;
  /**
   * Fotos propias de ESTE producto, cada una con su descripción. Nunca se repiten entre
   * productos distintos: si todavía no hay foto real se deja el arreglo vacío y la
   * interfaz muestra el placeholder con el icono de la categoría y
   * "Foto próximamente" (4.4.6).
   */
  images: ProductImage[];
  /** Catálogo o portafolio donde se ve este producto, si existe. */
  catalogUrl?: string;
  isExample: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  localidad: Localidad;
  type: EventType;
  organizer: Organizer;
  communityId: string;
  description: string;
  image: string;
  isExample: boolean;
}

export interface NewsItem {
  id: string;
  type: "Historia" | "Noticia" | "Actividad reciente" | "Proyecto destacado";
  title: string;
  date: string;
  summary: string;
  fullText: string;
  image: string;
  isExample: boolean;
}

export interface MapMarker {
  id: string;
  communityId: string;
  lat: number;
  lng: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  social: string;
}

export interface EventTypeInfo {
  value: EventType;
  label: string;
  color: string;
  icon: "Store" | "Wrench" | "Users" | "HeartHandshake" | "HandHeart" | "MoreHorizontal";
}
