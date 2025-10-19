import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Upload, X } from "lucide-react";

const API_URL = "http://localhost:8000";

const VendorSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cnic_number: "",
    password: "",
    confirmPassword: "",
  });
  const [cnicFrontImage, setCnicFrontImage] = useState<File | null>(null);
  const [cnicBackImage, setCnicBackImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format CNIC as user types: XXXXX-XXXXXXX-X
    if (name === "cnic_number") {
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      
      if (cleaned.length > 5 && cleaned.length <= 12) {
        formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
      } else if (cleaned.length > 12) {
        formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
      }
      
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 2MB for better performance)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Image must be less than 2MB. Please compress your image.",
          variant: "destructive",
        });
        return;
      }
      
      if (side === "front") {
        setCnicFrontImage(file);
      } else {
        setCnicBackImage(file);
      }
    }
  };

  const removeFile = (side: "front" | "back") => {
    if (side === "front") {
      setCnicFrontImage(null);
    } else {
      setCnicBackImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate CNIC format
    const cnicDigits = formData.cnic_number.replace(/\D/g, "");
    if (cnicDigits.length !== 13) {
      toast({
        title: "Invalid CNIC",
        description: "CNIC must be 13 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("cnic_number", cnicDigits);
      formDataToSend.append("password", formData.password);
      
      if (cnicFrontImage) {
        formDataToSend.append("cnic_front_image", cnicFrontImage);
      }
      
      if (cnicBackImage) {
        formDataToSend.append("cnic_back_image", cnicBackImage);
      }

      const response = await fetch(`${API_URL}/vendor/signup`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Vendor registration submitted. Please check your email to verify your account.",
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast({
          title: "Registration Failed",
          description: data.detail || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
        <strong>Note:</strong> Vendor accounts require admin approval after email verification.
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-name">Full Name *</Label>
            <Input
              id="vendor-name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-email">Email *</Label>
            <Input
              id="vendor-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-phone">Phone Number *</Label>
            <Input
              id="vendor-phone"
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-cnic">CNIC Number *</Label>
            <Input
              id="vendor-cnic"
              name="cnic_number"
              type="text"
              placeholder="XXXXX-XXXXXXX-X"
              value={formData.cnic_number}
              onChange={handleChange}
              maxLength={15}
              required
            />
            <p className="text-xs text-muted-foreground">13 digit CNIC number</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cnic-front">CNIC Front Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {cnicFrontImage ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{cnicFrontImage.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile("front")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <Label htmlFor="cnic-front-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                    Click to upload
                  </Label>
                  <Input
                    id="cnic-front-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "front")}
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnic-back">CNIC Back Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {cnicBackImage ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{cnicBackImage.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile("back")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <Label htmlFor="cnic-back-upload" className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                    Click to upload
                  </Label>
                  <Input
                    id="cnic-back-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "back")}
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-password">Password *</Label>
            <div className="relative">
              <Input
                id="vendor-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="vendor-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Register as Vendor"}
        </Button>
      </form>
    </div>
  );
};

export default VendorSignupForm;

