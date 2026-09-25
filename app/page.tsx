import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickAccess from "@/components/QuickAccess";
import CommunitySection from "@/components/CommunitySection";
import ProductSection from "@/components/ProductSection";
import CalendarSection from "@/components/CalendarSection";
import InteractiveMap from "@/components/InteractiveMap";
import NewsSection from "@/components/NewsSection";
import AboutSection from "@/components/AboutSection";
import JoinSection from "@/components/JoinSection";
import AccompanimentSection from "@/components/AccompanimentSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QuickAccess />
        <CommunitySection />
        <ProductSection />
        <CalendarSection />
        <InteractiveMap />
        <NewsSection />
        <AboutSection />
        <JoinSection />
        <AccompanimentSection />
      </main>
      <Footer />
    </>
  );
}
