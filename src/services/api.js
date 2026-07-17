import axios from "axios";

// The server runs on PORT 3000 by default (as per .env)
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
});

// Interceptor to attach JWT token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle specific global error codes
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If unauthorized, clear auth and notify the app
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Dispatch custom event so AuthContext can react
        window.dispatchEvent(new Event("auth-logout"));
        // Redirect to login only if not already on login/register/home pages
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
