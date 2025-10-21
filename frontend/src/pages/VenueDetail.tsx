import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Star, Heart, Phone, Mail, Calendar, Building2, ChevronLeft, ChevronRight, ThumbsUp, MessageCircle, User } from "lucide-react";
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
  video?: string;
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

  // Build combined media list from images + optional video
  const getMediaItems = () => {
    const items: { type: 'image' | 'video'; data: string }[] = [];
    const images = parseVenueImages(venue?.images || "");
    for (const img of images) {
      items.push({ type: 'image', data: img });
    }
    if (venue?.video) {
      items.push({ type: 'video', data: venue.video });
    }
    return items;
  };

  const nextImage = () => {
    const media = getMediaItems();
    if (media.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % media.length);
    }
  };

  const prevImage = () => {
    const media = getMediaItems();
    if (media.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
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
                const media = getMediaItems();

                if (media.length === 0) {
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

                if (media.length === 1) {
                  const item = media[0];
                  return (
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                      {item.type === 'image' ? (
                        <img
                          src={`data:image/jpeg;base64,${item.data}`}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover bg-black"
                          src={`data:video/mp4;base64,${item.data}`}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                        />
                      )}
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

                // Multiple media - show gallery
                return (
                  <div className="space-y-4">
                    {/* Main Image with Navigation */}
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl group">
                      {media[currentImageIndex].type === 'image' ? (
                        <img
                          src={`data:image/jpeg;base64,${media[currentImageIndex].data}`}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover bg-black"
                          src={`data:video/mp4;base64,${media[currentImageIndex].data}`}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent" />
                      
                      {/* Navigation Arrows */}
                      {media.length > 1 && (
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
                      {media.length > 1 && (
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                          {currentImageIndex + 1} / {media.length}
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
                    {media.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {media.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => selectImage(index)}
                            className={`relative h-20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
                              index === currentImageIndex 
                                ? 'border-maroon ring-2 ring-maroon/50' 
                                : 'border-transparent hover:border-maroon/50'
                            }`}
                          >
                            {item.type === 'image' ? (
                              <img
                                src={`data:image/jpeg;base64,${item.data}`}
                                alt={`${venue.name} ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full bg-black/80 flex items-center justify-center text-white text-xs">
                                Video
                              </div>
                            )}
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

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="shadow-card border bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl font-semibold text-primary flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-beige" />
                    Customer Reviews
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-beige text-beige" />
                      <span className="text-lg font-semibold text-primary">4.8</span>
                      <span className="text-muted-foreground">(24 reviews)</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Review Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">4.8</div>
                      <div className="text-sm text-muted-foreground">Overall Rating</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">24</div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-sm text-muted-foreground">Would Recommend</div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {/* Review 1 */}
                    <div className="border-l-4 border-beige pl-4 py-3 bg-secondary/20 rounded-r-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-beige to-beige-light rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">Sarah Ahmed</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-beige text-beige" />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">2 days ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">12</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "Absolutely stunning venue! The staff was incredibly helpful and the space was perfect for our wedding. 
                        The decorations were beautiful and the food service was excellent. Highly recommend!"
                      </p>
                    </div>

                    {/* Review 2 */}
                    <div className="border-l-4 border-beige pl-4 py-3 bg-secondary/20 rounded-r-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-maroon to-maroon-light rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">Ahmed Hassan</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-beige text-beige" />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">1 week ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">8</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "Perfect venue for our corporate event. The space was clean, well-maintained, and the acoustics were great. 
                        The team was professional and made everything run smoothly."
                      </p>
                    </div>

                    {/* Review 3 */}
                    <div className="border-l-4 border-beige pl-4 py-3 bg-secondary/20 rounded-r-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">Fatima Khan</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-beige text-beige" />
                              ))}
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground ml-2">2 weeks ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">15</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "Great venue with excellent facilities. The parking was convenient and the location was easy to find. 
                        The only minor issue was the air conditioning, but overall it was a wonderful experience."
                      </p>
                    </div>

                    {/* Review 4 */}
                    <div className="border-l-4 border-beige pl-4 py-3 bg-secondary/20 rounded-r-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">Muhammad Ali</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-beige text-beige" />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">3 weeks ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">22</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "Outstanding service and beautiful venue! The staff went above and beyond to make our event special. 
                        The venue was spacious, clean, and had all the amenities we needed. Will definitely book again!"
                      </p>
                    </div>

                    {/* Review 5 */}
                    <div className="border-l-4 border-beige pl-4 py-3 bg-secondary/20 rounded-r-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary">Ayesha Malik</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-beige text-beige" />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">1 month ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">18</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "Beautiful venue with excellent customer service. The team was very accommodating and helped us 
                        plan every detail of our event. The space was perfect for our needs and the pricing was very reasonable."
                      </p>
                    </div>
                  </div>

                  {/* Load More Reviews Button */}
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      className="text-foreground hover:text-foreground hover:bg-secondary border-border"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Load More Reviews
                    </Button>
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
