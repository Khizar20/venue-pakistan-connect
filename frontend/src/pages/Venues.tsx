import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Star, Heart, Filter, Building2, SlidersHorizontal, X, Check, DollarSign, Users2, Calendar, Utensils, Sparkles, Volume2, Lightbulb, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CustomSelect from "@/components/ui/custom-select";

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

  // Advanced filter states
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedVenueType, setSelectedVenueType] = useState("All");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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

  // Venue types
  const venueTypes = [
    "All", "Wedding Hall", "Garden Venue", "Banquet Hall", 
    "Outdoor Venue", "Resort", "Hotel Venue", "Marquee", 
    "Farmhouse", "Club", "Conference Center"
  ];

  // Services offered
  const servicesOffered = [
    "Catering", "Decoration", "Sound System", "Lighting", 
    "Event Management", "Photography", "Security", "Parking", 
    "Air Conditioning", "WiFi", "Stage", "Dance Floor"
  ];

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

    // Filter by maximum price
    filtered = filtered.filter(venue => 
      venue.price_per_day <= priceRange[1]
    );

    // Filter by venue type
    if (selectedVenueType !== "All") {
      filtered = filtered.filter(venue => venue.venue_type === selectedVenueType);
    }

    // Filter by services offered - ALL selected services must be present
    if (selectedServices.length > 0) {
      filtered = filtered.filter(venue => {
        if (!venue.amenities) return false;
        const venueAmenities = venue.amenities.toLowerCase();
        return selectedServices.every(service => 
          venueAmenities.includes(service.toLowerCase())
        );
      });
    }

    console.log('Filtering venues:', {
      totalVenues: venues.length,
      filteredVenues: filtered.length,
      priceRange,
      selectedVenueType,
      selectedServices,
      searchTerm
    });

    setFilteredVenues(filtered);
  }, [searchTerm, selectedLocation, selectedCapacity, priceRange, selectedVenueType, selectedServices, venues]);

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

  // Helper functions for advanced filters
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedLocation("All");
    setSelectedCapacity("All");
    setPriceRange([0, 10000000]);
    setSelectedVenueType("All");
    setSelectedServices([]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedLocation !== "All") count++;
    if (selectedCapacity !== "All") count++;
    if (priceRange[1] < 10000000) count++;
    if (selectedVenueType !== "All") count++;
    if (selectedServices.length > 0) count++;
    return count;
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

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-primary">Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-beige/20 text-beige border-beige/30">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-secondary"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            </div>
          </div>

          {/* All Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 overflow-hidden"
              >
                {/* Basic Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                    <CustomSelect
                      options={locations.map(location => ({
                        value: location,
                        label: location
                      }))}
                    value={selectedLocation}
                      onChange={setSelectedLocation}
                      placeholder="Select location"
                    />
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                      <Users2 className="h-4 w-4 inline mr-1" />
                    Capacity
                  </label>
                    <CustomSelect
                      options={capacityRanges.map(capacity => ({
                        value: capacity,
                        label: capacity === "All" ? "All Capacities" : `${capacity} guests`
                      }))}
                    value={selectedCapacity}
                      onChange={setSelectedCapacity}
                      placeholder="Select capacity"
                    />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-primary mb-3">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Maximum Price (PKR)
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      {/* Track */}
                      <div className="w-full h-2 bg-border rounded-lg relative">
                        {/* Active range from 0 to current value */}
                        <div 
                          className="absolute h-2 bg-beige rounded-lg"
                          style={{
                            left: '0%',
                            width: `${(priceRange[1] / 10000000) * 100}%`
                          }}
                        />
                      </div>
                      
                      {/* Single thumb handle */}
                      <div
                        className="absolute w-5 h-5 bg-beige border-2 border-background rounded-full shadow-lg cursor-pointer transform -translate-y-1.5 hover:scale-110 transition-transform"
                        style={{
                          left: `calc(${(priceRange[1] / 10000000) * 100}% - 10px)`,
                          top: '50%'
                        }}
                      />
                      
                      {/* Invisible range input for interaction */}
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="absolute top-0 w-full h-2 opacity-0 cursor-pointer z-10"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>PKR 0</span>
                      <span>PKR {priceRange[1] >= 1000000 ? `${(priceRange[1] / 1000000).toFixed(1)}M` : priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Venue Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <Building2 className="h-4 w-4 inline mr-1" />
                    Venue Type
                  </label>
                  <CustomSelect
                    options={venueTypes.map(type => ({
                      value: type,
                      label: type
                    }))}
                    value={selectedVenueType}
                    onChange={setSelectedVenueType}
                    placeholder="Select venue type"
                  />
                </div>

                {/* Services Offered Filter */}
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-primary mb-3">
                    <Settings className="h-4 w-4 inline mr-1" />
                    Services Offered
                    <span className="text-xs text-muted-foreground ml-2">
                      (Select all that apply - venue must have ALL selected services)
                    </span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {servicesOffered.map(service => (
                      <motion.button
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all duration-200 ${
                          selectedServices.includes(service)
                            ? 'bg-beige text-primary border-2 border-beige'
                            : 'bg-background text-muted-foreground border-2 border-border hover:border-beige/50 hover:bg-secondary/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {selectedServices.includes(service) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        {service}
                      </motion.button>
                    ))}
                  </div>
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
