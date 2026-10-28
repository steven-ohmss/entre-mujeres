import type { Metadata } from "next";
import { Poppins, DM_Sans, Caveat } from "next/font/google";
import ProveedorCatalogo from "@/components/ProveedorCatalogo";
import { obtenerComunidades, obtenerProductos } from "@/lib/datos";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Entre mujeres · Plataforma comunitaria",
  description:
    "Entre mujeres es una plataforma comunitaria para descubrir, conectar y fortalecer comunidades, organizaciones y emprendimientos de mujeres en Bogotá y Cundinamarca. Una iniciativa de Red Mujer.",
};

/**
 * Las comunidades y los productos se cargan aquí, una sola vez para todo el sitio,
 * porque el buscador vive en la barra de navegación y esa sale en todas las páginas.
 *
 * Si la base no responde, el catálogo queda vacío y el buscador no encuentra nada, pero
 * la página se dibuja igual: una barra de navegación que no busca es mucho mejor que un
 * sitio entero que no abre. Las páginas que sí dependen del contenido muestran su propio
 * aviso (ver app/error.tsx).
 */
async function catalogoParaElBuscador() {
  try {
    const [comunidades, productos] = await Promise.all([
      obtenerComunidades(),
      obtenerProductos(),
    ]);
    return { comunidades, productos };
  } catch {
    return { comunidades: [], productos: [] };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const catalogo = await catalogoParaElBuscador();

  return (
    // suppressHydrationWarning: algunas extensiones del navegador (como las que cambian
    // el cursor) inyectan atributos en <html> antes de que React hidrate, y eso hace que
    // React avise de una diferencia que no viene de nuestro código ni podemos evitar.
    // Solo silencia el aviso de este elemento, no el de sus hijos.
    <html
      lang="es"
      suppressHydrationWarning
      className={`${poppins.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen bg-crema font-sans text-texto antialiased">
        <ProveedorCatalogo valor={catalogo}>{children}</ProveedorCatalogo>
      </body>
    </html>
  );
}
