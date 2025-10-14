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
        <div className="absolute inset-0 bg-maroon/85" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground max-w-5xl">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight font-semibold">
          Find Your Dream Wedding Venue in Pakistan
        </h1>
        <p className="text-lg md:text-xl mb-10 font-light max-w-2xl mx-auto opacity-95">
          Discover and book exceptional venues for your special day
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by city, venue type, or name..."
                  className="pl-12 h-14 text-base bg-transparent border-0 focus:ring-0"
                />
              </div>
              <Button variant="default" size="lg" className="h-14 px-8 text-sm font-medium">
                Search Venues
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
