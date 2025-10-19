import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, Settings, UserCircle, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:8000";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role?: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userType, setUserType] = useState<"user" | "vendor" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Listen for storage changes to update auth state when user logs in from another tab
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoggedIn(false);
        setUserInfo(null);
        setUserType(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("access_token");
      const storedUserType = localStorage.getItem("user_type");
      
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
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
          setUserInfo(data);
          setUserType(storedUserType as "user" | "vendor" || "user");
          setIsLoggedIn(true);
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
            setUserInfo(data);
            setUserType(fallbackEndpoint === "/vendor/me" ? "vendor" : "user");
            localStorage.setItem("user_type", fallbackEndpoint === "/vendor/me" ? "vendor" : "user");
            setIsLoggedIn(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_type");
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_type");
    setIsLoggedIn(false);
    setUserInfo(null);
    setUserType(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    
    navigate("/");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-primary py-4 px-6 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="font-serif text-3xl text-primary-foreground font-semibold tracking-wide hover:text-beige transition-colors">
          Shadiejo
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/venues" className="text-primary-foreground hover:text-beige transition-all text-sm font-medium relative group">
            Venues
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-beige group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/inspiration" className="text-primary-foreground hover:text-beige transition-all text-sm font-medium relative group">
            Inspiration
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-beige group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/vendors" className="text-primary-foreground hover:text-beige transition-all text-sm font-medium relative group">
            Vendors
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-beige group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/blog" className="text-primary-foreground hover:text-beige transition-all text-sm font-medium relative group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-beige group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        <div className="flex gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>
          ) : isLoggedIn && userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full hover:bg-white/10 transition-all duration-200 border-2 border-transparent hover:border-beige/30"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-beige/20 hover:ring-beige/40 transition-all duration-200">
                      <AvatarFallback className="bg-gradient-to-br from-beige to-beige-light text-primary font-bold text-sm shadow-lg">
                        {getInitials(userInfo.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-72 p-0 bg-white/95 backdrop-blur-md border border-beige/20 shadow-2xl" 
                align="end" 
                forceMount
                sideOffset={8}
              >
                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-r from-primary to-primary/90 p-4 rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-white/30">
                      <AvatarFallback className="bg-gradient-to-br from-beige to-beige-light text-primary font-bold text-lg">
                        {getInitials(userInfo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {userInfo.name}
                      </p>
                      <p className="text-white/80 text-xs truncate">
                        {userInfo.email}
                      </p>
                      <div className="flex items-center mt-1">
                        {userType === "vendor" ? (
                          <Crown className="h-3 w-3 text-beige mr-1" />
                        ) : (
                          <UserCircle className="h-3 w-3 text-beige mr-1" />
                        )}
                        <span className="text-beige text-xs font-medium capitalize">
                          {userType} Account
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <DropdownMenuItem 
                    onClick={handleDashboardClick} 
                    className="dropdown-item-beige cursor-pointer rounded-lg p-3 transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-beige/10 group-hover:bg-beige/20 transition-colors duration-200 mr-3" style={{ backgroundColor: 'hsl(var(--beige) / 0.1)' }}>
                        <LayoutDashboard className="h-4 w-4 transition-colors duration-200" style={{ color: 'hsl(var(--beige))' }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">Dashboard</p>
                        <p className="text-xs text-gray-500">View your account overview</p>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    className="dropdown-item-beige cursor-pointer rounded-lg p-3 transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-beige/10 group-hover:bg-beige/20 transition-colors duration-200 mr-3" style={{ backgroundColor: 'hsl(var(--beige) / 0.1)' }}>
                        <Settings className="h-4 w-4 transition-colors duration-200" style={{ color: 'hsl(var(--beige))' }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">Settings</p>
                        <p className="text-xs text-gray-500">Manage your preferences</p>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2 bg-gray-200" />

                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer rounded-lg p-3 hover:bg-red-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-200 mr-3">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-red-600">Sign Out</p>
                        <p className="text-xs text-red-500">End your current session</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-2 border-beige text-primary-foreground hover:bg-beige hover:text-primary hover:border-beige transition-all font-medium text-sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-beige text-primary hover:bg-beige/90 transition-all font-medium text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
