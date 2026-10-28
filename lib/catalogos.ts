import type {
  CommunityCategory,
  ProductType,
  Localidad,
  EventTypeInfo,
  Organizer,
} from "@/types";

/**
 * Los vocabularios de los filtros.
 *
 * No son contenido, son la lista cerrada de valores que el contenido puede tomar, así que
 * viven en el código y no en la base: los componentes de filtro los necesitan para
 * dibujar los botones aunque no haya ni una comunidad cargada.
 *
 * Están duplicados a propósito en Postgres, como tipos enum (ver la primera migración en
 * supabase/migrations/). Si se agrega un valor aquí hay que agregarlo allá también, o la
 * base rechazará la fila. Ese rechazo es deseable: es preferible un error al cargar que
 * un producto que desaparece en silencio de los filtros por una tilde de diferencia.
 */

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

export const localidadesConOtro = [...localidades, "Otro municipio de Cundinamarca"] as const;

export const initiativeTypes: CommunityCategory[] = communityCategories;
