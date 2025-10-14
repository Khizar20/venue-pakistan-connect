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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3 text-primary font-semibold">
            Featured Venues
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Explore our curated collection of exceptional venues
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl border bg-card">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={venue.image}
                  alt={`${venue.name} - Premium wedding venue in ${venue.location}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-5 bg-card">
                <h3 className="font-serif text-xl mb-2 text-primary font-semibold">{venue.name}</h3>
                <p className="text-muted-foreground text-sm mb-1">{venue.location}</p>
                <p className="text-xs text-muted-foreground mb-4">{venue.capacity}</p>
                <Button variant="outline" size="sm" className="w-full group-hover:border-gold group-hover:text-gold transition-all">
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
