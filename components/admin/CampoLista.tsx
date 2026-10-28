"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

/**
 * Una lista de frases cortas que se puede agregar y quitar: las características del
 * producto ("Frasco de vidrio de 300 g", "Sin conservantes").
 *
 * Cada frase viaja como un campo repetido con el mismo nombre, que es lo que FormData
 * entiende sin inventar formatos: el servidor las recoge con getAll().
 */
export default function CampoLista({
  nombre,
  etiqueta,
  ayuda,
  inicial,
  marcador,
}: {
  nombre: string;
  etiqueta: string;
  ayuda: string;
  inicial: string[];
  marcador: string;
}) {
  const [items, setItems] = useState<string[]>(inicial.length > 0 ? inicial : [""]);

  const cambiar = (i: number, valor: string) =>
    setItems((x) => x.map((v, k) => (k === i ? valor : v)));

  const quitar = (i: number) =>
    setItems((x) => (x.length === 1 ? [""] : x.filter((_, k) => k !== i)));

  return (
    <div>
      <span className="field-label">{etiqueta}</span>
      <p className="mb-2 text-base text-texto-suave">{ayuda}</p>

      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              name={nombre}
              value={item}
              onChange={(e) => cambiar(i, e.target.value)}
              className="field-input flex-1"
              placeholder={i === 0 ? marcador : ""}
              aria-label={`${etiqueta}, línea ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => quitar(i)}
              aria-label={`Quitar la línea ${i + 1}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-texto-suave transition hover:bg-crema hover:text-rosa-oscuro"
            >
              <Trash2 size={20} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setItems((x) => [...x, ""])}
        className="btn-secondary mt-3"
      >
        <Plus size={19} aria-hidden="true" />
        Agregar otra
      </button>
    </div>
  );
}
