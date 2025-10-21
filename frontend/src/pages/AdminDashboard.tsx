import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  UserX, 
  BarChart3, 
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  X,
  Home,
  UserPlus,
  Clock,
  Settings
} from "lucide-react";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  cnic_number: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface Stats {
  total_users: number;
  total_vendors: number;
  pending_vendors: number;
  approved_vendors: number;
}

const AdminDashboard = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [adminToken, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [vendorsRes, statsRes] = await Promise.all([
        fetch("http://localhost:8000/admin/vendors", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }),
        fetch("http://localhost:8000/admin/stats", {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }),
      ]);

      if (vendorsRes.ok && statsRes.ok) {
        const vendorsData = await vendorsRes.json();
        const statsData = await statsRes.json();
        setVendors(vendorsData);
        setStats(statsData);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("Network error. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId: number, approved: boolean) => {
    try {
      const response = await fetch("http://localhost:8000/admin/vendors/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          approved: approved,
        }),
      });

      if (response.ok) {
        // Refresh data
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to update vendor status");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userType");
    navigate("/admin/login");
  };

  const pendingVendors = vendors.filter(v => v.is_verified && !v.is_active);
  const approvedVendors = vendors.filter(v => v.is_verified && v.is_active);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "users", label: "Users", icon: UserPlus },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-maroon/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-border`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-maroon">
          <h2 className="text-xl font-bold text-primary-foreground font-serif">Admin Panel</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-primary-foreground hover:bg-maroon-light"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors font-serif ${
                  activeTab === item.id ? 'bg-maroon text-primary-foreground border-r-2 border-maroon' : 'text-foreground hover:text-maroon'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full flex items-center gap-2 text-foreground hover:text-foreground hover:bg-secondary border-border font-serif"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-foreground hover:text-maroon"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground font-serif">
                  {sidebarItems.find(item => item.id === activeTab)?.label || "Admin Dashboard"}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total_users}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total_vendors}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                      <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">{stats.pending_vendors}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Approved Vendors</CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats.approved_vendors}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          {/* Vendors Tab */}
          {activeTab === "vendors" && (
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Approval ({pendingVendors.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedVendors.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendors Pending Approval</CardTitle>
                    <CardDescription>
                      Review and approve vendor applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingVendors.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No pending vendors</p>
                    ) : (
                      <div className="space-y-4">
                        {pendingVendors.map((vendor) => (
                          <div key={vendor.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <h3 className="font-semibold">{vendor.name}</h3>
                                <p className="text-sm text-muted-foreground">{vendor.email}</p>
                                <p className="text-sm text-muted-foreground">Phone: {vendor.phone}</p>
                                <p className="text-sm text-muted-foreground">CNIC: {vendor.cnic_number}</p>
                                <p className="text-xs text-muted-foreground">
                                  Applied: {new Date(vendor.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveVendor(vendor.id, false)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveVendor(vendor.id, true)}
                                  className="bg-maroon hover:bg-maroon-light text-primary-foreground"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Approved Vendors</CardTitle>
                    <CardDescription>
                      Vendors who have been approved and can access their dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {approvedVendors.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No approved vendors</p>
                    ) : (
                      <div className="space-y-4">
                        {approvedVendors.map((vendor) => (
                          <div key={vendor.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{vendor.name}</h3>
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approved
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{vendor.email}</p>
                                <p className="text-sm text-muted-foreground">Phone: {vendor.phone}</p>
                                <p className="text-sm text-muted-foreground">CNIC: {vendor.cnic_number}</p>
                                <p className="text-xs text-muted-foreground">
                                  Approved: {new Date(vendor.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveVendor(vendor.id, false)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Pending Tab */}
          {activeTab === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
                <CardDescription>
                  Users and vendors awaiting email verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Pending verifications will be displayed here</p>
              </CardContent>
            </Card>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage all registered users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">User management interface will be displayed here</p>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Configure admin panel settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Settings interface will be displayed here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;