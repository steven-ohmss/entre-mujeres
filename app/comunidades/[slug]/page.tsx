import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Foto from "@/components/Foto";
import ProductCard from "@/components/ProductCard";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import { calendarEvents, communities, products } from "@/data/data";
import { ICONO_COMUNIDAD } from "@/lib/categorias";
import { esPendiente, mensajeComunidad } from "@/config/site";
import { compareISODates, formatEventDate } from "@/lib/date";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return communities.map((comunidad) => ({ slug: comunidad.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comunidad = communities.find((c) => c.slug === slug);
  if (!comunidad) return { title: "Comunidad no encontrada · Entre mujeres" };
  return {
    title: `${comunidad.name} · Entre mujeres`,
    description: comunidad.shortDescription,
  };
}

export default async function PaginaComunidad({ params }: Props) {
  const { slug } = await params;
  const comunidad = communities.find((c) => c.slug === slug);
  if (!comunidad) notFound();

  const suyos = products.filter((p) => p.communityId === comunidad.id);
  const eventos = [...calendarEvents]
    .filter((e) => e.communityId === comunidad.id)
    .sort((a, b) => compareISODates(a.date, b.date));

  return (
    <>
      <Navbar />

      <main className="pt-[72px]">
        <div className="relative h-64 w-full bg-rosa-palido sm:h-80">
          <Foto
            src={comunidad.image}
            alt={`Foto de la comunidad ${comunidad.name}`}
            icon={ICONO_COMUNIDAD[comunidad.category]}
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-texto/70 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="container-page py-10 sm:py-14">
          <Link
            href="/productos"
            className="inline-flex min-h-12 items-center gap-2 text-base font-semibold text-texto transition hover:text-rosa-oscuro"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Volver a productos
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <span className="pill-tag bg-rosa-palido text-rosa-oscuro">{comunidad.category}</span>

              <h1 className="mt-4 font-titulos text-4xl font-semibold leading-tight text-texto sm:text-5xl">
                {comunidad.name}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-lg text-texto-suave">
                <MapPin size={20} className="shrink-0" aria-hidden="true" />
                {comunidad.ubicacion}
              </p>

              <section className="mt-9">
                <h2 className="font-titulos text-2xl font-semibold text-texto">Su historia</h2>
                <p className="mt-3 text-lg leading-relaxed text-texto">{comunidad.whoWeAre}</p>
              </section>

              <section className="mt-8">
                <h2 className="font-titulos text-2xl font-semibold text-texto">Qué hacen</h2>
                <p className="mt-3 text-lg leading-relaxed text-texto">{comunidad.whatWeDo}</p>
              </section>
            </div>

            <aside className="rounded-3xl bg-crema p-6">
              <h2 className="font-titulos text-xl font-semibold text-texto">Escríbeles</h2>
              <p className="mt-2 text-base text-texto-suave">
                Para preguntar precios, pedir información o hacer un encargo.
              </p>

              <BotonWhatsApp
                telefono={comunidad.contact.whatsapp}
                mensaje={mensajeComunidad(comunidad.name)}
                etiqueta="Escríbeles por WhatsApp"
                className="mt-5 w-full"
              />

              {comunidad.catalogUrl && !esPendiente(comunidad.catalogUrl) ? (
                <a
                  href={comunidad.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-12 items-center gap-2 text-base font-semibold text-rosa-oscuro hover:underline"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  Ver su catálogo
                </a>
              ) : null}

              {eventos.length > 0 ? (
                <div className="mt-7 border-t border-texto/15 pt-6">
                  <h3 className="font-titulos text-lg font-semibold text-texto">
                    Dónde encontrarlas
                  </h3>
                  <ul className="mt-3 flex flex-col gap-3">
                    {eventos.map((evento) => (
                      <li key={evento.id} className="flex items-start gap-2.5 text-base text-texto">
                        <CalendarDays
                          size={19}
                          className="mt-1 shrink-0 text-verde-hoja"
                          aria-hidden="true"
                        />
                        <span>
                          {evento.title}
                          <span className="block text-base text-texto-suave">
                            {formatEventDate(evento.date)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          <section className="mt-20">
            <h2 className="font-titulos text-3xl font-semibold text-texto">
              {suyos.length === 1 ? "Su producto" : "Sus productos"}
            </h2>

            {suyos.length > 0 ? (
              <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {suyos.map((producto) => (
                  <ProductCard key={producto.id} product={producto} community={comunidad} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-lg text-texto-suave">
                Todavía no hemos publicado sus productos.
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
