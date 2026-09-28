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
    <html
      lang="es"
      className={`${poppins.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen bg-crema font-sans text-texto antialiased">
        {children}
      </body>
    </html>
  );
}
