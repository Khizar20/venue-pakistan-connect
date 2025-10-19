import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

const API_URL = "http://localhost:8000";

interface Venue {
  id: number;
  name: string;
  description: string;
  venue_type: string;
  city: string;
  address: string;
  capacity: number;
  price_per_day: number;
  amenities: string;
  images: string;
  is_active: boolean;
  created_at: string;
}

const FeaturedVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${API_URL}/venues`);
        if (response.ok) {
          const allVenues = await response.json();
          // Take only the first 3 venues
          setVenues(allVenues.slice(0, 3));
        } else {
          console.error("Failed to fetch venues");
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleViewDetails = (venueId: number) => {
    navigate(`/venues/${venueId}`);
  };

  const handleViewAllVenues = () => {
    navigate("/venues");
  };

  // Helper function to parse venue images
  const parseVenueImages = (imagesString: string) => {
    try {
      return imagesString ? JSON.parse(imagesString) : [];
    } catch (error) {
      return [];
    }
  };

  if (isLoading) {
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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading venues...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
        
        {venues.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No venues available</h3>
            <p className="text-muted-foreground mb-4">Check back later for new venues</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => {
                const images = parseVenueImages(venue.images);
                const firstImage = images.length > 0 ? images[0] : null;
                
                return (
                  <Card key={venue.id} className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl border bg-card">
                    <div className="relative h-64 overflow-hidden">
                      {firstImage ? (
                        <img
                          src={`data:image/jpeg;base64,${firstImage}`}
                          alt={`${venue.name} - Premium wedding venue in ${venue.city}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-secondary/50 to-secondary flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-5 bg-card">
                      <h3 className="font-serif text-xl mb-2 text-primary font-semibold">{venue.name}</h3>
                      <p className="text-muted-foreground text-sm mb-1">{venue.city}, Pakistan</p>
                      <p className="text-xs text-muted-foreground mb-2">{venue.capacity} guests</p>
                      <p className="text-sm font-medium text-maroon mb-4">PKR {venue.price_per_day.toLocaleString()}/day</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-gray-700 group-hover:border-beige group-hover:text-beige transition-all"
                        onClick={() => handleViewDetails(venue.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {venues.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={handleViewAllVenues}
                  className="bg-gradient-to-r from-maroon to-maroon-light hover:from-maroon-dark hover:to-maroon text-white px-8 py-3"
                >
                  View All Venues
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedVenues;
