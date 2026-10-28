"use client";

import { Component, type ReactNode } from "react";

/**
 * Aísla una parte de la página para que, si falla, no se lleve el resto por delante.
 *
 * Hace falta porque sin esto cualquier excepción sube hasta app/error.tsx y sustituye la
 * página entera por la pantalla de error. Para una pieza accesoria —el mapa, por
 * ejemplo— eso es desproporcionado: es mejor que falte el mapa y se pueda seguir leyendo
 * el calendario, las noticias y los productos.
 *
 * Un límite de error tiene que ser una clase: es la única forma que da React de atrapar
 * un fallo de render de los componentes de abajo.
 */
export default class LimiteDeError extends Component<
  { children: ReactNode; respaldo: ReactNode; nombre: string },
  { fallo: boolean }
> {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch(error: Error) {
    console.error(`Entre mujeres: falló "${this.props.nombre}" y se mostró sin él.`, error);
  }

  render() {
    return this.state.fallo ? this.props.respaldo : this.props.children;
  }
}
