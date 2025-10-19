import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Star, Heart, Filter, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const Venues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCapacity, setSelectedCapacity] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch venues from API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(`${API_URL}/venues`);
        if (response.ok) {
          const data = await response.json();
          setVenues(data);
          setFilteredVenues(data);
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

  // Get unique locations for filter
  const locations = ["All", ...new Set(venues.map(venue => venue.city))];
  
  // Capacity ranges for filter
  const capacityRanges = ["All", "100-250", "250-500", "500-1000", "1000+"];

  useEffect(() => {
    let filtered = venues;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location
    if (selectedLocation !== "All") {
      filtered = filtered.filter(venue => venue.city === selectedLocation);
    }

    // Filter by capacity
    if (selectedCapacity !== "All") {
      filtered = filtered.filter(venue => {
        const capacity = venue.capacity;
        switch (selectedCapacity) {
          case "100-250":
            return capacity >= 100 && capacity <= 250;
          case "250-500":
            return capacity > 250 && capacity <= 500;
          case "500-1000":
            return capacity > 500 && capacity <= 1000;
          case "1000+":
            return capacity > 1000;
          default:
            return true;
        }
      });
    }

    setFilteredVenues(filtered);
  }, [searchTerm, selectedLocation, selectedCapacity, venues]);

  const toggleFavorite = (venueId: number) => {
    setVenues(prevVenues =>
      prevVenues.map(venue =>
        venue.id === venueId ? { ...venue, isFavorite: !(venue as any).isFavorite } : venue
      )
    );
  };

  const handleViewDetails = (venueId: number) => {
    navigate(`/venues/${venueId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading venues...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-3">
              Discover Perfect Venues
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              Find the ideal venue for your special event from our curated collection of beautiful spaces
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="bg-card rounded-2xl shadow-card p-6 border">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search venues by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-border focus:border-beige rounded-xl bg-background"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-primary">Filters</h3>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-secondary"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
              >
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border-2 border-border rounded-lg focus:border-beige focus:outline-none bg-background"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Capacity
                  </label>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="w-full p-3 border-2 border-border rounded-lg focus:border-beige focus:outline-none bg-background"
                  >
                    {capacityRanges.map(capacity => (
                      <option key={capacity} value={capacity}>
                        {capacity === "All" ? "All Capacities" : `${capacity} guests`}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredVenues.length} of {venues.length} venues
          </div>
        </div>
      </motion.div>

      {/* Venues Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        <AnimatePresence mode="wait">
          {filteredVenues.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-primary mb-2">No venues found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <motion.div
                  key={venue.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 border bg-card group cursor-pointer">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {(() => {
                        try {
                          const images = venue.images ? JSON.parse(venue.images) : [];
                          const firstImage = images.length > 0 ? images[0] : null;
                          return firstImage ? (
                            <img
                              src={`data:image/jpeg;base64,${firstImage}`}
                              alt={venue.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary/50 to-secondary flex items-center justify-center">
                              <Building2 className="h-16 w-16 text-muted-foreground" />
                            </div>
                          );
                        } catch (error) {
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-secondary/50 to-secondary flex items-center justify-center">
                              <Building2 className="h-16 w-16 text-muted-foreground" />
                            </div>
                          );
                        }
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(venue.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            venue.isFavorite ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-beige text-beige" />
                        <span className="text-sm font-medium text-primary">-</span>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="font-serif text-xl font-semibold text-primary group-hover:text-beige transition-colors">
                        {venue.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {venue.city}, Pakistan
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {venue.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {venue.amenities ? venue.amenities.split(', ').slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity.trim()}
                          </Badge>
                        )) : null}
                        {venue.amenities && venue.amenities.split(', ').length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{venue.amenities.split(', ').length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Capacity and Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{venue.capacity} guests</span>
                        </div>
                        <div className="text-lg font-bold text-beige">
                          PKR {venue.price_per_day.toLocaleString()}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleViewDetails(venue.id)}
                        variant="outline"
                        size="sm"
                        className="w-full text-gray-700 group-hover:border-beige group-hover:text-beige transition-all"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Venues;
