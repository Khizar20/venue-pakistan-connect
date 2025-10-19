import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AddVenueModal from "@/components/AddVenueModal";
import EditVenueModal from "@/components/EditVenueModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Building2,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Bell,
  LogOut,
  User,
  CreditCard,
  Star,
  TrendingUp,
  Package,
  MessageSquare,
  Trash2,
  Edit,
} from "lucide-react";

const API_URL = "http://localhost:8000";

interface VendorInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  cnic_number: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

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

const VendorDashboard = () => {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false);
  const [isEditVenueModalOpen, setIsEditVenueModalOpen] = useState(false);
  const [venueToEdit, setVenueToEdit] = useState<Venue | null>(null);
  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<{ id: number; name: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchVenues = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/vendor/venues`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      } else {
        console.error("Failed to fetch venues");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  useEffect(() => {
    const fetchVendorInfo = async () => {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/vendor/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVendor(data);
          setProfileData({ name: data.name, phone: data.phone });
          // Fetch venues after vendor info is loaded
          await fetchVenues();
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_type");
          navigate("/login");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vendor information",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorInfo();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_type");
    
    // Trigger navbar refresh
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleVenueAdded = () => {
    toast({
      title: "Success!",
      description: "Your venue has been added successfully",
    });
    // Refresh venues
    fetchVenues();
    // Switch to venues section
    setActiveSection("venues");
  };

  const handleVenueUpdated = () => {
    toast({
      title: "Success!",
      description: "Your venue has been updated successfully",
    });
    // Refresh venues
    fetchVenues();
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await fetch(`${API_URL}/vendor/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        setVendor(data);
        setIsEditingProfile(false);
        toast({
          title: "Success!",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setProfileData({ name: vendor?.name || "", phone: vendor?.phone || "" });
    setIsEditingProfile(false);
  };

  const handleEditVenue = (venue: Venue) => {
    setVenueToEdit(venue);
    setIsEditVenueModalOpen(true);
  };

  const handleDeleteVenue = (venueId: number, venueName: string) => {
    setVenueToDelete({ id: venueId, name: venueName });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVenue = async () => {
    if (!venueToDelete) return;

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

      const response = await fetch(`${API_URL}/vendor/venues/${venueToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Venue "${venueToDelete.name}" has been deleted successfully`,
        });
        // Refresh venues
        fetchVenues();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.detail || "Failed to delete venue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the venue",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setVenueToDelete(null);
    }
  };

  const sidebarItems = [
    {
      title: "Overview",
      icon: Home,
      id: "overview",
    },
    {
      title: "My Venues",
      icon: Building2,
      id: "venues",
    },
    {
      title: "Bookings",
      icon: Calendar,
      id: "bookings",
    },
    {
      title: "Customers",
      icon: Users,
      id: "customers",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      id: "analytics",
    },
    {
      title: "Reviews",
      icon: Star,
      id: "reviews",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      id: "messages",
    },
    {
      title: "Payments",
      icon: CreditCard,
      id: "payments",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {vendor?.name}!</h2>
              <p className="text-muted-foreground mt-2">Here's what's happening with your venues today</p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Total Venues</CardTitle>
                  <Building2 className="h-4 w-4 text-maroon" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{venues.length}</div>
                  <p className="text-xs text-muted-foreground">Active venues</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-maroon" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">12</div>
                  <p className="text-xs text-muted-foreground">+3 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Monthly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-maroon" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">PKR 45,000</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Avg Rating</CardTitle>
                  <Star className="h-4 w-4 text-maroon" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">4.8</div>
                  <p className="text-xs text-muted-foreground">Based on 24 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="font-medium text-foreground">{vendor?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{vendor?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="font-medium text-foreground">{vendor?.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CNIC</span>
                    <span className="font-medium text-foreground">{vendor?.cnic_number}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Account Status
                  </CardTitle>
                  <CardDescription>Your account verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email Verified</span>
                    <Badge variant={vendor?.is_verified ? "default" : "destructive"}>
                      {vendor?.is_verified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Active</span>
                    <Badge variant={vendor?.is_active ? "default" : "destructive"}>
                      {vendor?.is_active ? "Active" : "Pending Approval"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-medium text-foreground">
                      {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  {!vendor?.is_active && (
                    <div className="mt-4 p-3 bg-secondary/50 border border-border rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Your account is pending admin approval. You'll be notified once it's activated.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest venue activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-2 h-2 bg-maroon rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">New booking received</p>
                      <p className="text-xs text-muted-foreground">Wedding Hall - Dec 15, 2024</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-2 h-2 bg-maroon rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">New review received</p>
                      <p className="text-xs text-muted-foreground">5 stars for Garden Venue</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-2 h-2 bg-maroon rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Payment received</p>
                      <p className="text-xs text-muted-foreground">PKR 25,000 for Conference Hall</p>
                    </div>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "venues":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">My Venues</h2>
                <p className="text-muted-foreground mt-2">Manage your venue listings</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-maroon to-maroon-light hover:from-maroon-dark hover:to-maroon"
                onClick={() => setIsAddVenueModalOpen(true)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Add New Venue
              </Button>
            </div>

            {venues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No venues yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by adding your first venue to attract customers
                </p>
                <Button 
                  className="bg-gradient-to-r from-maroon to-maroon-light hover:from-maroon-dark hover:to-maroon"
                  onClick={() => setIsAddVenueModalOpen(true)}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Your First Venue
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {venues.map((venue) => (
                  <Card key={venue.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="aspect-video rounded-t-lg overflow-hidden">
                      {(() => {
                        try {
                          const images = venue.images ? JSON.parse(venue.images) : [];
                          const firstImage = images.length > 0 ? images[0] : null;
                          return firstImage ? (
                            <img
                              src={`data:image/jpeg;base64,${firstImage}`}
                              alt={venue.name}
                              className="w-full h-full object-cover"
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
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground">{venue.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{venue.description}</CardDescription>
                        </div>
                        <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEditVenue(venue)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteVenue(venue.id, venue.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={venue.is_active ? "default" : "secondary"}>
                          {venue.is_active ? "Active" : "Draft"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">-</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Capacity: {venue.capacity} guests</p>
                        <p>Price: PKR {venue.price_per_day.toLocaleString()}/day</p>
                        <p>Type: {venue.venue_type}</p>
                        <p>City: {venue.city}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground mt-2">Manage your account settings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Information</span>
                  {!isEditingProfile && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                      className="text-foreground hover:text-foreground hover:bg-secondary"
                    >
                      Edit Profile
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingProfile ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleProfileUpdate} className="bg-gradient-to-r from-maroon to-maroon-light">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="text-foreground hover:text-foreground hover:bg-secondary">
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">{vendor?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="font-medium text-foreground">{vendor?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="font-medium text-foreground">{vendor?.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CNIC</span>
                      <span className="font-medium text-foreground">{vendor?.cnic_number}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Read-only account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge variant={vendor?.is_active ? "default" : "destructive"}>
                    {vendor?.is_active ? "Active" : "Pending Approval"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  <Badge variant={vendor?.is_verified ? "default" : "destructive"}>
                    {vendor?.is_verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-medium text-foreground">
                    {vendor?.created_at ? new Date(vendor.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {sidebarItems.find(item => item.id === activeSection)?.title} Coming Soon
              </h3>
              <p className="text-muted-foreground">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-beige-light">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-cream via-white to-beige-light">
        <Sidebar className="border-r border-border bg-card/95 backdrop-blur-md shadow-lg">
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center gap-2 p-4">
              <div className="w-8 h-8 bg-gradient-to-br from-maroon to-maroon-light rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/")}
              >
                <h1 className="font-bold text-lg text-foreground">Shadiejo</h1>
                <p className="text-xs text-muted-foreground">Vendor Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 overflow-y-auto flex-1">
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full justify-start transition-all duration-200 hover:bg-secondary/50"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-maroon to-maroon-light rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{vendor?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{vendor?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/95 backdrop-blur-md shadow-sm px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                {sidebarItems.find(item => item.id === activeSection)?.title}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-cream/30 via-white/80 to-beige-light/30">
            <div className="container mx-auto p-6 max-w-7xl">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>

      <AddVenueModal 
        open={isAddVenueModalOpen}
        onOpenChange={setIsAddVenueModalOpen}
        onVenueAdded={handleVenueAdded}
      />

      <EditVenueModal
        open={isEditVenueModalOpen}
        onOpenChange={setIsEditVenueModalOpen}
        venue={venueToEdit}
        onVenueUpdated={handleVenueUpdated}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Venue
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete <strong>"{venueToDelete?.name}"</strong>? 
              <br /><br />
              This action cannot be undone and will permanently remove the venue from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              className="text-foreground hover:text-foreground hover:bg-secondary"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteVenue}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Venue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default VendorDashboard;
