import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import venue1 from "@/assets/venue1.jpg";
import venue2 from "@/assets/venue2.jpg";
import venue3 from "@/assets/venue3.jpg";

const venues = [
  {
    id: 1,
    image: venue1,
    name: "Royal Marquee",
    location: "Model Town, Lahore",
    capacity: "500-800 guests",
  },
  {
    id: 2,
    image: venue2,
    name: "Heritage Palace",
    location: "F-8, Islamabad",
    capacity: "300-600 guests",
  },
  {
    id: 3,
    image: venue3,
    name: "Garden Estate",
    location: "DHA Phase 6, Karachi",
    capacity: "400-700 guests",
  },
];

const FeaturedVenues = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-transparent to-cream/30" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-16 bg-gold mx-auto rounded-full shadow-[0_0_15px_hsl(40_80%_55%/0.4)]" />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-primary">
            Featured Venues
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium venues
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl border border-border/50 bg-card hover:-translate-y-2">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={venue.image}
                  alt={`${venue.name} - Premium wedding venue in ${venue.location}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark via-maroon-dark/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 bg-gold text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Featured
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-3xl mb-2 text-white drop-shadow-lg">{venue.name}</h3>
                </div>
              </div>
              <CardContent className="p-6 bg-card">
                <div className="space-y-3 mb-6">
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-gold rounded-full"></span>
                    {venue.location}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-maroon-light rounded-full"></span>
                    {venue.capacity}
                  </p>
                </div>
                <Button variant="default" className="w-full group-hover:bg-gold group-hover:text-white transition-all shadow-md hover:shadow-lg">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenues;
