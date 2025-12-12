import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "api-base-url",
});

// ========== REQUEST INTERCEPTOR ==========
axiosInstance.interceptors.request.use(
  (config) => {
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
    console.log("Error:", error.response?.status, error.response?.config?.url);
    return Promise.reject(error);
  }
);


const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),

  post: (url, data, config = {}) =>
    axiosInstance.post(url, data, config),

  put: (url, data, config = {}) =>
    axiosInstance.put(url, data, config),

  patch: (url, data, config = {}) =>
    axiosInstance.patch(url, data, config),

  delete: (url, config = {}) =>
    axiosInstance.delete(url, config),
};

export default api;