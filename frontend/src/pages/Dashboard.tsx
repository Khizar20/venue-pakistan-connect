import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import VendorDashboard from "./VendorDashboard";
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
  User,
  Heart,
  Calendar,
  Settings,
  Bell,
  LogOut,
  Building2,
  Star,
  MapPin,
  Search,
  Filter,
} from "lucide-react";

const API_URL = "http://localhost:8000";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

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

const Dashboard = () => {
  const [user, setUser] = useState<UserInfo | VendorInfo | null>(null);
  const [userType, setUserType] = useState<"user" | "vendor" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    {
      title: "Overview",
      icon: Home,
      id: "overview",
    },
    {
      title: "Browse Venues",
      icon: Building2,
      id: "venues",
    },
    {
      title: "Favorites",
      icon: Heart,
      id: "favorites",
    },
    {
      title: "Bookings",
      icon: Calendar,
      id: "bookings",
    },
    {
      title: "Profile",
      icon: User,
      id: "profile",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      // Check for token in URL first (from OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      
      if (urlToken) {
        localStorage.setItem("access_token", urlToken);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      const token = localStorage.getItem("access_token");
      const storedUserType = localStorage.getItem("user_type");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Determine which endpoint to call based on user type
        const endpoint = storedUserType === "vendor" ? "/vendor/me" : "/auth/me";
        
        const response = await fetch(`${API_URL}${endpoint}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setUserType(storedUserType as "user" | "vendor" || "user");
        } else {
          // If the first attempt fails, try the other endpoint
          const fallbackEndpoint = storedUserType === "vendor" ? "/auth/me" : "/vendor/me";
          const fallbackResponse = await fetch(`${API_URL}${fallbackEndpoint}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            setUser(data);
            setUserType(fallbackEndpoint === "/vendor/me" ? "vendor" : "user");
            localStorage.setItem("user_type", fallbackEndpoint === "/vendor/me" ? "vendor" : "user");
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_type");
            navigate("/login");
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
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

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({ title: "Authentication Error", description: "Please login again", variant: "destructive" });
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditingProfile(false);
        toast({ title: "Success!", description: "Profile updated successfully" });
      } else {
        const data = await response.json();
        toast({ title: "Error", description: data.detail || "Failed to update profile", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    setProfileData({ name: user?.name || "", phone: user?.phone || "" });
    setIsEditingProfile(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-beige-light">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is a vendor, show the vendor dashboard
  if (userType === "vendor") {
    return <VendorDashboard />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-cream via-white to-beige-light">
        <Sidebar className="border-r border-border bg-card/95 backdrop-blur-md shadow-lg">
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center gap-2 p-4">
              <div className="w-8 h-8 bg-gradient-to-br from-maroon to-maroon-light rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/")}
              >
                <h1 className="font-bold text-lg text-foreground">Shadiejo</h1>
                <p className="text-xs text-muted-foreground">User Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 overflow-y-auto flex-1">
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full justify-start ${
                        activeSection === item.id
                          ? "bg-maroon/10 text-maroon border-r-2 border-maroon"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-2">
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

        <SidebarInset className="flex-1 overflow-y-auto">
          <main className="p-6">
            {/* Header */}
        <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome, {user?.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Manage your account and explore venues
          </p>
        </div>

            {/* Content based on active section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-foreground">Account Type</CardTitle>
                      <User className="h-4 w-4 text-maroon" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground capitalize">{userType}</div>
                      <p className="text-xs text-muted-foreground">User Account</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-foreground">Favorites</CardTitle>
                      <Heart className="h-4 w-4 text-maroon" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">0</div>
                      <p className="text-xs text-muted-foreground">Saved venues</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-foreground">Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-maroon" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">0</div>
                      <p className="text-xs text-muted-foreground">Active bookings</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-foreground">Status</CardTitle>
                      <Star className="h-4 w-4 text-maroon" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">
                        {user?.is_verified ? "✓" : "!"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {user?.is_verified ? "Verified" : "Pending"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with these common tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-20 flex flex-col gap-2 text-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => navigate("/venues")}
                      >
                        <Building2 className="h-6 w-6" />
                        <span>Browse Venues</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex flex-col gap-2 text-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => setActiveSection("favorites")}
                      >
                        <Heart className="h-6 w-6" />
                        <span>View Favorites</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex flex-col gap-2 text-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => setActiveSection("profile")}
                      >
                        <User className="h-6 w-6" />
                        <span>Edit Profile</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "venues" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Browse Venues</CardTitle>
                    <CardDescription>Discover amazing venues for your events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Explore Venues</h3>
                      <p className="text-muted-foreground mb-4">
                        Browse our collection of beautiful venues
                      </p>
                      <Button onClick={() => navigate("/venues")} className="bg-gradient-to-r from-maroon to-maroon-light">
                        <Building2 className="h-4 w-4 mr-2" />
                        Browse All Venues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "favorites" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Venues</CardTitle>
                    <CardDescription>Your saved venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start exploring venues and add them to your favorites
                      </p>
                      <Button onClick={() => navigate("/venues")} className="bg-gradient-to-r from-maroon to-maroon-light">
                        <Building2 className="h-4 w-4 mr-2" />
                        Browse Venues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "bookings" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>Manage your venue bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Book a venue to see your reservations here
                      </p>
                      <Button onClick={() => navigate("/venues")} className="bg-gradient-to-r from-maroon to-maroon-light">
                        <Building2 className="h-4 w-4 mr-2" />
                        Browse Venues
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="space-y-6">
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
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditingProfile ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              placeholder="Your phone number"
                            />
                          </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user?.email}</p>
              </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium text-foreground">{user?.phone || "Not provided"}</p>
                </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground capitalize">{userType}</p>
              </div>
                        </div>
                      </>
                    )}
            </CardContent>
          </Card>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="space-y-6">
          <Card>
            <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
                  <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your bookings</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-foreground hover:text-foreground hover:bg-secondary">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-foreground hover:text-foreground hover:bg-secondary">Change</Button>
              </div>
                    <div className="flex items-center justify-between">
              <div>
                        <p className="font-medium text-foreground">Account Status</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.is_verified ? "Verified" : "Pending verification"}
                </p>
              </div>
                      <Badge variant={user?.is_verified ? "default" : "secondary"}>
                        {user?.is_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
            </CardContent>
          </Card>
        </div>
            )}
      </main>
        </SidebarInset>
    </div>
    </SidebarProvider>
  );
};

export default Dashboard;

