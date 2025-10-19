import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Star, Heart, Phone, Mail, Calendar, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

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

// Helper function to parse venue images
const parseVenueImages = (imagesString: string) => {
  try {
    return imagesString ? JSON.parse(imagesString) : [];
  } catch (error) {
    return [];
  }
};

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`${API_URL}/venues/${id}`);
        if (response.ok) {
          const venueData = await response.json();
          setVenue(venueData);
          setCurrentImageIndex(0); // Reset to first image when venue changes
        } else if (response.status === 404) {
          setVenue(null); // Venue not found
        } else {
          console.error("Failed to fetch venue");
          setVenue(null);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
        setVenue(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookNow = () => {
    // In a real app, this would redirect to booking form or contact
    alert("Booking functionality would be implemented here!");
  };

  const nextImage = () => {
    const images = parseVenueImages(venue?.images || "");
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = parseVenueImages(venue?.images || "");
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
          <Button onClick={() => navigate("/venues")}>
            Back to Venues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/venues")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Venues
          </Button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {(() => {
                const images = parseVenueImages(venue.images);
                
                if (images.length === 0) {
                  return (
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-secondary/50 to-secondary flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-muted-foreground" />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
                      
                      {/* Favorite Button */}
                      <button
                        onClick={toggleFavorite}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            isFavorite ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                        <Star className="h-5 w-5 fill-beige text-beige" />
                        <span className="font-semibold text-primary">-</span>
                      </div>
                    </div>
                  );
                }

                if (images.length === 1) {
                  return (
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={`data:image/jpeg;base64,${images[0]}`}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
                      
                      {/* Favorite Button */}
                      <button
                        onClick={toggleFavorite}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            isFavorite ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                        <Star className="h-5 w-5 fill-beige text-beige" />
                        <span className="font-semibold text-primary">-</span>
                      </div>
                    </div>
                  );
                }

                // Multiple images - show gallery
                return (
                  <div className="space-y-4">
                    {/* Main Image with Navigation */}
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group">
                      <img
                        src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
                      
                      {/* Navigation Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeft className="h-6 w-6 text-white" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight className="h-6 w-6 text-white" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      {images.length > 1 && (
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={toggleFavorite}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            isFavorite ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                        <Star className="h-5 w-5 fill-beige text-beige" />
                        <span className="font-semibold text-primary">-</span>
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            onClick={() => selectImage(index)}
                            className={`relative h-20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
                              index === currentImageIndex 
                                ? 'border-maroon ring-2 ring-maroon/50' 
                                : 'border-transparent hover:border-maroon/50'
                            }`}
                          >
                            <img
                              src={`data:image/jpeg;base64,${image}`}
                              alt={`${venue.name} ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-maroon/20 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>

            {/* Venue Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-card border bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl font-semibold text-primary">
                    {venue.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-lg text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    {venue.city}, Pakistan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {venue.description}
                  </p>

                  {/* Features */}
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-primary mb-4">Features & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {venue.amenities ? venue.amenities.split(', ').map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                          {amenity.trim()}
                        </Badge>
                      )) : (
                        <span className="text-sm text-muted-foreground">No amenities listed</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="shadow-card border bg-card sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-beige">
                    PKR {venue.price_per_day.toLocaleString()}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Starting price per event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Capacity */}
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{venue.capacity} guests</span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-beige" />
                    <span className="text-beige font-medium">Available for booking</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-semibold text-primary">Contact Information</h4>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Contact venue owner for details</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Contact venue owner for details</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleBookNow}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all duration-200"
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-beige text-beige hover:bg-beige hover:text-primary font-medium py-3 rounded-lg transition-all duration-200"
                    >
                      Request Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
