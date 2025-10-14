import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedVenues from "@/components/FeaturedVenues";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedVenues />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
