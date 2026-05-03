import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
console.log("API base URL:", baseURL);

const API = axios.create({ 
  baseURL,
  withCredentials: true
});
console.log("API:", API.defaults.baseURL);

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;