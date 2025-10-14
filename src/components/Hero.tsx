import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-wedding.jpg";

const Hero = () => {
  return (
    <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 animate-[scale_20s_ease-in-out_infinite]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark/95 via-maroon/85 to-maroon-dark/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(0_45%_20%/0.3)_100%)]" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/50 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
        <div className="mb-6 inline-block">
          <div className="h-1 w-20 bg-gold mx-auto mb-4 rounded-full shadow-[0_0_20px_hsl(40_80%_55%/0.5)]" />
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl mb-6 leading-tight drop-shadow-2xl">
          FIND YOUR DREAM<br />
          <span className="text-gold">WEDDING VENUE</span><br />
          IN PAKISTAN
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light max-w-3xl mx-auto drop-shadow-lg">
          Book unforgettable locations for your special day with Pakistan's most trusted venue booking platform
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-sm bg-white/10 p-3 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by City, Venue Type, or Name..."
                  className="pl-14 h-16 text-lg bg-white/95 backdrop-blur-md border-0 shadow-lg focus:ring-2 focus:ring-gold rounded-xl"
                />
              </div>
              <Button variant="hero" size="lg" className="h-16 px-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                SEARCH
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
