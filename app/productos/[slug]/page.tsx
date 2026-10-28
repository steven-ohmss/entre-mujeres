import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Foto from "@/components/Foto";
import ProductCard from "@/components/ProductCard";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import { communities, products } from "@/data/data";
import { ICONO_PRODUCTO } from "@/lib/categorias";
import { esPendiente, mensajeProducto } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((producto) => ({ slug: producto.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = products.find((p) => p.slug === slug);
  if (!producto) return { title: "Producto no encontrado · Entre mujeres" };
  return {
    title: `${producto.name} · Entre mujeres`,
    description: producto.description,
  };
}

const COLOR_DISPONIBILIDAD: Record<string, string> = {
  Disponible: "bg-verde-hoja/20 text-verde-bosque",
  "Por encargo": "bg-amarillo/25 text-texto",
  "Por temporada": "bg-naranja/20 text-texto",
};

export default async function PaginaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = products.find((p) => p.slug === slug);
  if (!producto) notFound();

  const comunidad = communities.find((c) => c.id === producto.communityId);
  const Icono = ICONO_PRODUCTO[producto.type];

  const hermanos = comunidad
    ? products.filter((p) => p.communityId === comunidad.id && p.id !== producto.id)
    : [];

  const catalogo = producto.catalogUrl ?? comunidad?.catalogUrl;

  return (
    <>
      <Navbar />

      <main className="pt-[72px]">
        <div className="container-page py-10 sm:py-14">
          <Link
            href="/productos"
            className="inline-flex min-h-12 items-center gap-2 text-base font-semibold text-texto transition hover:text-rosa-oscuro"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Volver a productos
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-rosa-palido">
              <Foto
                src={producto.images[0]}
                alt={`Foto del producto ${producto.name}`}
                icon={Icono}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="pill-tag bg-verde-hoja/15 text-verde-bosque">
                  <Icono size={16} className="mr-1.5" aria-hidden="true" />
                  {producto.type}
                </span>
                {/* Sin disponibilidad confirmada no se muestra la etiqueta: es mejor no
                    decir nada que afirmar un "Disponible" que nadie verificó. */}
                {producto.availability ? (
                  <span
                    className={`pill-tag ${
                      COLOR_DISPONIBILIDAD[producto.availability] ?? "bg-crema text-texto"
                    }`}
                  >
                    {producto.availability}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 font-titulos text-4xl font-semibold leading-tight text-texto sm:text-5xl">
                {producto.name}
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-texto">{producto.description}</p>

              <section className="mt-8">
                <h2 className="font-titulos text-xl font-semibold text-texto">Características</h2>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {producto.features.map((caracteristica) => (
                    <li key={caracteristica} className="flex items-start gap-2.5 text-base text-texto">
                      <Package
                        size={19}
                        className="mt-1 shrink-0 text-verde-hoja"
                        aria-hidden="true"
                      />
                      {caracteristica}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-base text-texto-suave">{producto.presentation}</p>
              </section>

              {comunidad ? (
                <section className="mt-9 rounded-3xl bg-crema p-6">
                  <p className="text-base text-texto-suave">Lo hace</p>
                  <p className="mt-1 font-titulos text-2xl font-semibold text-texto">
                    {comunidad.name}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-base text-texto-suave">
                    <MapPin size={18} className="shrink-0" aria-hidden="true" />
                    {comunidad.ubicacion}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <BotonWhatsApp
                      telefono={comunidad.contact.whatsapp}
                      mensaje={mensajeProducto(producto.name)}
                    />
                    <Link href={`/comunidades/${comunidad.slug}`} className="btn-secondary">
                      Conoce a la comunidad que lo hace
                    </Link>
                  </div>

                  {catalogo && !esPendiente(catalogo) ? (
                    <a
                      href={catalogo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-12 items-center gap-2 text-base font-semibold text-rosa-oscuro hover:underline"
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                      Ver su catálogo completo
                    </a>
                  ) : null}
                </section>
              ) : null}
            </div>
          </div>

          {hermanos.length > 0 && comunidad ? (
            <section className="mt-20">
              <h2 className="font-titulos text-3xl font-semibold text-texto">
                Más de {comunidad.name}
              </h2>
              <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hermanos.map((otro) => (
                  <ProductCard key={otro.id} product={otro} community={comunidad} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
