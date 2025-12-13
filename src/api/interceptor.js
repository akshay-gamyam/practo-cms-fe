import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://practo-cms-backend-8.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== REQUEST INTERCEPTOR ==========
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach Bearer token if available
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== RESPONSE INTERCEPTOR ==========
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "Error:",
      error.response?.status,
      error.response?.config?.url
    );

    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthRequest =
        requestUrl.includes("/api/auth/login") ||
        requestUrl.includes("/api/auth/oauth/google") ||
        requestUrl.includes("/api/auth/refresh");

      if (!isAuthRequest) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),

  post: (url, data, config = {}) => axiosInstance.post(url, data, config),

  put: (url, data, config = {}) => axiosInstance.put(url, data, config),

  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),

  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

export default api;
