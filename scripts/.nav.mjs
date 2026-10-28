import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const nav = await chromium.launch({ channel: "chrome", headless: true });

let fallas = 0;
const paso = (ok, t) => {
  if (!ok) fallas++;
  console.log(`  ${ok ? "OK   " : "FALLA"} ${t}`);
};

const SECCIONES = ["/#inicio", "/#mapa", "/#calendario", "/#noticias", "/#nosotras", "/#contacto"];
const TODAS = ["/productos", ...SECCIONES];

for (const ancho of [1400, 360]) {
  const movil = ancho < 1280;
  const ctx = await nav.newContext({ viewport: { width: ancho, height: 900 } });
  const p = await ctx.newPage();

  const errores = [];
  p.on("pageerror", (e) => errores.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error" && !/favicon|DevTools/i.test(m.text())) errores.push(m.text());
  });

  const roto = () =>
    p.getByText("No pudimos cargar el contenido").first().isVisible().catch(() => false);
  const mapaCaido = () =>
    p.getByText("El mapa no se pudo mostrar").first().isVisible().catch(() => false);

  // En celular los enlaces viven dentro del menú desplegable.
  const clic = async (href) => {
    if (movil) {
      const abrir = p.getByRole("button", { name: /Abrir menú/i }).first();
      if ((await abrir.count()) && (await abrir.isVisible())) {
        await abrir.click();
        await p.waitForTimeout(450);
      }
    }
    const enlace = p.locator(`header a[href="${href}"]`).filter({ visible: true }).first();
    if ((await enlace.count()) === 0) return false;
    await enlace.click();
    await p.waitForTimeout(movil ? 1300 : 1100);
    return true;
  };

  console.log(`\n=== ${ancho} px ===`);

  // Todas las combinaciones de ida, partiendo siempre del inicio ya cargado (que es lo
  // que dispara el fallo: la pagina tiene que haberse montado y ocultado antes).
  let idas = 0;
  let conError = 0;
  let conMapaCaido = 0;

  await p.goto(`${BASE}/`, { waitUntil: "load" });
  await p.waitForTimeout(2200);

  for (const destino of TODAS) {
    for (const origen of TODAS) {
      if (origen === destino) continue;
      await p.goto(`${BASE}${origen}`, { waitUntil: "load" });
      await p.waitForTimeout(movil ? 900 : 700);
      if (!(await clic(destino))) continue;
      idas++;
      if (await roto()) {
        conError++;
        console.log(`          pantalla de error en ${origen} -> ${destino}`);
      }
      if (destino !== "/productos" && (await mapaCaido())) {
        conMapaCaido++;
        console.log(`          mapa degradado en ${origen} -> ${destino}`);
      }
    }
  }
  paso(conError === 0, `${idas} navegaciones del menú, ${conError} con pantalla de error`);
  paso(conMapaCaido === 0, `el mapa nunca quedó degradado (${conMapaCaido} veces)`);

  // El ancla tiene que desplazar de verdad, no solo cambiar la dirección.
  await p.goto(`${BASE}/productos`, { waitUntil: "load" });
  await p.waitForTimeout(800);
  await clic("/#calendario");
  await p.waitForTimeout(1500);
  const pos = await p.evaluate(() => {
    const el = document.getElementById("calendario");
    if (!el) return null;
    return { arriba: Math.round(el.getBoundingClientRect().top), scroll: Math.round(window.scrollY) };
  });
  paso(
    pos !== null && pos.scroll > 200 && Math.abs(pos.arriba) < 450,
    `el ancla desplaza hasta la sección (scrollY=${pos?.scroll}, borde=${pos?.arriba})`
  );

  // Atrás y adelante del navegador: bfcacheId NO cambia ahí, asi que es el caso limite.
  await p.goto(`${BASE}/`, { waitUntil: "load" });
  await p.waitForTimeout(2000);
  await clic("/productos");
  await p.goBack();
  await p.waitForTimeout(2200);
  paso(!(await roto()), "atrás del navegador, de Productos al inicio");
  paso(!(await mapaCaido()), "  y el mapa sigue en pie");
  const panes = await p.locator(".leaflet-pane").count();
  paso(panes > 0, `  con el mapa dibujado (${panes} capas)`);
  await p.goForward();
  await p.waitForTimeout(1500);
  paso(!(await roto()), "adelante del navegador, de vuelta a Productos");

  // Iniciar sesión en los dos sentidos.
  await p.goto(`${BASE}/`, { waitUntil: "load" });
  await p.waitForTimeout(1800);
  if (await clic("/iniciar-sesion")) {
    paso(!(await roto()) && /iniciar-sesion/.test(p.url()), "Inicio -> Iniciar sesión");
    await p.goBack();
    await p.waitForTimeout(2200);
    paso(!(await roto()), "Iniciar sesión -> atrás, al inicio");
    paso(!(await mapaCaido()), "  y el mapa sigue en pie");
  }

  const reales = [...new Set(errores)].filter((e) => !/hydrat/i.test(e));
  paso(reales.length === 0, `sin errores de JavaScript${reales.length ? `: ${reales[0].slice(0, 160)}` : ""}`);

  await ctx.close();
}

await nav.close();
console.log(fallas === 0 ? "\n✓ La navegación funciona en ambos sentidos." : `\n✗ ${fallas} fallaron.`);
process.exit(fallas ? 1 : 0);
