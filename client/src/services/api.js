import axios from "axios";

const DEFAULT_BASE = "http://localhost:5000/api";
const baseURL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : DEFAULT_BASE;

const API = axios.create({ baseURL });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) { localStorage.clear(); window.location.href = "/"; }
    return Promise.reject(err);
  }
);
export default API;
