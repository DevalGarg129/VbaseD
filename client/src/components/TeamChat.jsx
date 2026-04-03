import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, TextField, IconButton, Avatar, Paper, CircularProgress, Chip } from "@mui/material";
import { Send, Delete } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import API from "../services/api";

export default function TeamChat({ projectId }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  const fetchMessages = useCallback(async () => {
    try { const res = await API.get(`/messages/${projectId}`); setMessages(res.data); }
    catch {} finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("joinProject", projectId);
    const onMsg = (msg) => setMessages(prev => [...prev, msg]);
    const onTyping = (data) => { if (data.name !== user?.name) setTyping(prev => prev.includes(data.name) ? prev : [...prev, data.name]); };
    const onStop = (data) => setTyping(prev => prev.filter(n => n !== data.name));
    socket.on("newMessage", onMsg);
    socket.on("userTyping", onTyping);
    socket.on("userStopTyping", onStop);
    return () => {
      socket.emit("leaveProject", projectId);
      socket.off("newMessage", onMsg);
      socket.off("userTyping", onTyping);
      socket.off("userStopTyping", onStop);
    };
  }, [socket, projectId, user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleTyping = () => {
    if (!socket) return;
    socket.emit("typing", { projectId, name: user?.name });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket?.emit("stopTyping", { projectId, name: user?.name }), 2000);
  };

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const t = text.trim();
    setText("");
    setSending(true);
    try {
      const res = await API.post(`/messages/${projectId}`, { text: t });
      const newMsg = res.data;
      socket?.emit("sendMessage", { ...newMsg, projectId });
      setMessages(prev => {
        const exists = prev.find(m => m._id === newMsg._id);
        return exists ? prev : [...prev, newMsg];
      });
    } catch { setText(t); }
    finally { setSending(false); socket?.emit("stopTyping", { projectId, name: user?.name }); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(`/messages/${id}`); setMessages(prev => prev.filter(m => m._id !== id)); } catch {}
  };

  const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isOwn = (msg) => msg.sender?._id === user?.id || msg.sender?.id === user?.id;

  const grouped = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "primary.main" }} /></Box>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 320px)", minHeight: 420, background: "#0D0D20", borderRadius: "16px", border: "1px solid rgba(108,99,255,0.1)", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid rgba(108,99,255,0.1)", display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: socket ? "#00D4AA" : "#555", boxShadow: socket ? "0 0 6px #00D4AA" : "none" }} />
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary">Team Chat</Typography>
        {!socket && <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>• Connecting…</Typography>}
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(108,99,255,0.3)", borderRadius: "2px" } }}>
        {Object.entries(grouped).map(([date, msgs]) => (
          <Box key={date}>
            <Box sx={{ textAlign: "center", my: 2 }}>
              <Chip label={date} size="small" sx={{ background: "rgba(108,99,255,0.1)", color: "text.secondary", fontSize: "0.68rem" }} />
            </Box>
            <AnimatePresence>
              {msgs.map((msg, i) => {
                const own = isOwn(msg);
                return (
                  <motion.div key={msg._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: i * 0.015 }}>
                    <Box sx={{ display: "flex", justifyContent: own ? "flex-end" : "flex-start", mb: 1.2, gap: 0.8, alignItems: "flex-end" }}>
                      {!own && <Avatar sx={{ width: 26, height: 26, fontSize: "0.6rem", background: "linear-gradient(135deg,#6C63FF,#8B85FF)", flexShrink: 0 }}>{msg.sender?.name?.[0]}</Avatar>}
                      <Box sx={{ maxWidth: "70%" }}>
                        {!own && <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, mb: 0.2, display: "block", fontWeight: 600, fontSize: "0.7rem" }}>{msg.sender?.name}</Typography>}
                        <Box sx={{ position: "relative", "&:hover .del-btn": { opacity: 1 } }}>
                          <Paper sx={{ px: 1.6, py: 1, borderRadius: own ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: own ? "linear-gradient(135deg,rgba(108,99,255,0.65),rgba(139,133,255,0.55))" : "rgba(255,255,255,0.045)", border: own ? "none" : "1px solid rgba(108,99,255,0.1)" }}>
                            <Typography variant="body2" sx={{ fontSize: "0.85rem", lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.5, fontSize: "0.62rem", display: "block", textAlign: own ? "right" : "left", mt: 0.2 }}>{fmt(msg.createdAt)}</Typography>
                          </Paper>
                          {own && (
                            <IconButton className="del-btn" size="small" onClick={() => handleDelete(msg._id)}
                              sx={{ position: "absolute", top: -8, right: -8, opacity: 0, transition: "opacity 0.2s", p: 0.3, background: "rgba(255,107,107,0.15)", border: "1px solid rgba(255,107,107,0.25)", "&:hover": { background: "rgba(255,107,107,0.3)" } }}>
                              <Delete sx={{ fontSize: "0.65rem", color: "#FF6B6B" }} />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                      {own && <Avatar sx={{ width: 26, height: 26, fontSize: "0.6rem", background: "linear-gradient(135deg,#FF6584,#FF8FA3)", flexShrink: 0 }}>{user?.name?.[0]}</Avatar>}
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Box>
        ))}
        {messages.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6, opacity: 0.4 }}>
            <Typography variant="body2" color="text.secondary">No messages yet. Start the conversation! 👋</Typography>
          </Box>
        )}
        {typing.length > 0 && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{typing.join(", ")} {typing.length === 1 ? "is" : "are"} typing…</Typography>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(108,99,255,0.1)" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField fullWidth multiline maxRows={4} value={text}
            onChange={e => { setText(e.target.value); handleTyping(); }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message… (Enter to send)" size="small"
            sx={{ "& .MuiOutlinedInput-root": { background: "rgba(255,255,255,0.03)", borderRadius: "12px" } }} />
          <IconButton onClick={handleSend} disabled={!text.trim() || sending}
            sx={{ width: 40, height: 40, borderRadius: "12px", background: text.trim() ? "linear-gradient(135deg,#6C63FF,#8B85FF)" : "rgba(108,99,255,0.15)", color: "#fff", flexShrink: 0, "&:disabled": { color: "rgba(255,255,255,0.3)" }, "&:hover": { background: "linear-gradient(135deg,#5A52EE,#7A74EE)" } }}>
            <Send sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
