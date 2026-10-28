/**
 * El nombre corto que va en la dirección: /productos/<slug>.
 *
 * Se arma solo a partir del nombre, siguiendo las mismas tres reglas que pide
 * docs/guia-material.md para los nombres de archivo: minúsculas, sin tildes ni eñes, y
 * con guiones en vez de espacios. Así el slug del producto y el nombre de su foto
 * coinciden siempre, que es lo que permite subir una foto sin tocar ningún dato.
 */
export function aSlug(texto: string): string {
  return texto
    .normalize("NFD")
    // Quita los acentos que la descomposición dejó sueltos. La eñe se vuelve "n".
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Un slug libre, agregando -2, -3… si el que sale del nombre ya está tomado.
 *
 * Es la red de seguridad para el caso de dos cosas con el mismo nombre. La base también
 * lo impide por su cuenta (slug es único), pero avisar aquí es mucho más amable que
 * dejar que falle al guardar.
 */
export function slugLibre(base: string, tomados: string[]): string {
  const limpio = aSlug(base);
  if (!limpio) return "";
  const ocupados = new Set(tomados);
  if (!ocupados.has(limpio)) return limpio;

  for (let n = 2; n < 100; n++) {
    const intento = `${limpio}-${n}`;
    if (!ocupados.has(intento)) return intento;
  }
  return `${limpio}-${Date.now()}`;
}
