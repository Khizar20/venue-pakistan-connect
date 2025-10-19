// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// API Helper Functions
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("access_token");
  
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };
  
  // Add Authorization header if token exists and Content-Type is not FormData
  if (token && !(options.body instanceof FormData)) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Add Content-Type for JSON if body is present and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  return response;
};

// Specific API methods
export const api = {
  // User Authentication
  login: async (email: string, password: string) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  
  signup: async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: string;
  }) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ ...data, role: data.role || "user" }),
    });
  },
  
  getCurrentUser: async () => {
    return apiRequest("/auth/me", {
      method: "GET",
    });
  },
  
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
  
  // Vendor Authentication
  vendorSignup: async (formData: FormData) => {
    return apiRequest("/vendor/signup", {
      method: "POST",
      body: formData,
    });
  },
  
  vendorLogin: async (email: string, password: string) => {
    return apiRequest("/vendor/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  
  // OAuth
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/oauth/google`;
  },
};

