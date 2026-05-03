import axios from "axios";

// 🔥 Strict env check (no silent failure)
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("❌ VITE_API_URL is not defined. Check Vercel environment variables.");
}

// Debug (can remove later)
console.log("🌐 API BASE URL:", baseURL);

// Create axios instance
const API = axios.create({
  baseURL,
  withCredentials: true, // required for cookies/auth
});

// Debug instance
console.log("🚀 Axios instance using:", API.defaults.baseURL);

// Attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Handle responses
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Auto logout if unauthorized
    if (err.response?.status === 401) {
      console.warn("⚠️ Unauthorized - clearing session");
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(err);
  }
);

export default API;