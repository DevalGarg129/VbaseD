import { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, IconButton, Badge, Divider, List, ListItem, ListItemText, Tooltip, Button } from "@mui/material";
import { Dashboard, Notifications, Logout, Person, CalendarMonth, KeyboardArrowDown, FiberManualRecord, DoneAll } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, notifications, unreadCount, markNotificationsRead } = useAuth();
  const [userAnchor, setUserAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const initials = user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  const handleNotifOpen = (e) => { setNotifAnchor(e.currentTarget); markNotificationsRead(); };

  const navLinks = [
    { label:"Dashboard", path:"/dashboard", icon:<Dashboard sx={{fontSize:"1rem"}} /> },
    { label:"Calendar", path:"/calendar", icon:<CalendarMonth sx={{fontSize:"1rem"}} /> },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ background:"rgba(13,13,26,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(108,99,255,0.13)", zIndex:1200 }}>
      <Toolbar sx={{ px:{xs:2,md:4}, minHeight:"60px !important", gap:1 }}>
        {/* Logo */}
        <motion.div whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
          <Box onClick={()=>navigate("/dashboard")} sx={{ display:"flex",alignItems:"center",gap:1.2,cursor:"pointer",mr:3 }}>
            <Box sx={{ width:34,height:34,borderRadius:"10px",background:"linear-gradient(135deg,#6C63FF,#FF6584)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 12px rgba(108,99,255,0.4)" }}>
              <Typography sx={{ color:"#fff",fontWeight:900,fontSize:"1.1rem",lineHeight:1 }}>V</Typography>
            </Box>
            <Typography sx={{ fontWeight:800,fontSize:"1.15rem",background:"linear-gradient(135deg,#6C63FF,#FF6584)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>VbaseD</Typography>
          </Box>
        </motion.div>

        {/* Nav Links */}
        <Box sx={{ display:{xs:"none",md:"flex"}, gap:0.5 }}>
          {navLinks.map(l => (
            <Button key={l.path} startIcon={l.icon} onClick={()=>navigate(l.path)}
              sx={{ color: location.pathname===l.path ? "primary.light":"text.secondary", background: location.pathname===l.path ? "rgba(108,99,255,0.12)":"transparent", "&:hover":{background:"rgba(108,99,255,0.08)",color:"primary.light"}, borderRadius:"8px", px:1.5, py:0.7, fontSize:"0.82rem" }}>
              {l.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow:1 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton onClick={handleNotifOpen} sx={{ color:"text.secondary","&:hover":{color:"primary.light"} }}>
            <Badge badgeContent={unreadCount} color="error" max={9}>
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box onClick={e=>setUserAnchor(e.currentTarget)} sx={{ display:"flex",alignItems:"center",gap:1,cursor:"pointer",px:1.2,py:0.5,borderRadius:"10px","&:hover":{background:"rgba(108,99,255,0.1)"},transition:"background 0.2s",ml:0.5 }}>
          <Avatar sx={{ width:32,height:32,fontSize:"0.8rem",fontWeight:700,background:"linear-gradient(135deg,#6C63FF,#8B85FF)",boxShadow:"0 2px 8px rgba(108,99,255,0.35)" }}>{initials}</Avatar>
          <Box sx={{ display:{xs:"none",sm:"block"} }}>
            <Typography variant="body2" sx={{ fontWeight:600,lineHeight:1.2,fontSize:"0.82rem" }}>{user?.name}</Typography>
          </Box>
          <KeyboardArrowDown sx={{ color:"text.secondary",fontSize:"1rem" }} />
        </Box>

        {/* Notification Menu */}
        <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={()=>setNotifAnchor(null)}
          PaperProps={{ sx:{ background:"#13132A",border:"1px solid rgba(108,99,255,0.2)",minWidth:320,maxHeight:420,boxShadow:"0 10px 40px rgba(0,0,0,0.5)" } }}>
          <Box sx={{ px:2,py:1.5,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
            {unreadCount > 0 && <DoneAll sx={{ fontSize:"1rem",color:"primary.main",cursor:"pointer" }} onClick={markNotificationsRead} />}
          </Box>
          <Divider sx={{ borderColor:"rgba(108,99,255,0.15)" }} />
          {notifications.length === 0 ? (
            <Box sx={{ p:3,textAlign:"center" }}>
              <Typography variant="body2" color="text.secondary">No notifications</Typography>
            </Box>
          ) : notifications.slice(0,8).map((n,i) => (
            <MenuItem key={i} onClick={()=>{ setNotifAnchor(null); n.link && navigate(n.link); }}
              sx={{ py:1.2,px:2,gap:1.2,alignItems:"flex-start","&:hover":{background:"rgba(108,99,255,0.08)"} }}>
              {!n.read && <FiberManualRecord sx={{ fontSize:"0.5rem",color:"primary.main",mt:0.8,flexShrink:0 }} />}
              <Box sx={{ ml: n.read ? 1.3 : 0 }}>
                <Typography variant="body2" sx={{ fontSize:"0.82rem",lineHeight:1.4 }}>{n.message}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(n.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* User Dropdown */}
        <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={()=>setUserAnchor(null)}
          PaperProps={{ sx:{ background:"#13132A",border:"1px solid rgba(108,99,255,0.2)",minWidth:190,boxShadow:"0 10px 40px rgba(0,0,0,0.5)" } }}>
          <Box sx={{ px:2,py:1.5 }}>
            <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider sx={{ borderColor:"rgba(108,99,255,0.15)" }} />
          <MenuItem onClick={()=>{setUserAnchor(null);navigate("/dashboard")}} sx={{ gap:1.5,py:1.1,fontSize:"0.85rem" }}>
            <Person fontSize="small" sx={{ color:"text.secondary" }} /> Profile
          </MenuItem>
          <MenuItem onClick={()=>{setUserAnchor(null);logout();navigate("/")}} sx={{ gap:1.5,py:1.1,fontSize:"0.85rem",color:"error.main" }}>
            <Logout fontSize="small" /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
