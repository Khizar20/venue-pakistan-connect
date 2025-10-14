import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-wedding.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark/90 via-maroon/80 to-maroon-dark/90" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight">
          FIND YOUR DREAM<br />
          WEDDING VENUE<br />
          IN PAKISTAN
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Book unforgettable locations for your special day
        </p>
        
        <div className="max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by City, Venue Type..."
              className="pl-12 h-14 text-base bg-white"
            />
          </div>
          <Button variant="hero" size="lg" className="h-14 px-10">
            SEARCH
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
