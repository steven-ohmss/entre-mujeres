import {
  BarChart3,
  BookOpen,
  Bus,
  Gift,
  HandHeart,
  Leaf,
  LayoutGrid,
  MoreHorizontal,
  Palette,
  Shirt,
  ShoppingBasket,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CommunityCategory, ProductType } from "@/types";

/**
 * Icono de cada categoría. Un solo lugar para que el mismo icono acompañe a la categoría
 * en los filtros, en las tarjetas, en el buscador y en el placeholder de "Foto próximamente".
 */
export const ICONO_PRODUCTO: Record<ProductType, LucideIcon> = {
  Artesanías: Palette,
  "Turismo rural": Bus,
  "Ropa y textiles": Shirt,
  Souvenirs: Gift,
  "Educación y formación": BookOpen,
  Gastronomía: UtensilsCrossed,
  Otros: MoreHorizontal,
};

export const ICONO_COMUNIDAD: Record<CommunityCategory, LucideIcon> = {
  "Comunidades rurales": Leaf,
  Productoras: ShoppingBasket,
  Emprendimientos: BarChart3,
  "Servicios de apoyo": HandHeart,
};

/** Icono de la opción "Todas" en los filtros. */
export const ICONO_TODAS = LayoutGrid;
