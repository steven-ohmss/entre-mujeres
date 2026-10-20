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
  category: CommunityCategory;
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
  availability: Availability;
  /**
   * Fotos propias de ESTE producto. Nunca se repiten entre productos distintos: si
   * todavía no hay foto real se deja el arreglo vacío y la interfaz muestra el
   * placeholder con el icono de la categoría y "Foto próximamente" (4.4.6).
   */
  images: string[];
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
