import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListadoProductos from "@/components/ListadoProductos";

export const metadata: Metadata = {
  title: "Productos · Entre mujeres",
  description:
    "Productos y servicios de las comunidades, organizaciones y emprendimientos de mujeres de Bogotá y Cundinamarca.",
};

export default function PaginaProductos() {
  return (
    <>
      <Navbar />

      {/* pt-[72px] despeja la barra fija, que aquí no tiene un hero debajo. */}
      <main className="pt-[72px]">
        <div className="container-page py-14 sm:py-16">
          <header className="max-w-2xl">
            <span className="eyebrow">Productos y comunidades</span>
            <h1 className="mt-3 font-titulos text-4xl font-semibold leading-tight text-texto sm:text-5xl">
              Lo que hacen las mujeres de la red
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-texto-suave">
              Busca por categoría, por localidad o por tipo de comunidad. Cada producto tiene su
              página, con sus características y el WhatsApp de quien lo hace.
            </p>
          </header>

          <div className="mt-12">
            <Suspense fallback={<p className="text-base text-texto-suave">Cargando productos…</p>}>
              <ListadoProductos />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
