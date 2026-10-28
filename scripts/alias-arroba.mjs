// Enseña a node a resolver el alias "@/..." de tsconfig.json, que apunta a la raíz del
// proyecto. Sin esto, importar data/data.ts desde un script falla, porque ese archivo
// importa "@/config/site" y node no lee los paths de tsconfig.
//
// Se usa así:
//   node --import ./scripts/alias-arroba.mjs scripts/verificar-marcadores.mjs

import { register } from "node:module";

register("./alias-arroba-hook.mjs", import.meta.url);
