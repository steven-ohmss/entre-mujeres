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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CarruselInicio />
        <QuickAccess />
        {/* El orden de las secciones sigue al del menú: Mapa, Calendario, Noticias,
            Nosotras y Contacto. La invitación a sumarse va justo debajo del mapa,
            como pide 4.7. */}
        <InteractiveMap />
        <JoinSection />
        <CalendarSection />
        <NewsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
