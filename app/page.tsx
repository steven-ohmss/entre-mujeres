import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CarruselInicio from "@/components/CarruselInicio";
import QuickAccess from "@/components/QuickAccess";
import InteractiveMap from "@/components/InteractiveMap";
import JoinSection from "@/components/JoinSection";
import CalendarSection from "@/components/CalendarSection";
import NewsSection from "@/components/NewsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  obtenerComunidades,
  obtenerEventos,
  obtenerMarcadores,
  obtenerNoticias,
  obtenerProductos,
} from "@/lib/datos";

export default async function Home() {
  // Todo se pide a la vez: son consultas independientes y cacheadas, así que esperarlas
  // en fila solo haría la página más lenta sin ganar nada.
  const [comunidades, productos, marcadores, eventos, noticias] = await Promise.all([
    obtenerComunidades(),
    obtenerProductos(),
    obtenerMarcadores(),
    obtenerEventos(),
    obtenerNoticias(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CarruselInicio eventos={eventos} noticias={noticias} />
        <QuickAccess />
        {/* El orden de las secciones sigue al del menú: Mapa, Calendario, Noticias,
            Nosotras y Contacto. La invitación a sumarse va justo debajo del mapa,
            como pide 4.7. */}
        <InteractiveMap
          comunidades={comunidades}
          marcadores={marcadores}
          productos={productos}
        />
        <JoinSection />
        <CalendarSection eventos={eventos} comunidades={comunidades} />
        <NewsSection noticias={noticias} />
        <AboutSection comunidades={comunidades} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
