import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({ socket: null, onlineUsers: [] });

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;
    const s = io("http://localhost:5000", {
      query: { userId: user.id },
      transports: ["websocket"],
      reconnection: true,
    });
    s.on("connect", () => setSocket(s));
    s.on("onlineUsers", setOnlineUsers);
    s.on("disconnect", () => setSocket(null));
    return () => { s.disconnect(); setSocket(null); };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
