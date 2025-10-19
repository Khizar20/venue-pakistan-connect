import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/api";

interface VendorDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  cnic_number: string;
  cnic_front_image: string;
  cnic_back_image: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface VendorDetailsModalProps {
  vendorId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onVendorUpdate: () => void;
}

const VendorDetailsModal = ({ vendorId, isOpen, onClose, onVendorUpdate }: VendorDetailsModalProps) => {
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendorId && isOpen) {
      fetchVendorDetails();
    }
  }, [vendorId, isOpen]);

  const fetchVendorDetails = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/vendors/${vendorId}`);
      
      if (response.ok) {
        const vendorData = await response.json();
        setVendor(vendorData);
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approved: boolean) => {
    if (!vendorId) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/vendors/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          approved: approved,
        }),
      });

      if (response.ok) {
        onVendorUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!vendor && !loading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Vendor Details
            {vendor && (
              <div className="flex gap-2">
                <Badge variant={vendor.is_verified ? "default" : "secondary"}>
                  {vendor.is_verified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant={vendor.is_active ? "default" : "outline"}>
                  {vendor.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige"></div>
          </div>
        ) : vendor ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {vendor.name}</p>
                  <p><strong>Email:</strong> {vendor.email}</p>
                  <p><strong>Phone:</strong> {vendor.phone}</p>
                  <p><strong>CNIC:</strong> {vendor.cnic_number}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Account Status</h3>
                <div className="space-y-2">
                  <p><strong>Registered:</strong> {formatDate(vendor.created_at)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(vendor.updated_at)}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* CNIC Images */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">CNIC Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">CNIC Front</h4>
                  {vendor.cnic_front_image ? (
                    <img
                      src={`data:image/jpeg;base64,${vendor.cnic_front_image}`}
                      alt="CNIC Front"
                      className="w-full h-48 object-cover border rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 border rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">CNIC Back</h4>
                  {vendor.cnic_back_image ? (
                    <img
                      src={`data:image/jpeg;base64,${vendor.cnic_back_image}`}
                      alt="CNIC Back"
                      className="w-full h-48 object-cover border rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 border rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!vendor.is_active && vendor.is_verified && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApproval(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Vendor
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval(false)}
                >
                  Reject Vendor
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailsModal;
