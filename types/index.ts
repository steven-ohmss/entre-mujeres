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
  phone: string;
  email: string;
  social: string;
}

export interface Community {
  id: string;
  name: string;
  category: CommunityCategory;
  localidad: Localidad;
  ubicacion: string;
  shortDescription: string;
  whoWeAre: string;
  whatWeDo: string;
  image: string;
  contact: CommunityContact;
  isExample: boolean;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  communityId: string;
  description: string;
  presentation: string;
  images: string[];
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
