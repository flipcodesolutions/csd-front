import axios from "axios";

// Create Axios Instance with default settings
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://cds.flipcodesolutions.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Bearer Token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error & Unauthenticated Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear expired session and redirect if needed
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
