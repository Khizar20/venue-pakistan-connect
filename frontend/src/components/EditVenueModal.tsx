import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

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

interface EditVenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue | null;
  onVenueUpdated: () => void;
}

const EditVenueModal = ({ open, onOpenChange, venue, onVenueUpdated }: EditVenueModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue_type: "",
    city: "",
    address: "",
    capacity: "",
    price_per_day: "",
    amenities: "",
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const venueTypes = [
    "Wedding Hall",
    "Garden Venue",
    "Conference Center",
    "Banquet Hall",
    "Outdoor Venue",
    "Resort",
    "Hotel Venue",
    "Restaurant",
    "Other"
  ];

  const cities = [
    "Islamabad",
    "Lahore",
    "Karachi"
  ];

  // Initialize form data when venue changes
  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name,
        description: venue.description || "",
        venue_type: venue.venue_type,
        city: venue.city,
        address: venue.address,
        capacity: venue.capacity.toString(),
        price_per_day: venue.price_per_day.toString(),
        amenities: venue.amenities || "",
      });
      
      // Parse existing amenities
      if (venue.amenities) {
        setAmenities(venue.amenities.split(', ').filter(a => a.trim()));
      } else {
        setAmenities([]);
      }
    }
  }, [venue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload only image files",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Maximum 10MB per image.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleAmenityKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;
    
    setIsLoading(true);

    // Validate capacity
    const capacity = parseInt(formData.capacity);
    if (capacity < 21) {
      toast({
        title: "Invalid Capacity",
        description: "Guest capacity must be at least 21 guests",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate price
    const price = parseInt(formData.price_per_day);
    if (price < 1000) {
      toast({
        title: "Invalid Price",
        description: "Price must be at least PKR 1,000",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("venue_type", formData.venue_type);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("price_per_day", formData.price_per_day);
      formDataToSend.append("amenities", amenities.join(", "));
      
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch(`${API_URL}/vendor/venues/${venue.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Venue updated successfully",
        });
        
        onVenueUpdated();
        onOpenChange(false);
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.detail || "Failed to update venue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!venue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
          <DialogDescription>
            Update the details for {venue.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Royal Wedding Hall"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_type">Venue Type *</Label>
              <Select
                value={formData.venue_type}
                onValueChange={(value) => setFormData({ ...formData, venue_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select venue type" />
                </SelectTrigger>
                <SelectContent>
                  {venueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your venue..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select
                value={formData.city}
                onValueChange={(value) => setFormData({ ...formData, city: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (guests) *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
                placeholder="200"
                min="21"
              />
              <p className="text-xs text-muted-foreground">Minimum capacity: 21 guests</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Full address of the venue"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_per_day">Price per Day (PKR) *</Label>
              <Input
                id="price_per_day"
                name="price_per_day"
                type="number"
                value={formData.price_per_day}
                onChange={handleChange}
                required
                placeholder="15000"
                min="1000"
                step="1"
              />
              <p className="text-xs text-muted-foreground">Minimum price: PKR 1,000</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="amenities"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyPress={handleAmenityKeyPress}
                    placeholder="Enter amenity and press Enter"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAmenity}
                    disabled={!amenityInput.trim()}
                    className="text-foreground hover:text-foreground hover:bg-secondary"
                  >
                    Add
                  </Button>
                </div>
                {amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Venue Images (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="venue-images"
              />
              <Label
                htmlFor="venue-images"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload additional venue images (Max 10MB each)
                </span>
              </Label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="text-foreground hover:text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-maroon to-maroon-light">
              {isLoading ? "Updating..." : "Update Venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVenueModal;
