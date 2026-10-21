import type { Metadata } from "next";
import { Poppins, DM_Sans, Caveat } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        {children}
      </body>
    </html>
  );
}
