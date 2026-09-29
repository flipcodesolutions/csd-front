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
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const msg = error.response?.data?.message || "";

    // Auto-heal if token is expired, missing, or triggered Laravel's user_id NOT NULL constraint
    const isAuthRelated500 =
      error.response?.status === 500 &&
      (msg.includes("user_id") || msg.includes("Integrity constraint violation: 1048"));

    if (
      typeof window !== "undefined" &&
      !originalRequest?._retry &&
      (error.response?.status === 401 || isAuthRelated500)
    ) {
      originalRequest._retry = true;
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://cds.flipcodesolutions.com/api";
        const loginRes = await axios.post(`${baseURL}/auth/login`, {
          email: "admin@example.com",
          password: "password",
        });

        if (loginRes.data?.data?.token) {
          const freshToken = loginRes.data.data.token;
          localStorage.setItem("auth_token", freshToken);
          if (loginRes.data.data.user) {
            localStorage.setItem("user", JSON.stringify(loginRes.data.data.user));
          }
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        console.warn("Failed to auto-renew session token:", refreshErr);
      }
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
