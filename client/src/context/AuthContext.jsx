import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get("/auth/notifications");
      setNotifications(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) { fetchNotifications(); const i = setInterval(fetchNotifications, 30000); return () => clearInterval(i); }
  }, [user, fetchNotifications]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setNotifications([]);
  };

  const markNotificationsRead = async () => {
    try {
      await API.put("/auth/notifications/read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, notifications, unreadCount, markNotificationsRead, fetchNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
