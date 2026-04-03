import { useState } from "react";
import { Box, Typography, Avatar, AvatarGroup, Paper, TextField, Button, Chip, IconButton, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress } from "@mui/material";
import { PersonAdd, RemoveCircleOutline, Search, FiberManualRecord } from "@mui/icons-material";
import { motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export default function TeamPanel({ project, onRefresh }) {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(null);

  const isOwner = project?.createdBy?._id === user?.id || project?.createdBy?.id === user?.id || project?.createdBy === user?.id;

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await API.get(`/auth/search?q=${q}`);
      const memberIds = project.members.map(m => m._id);
      setResults(res.data.filter(u => !memberIds.includes(u._id)));
    } catch {} finally { setSearching(false); }
  };

  const handleAdd = async (userId) => {
    setAdding(userId);
    try { await API.post(`/projects/${project._id}/members`, { userId }); onRefresh(); setSearch(""); setResults([]); }
    catch {} finally { setAdding(null); }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try { await API.delete(`/projects/${project._id}/members/${userId}`); onRefresh(); }
    catch {}
  };

  const isOnline = (memberId) => onlineUsers.includes(memberId);

  return (
    <Box>
      <Paper sx={{ p:3,borderRadius:"16px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)",mb:2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>Team Members ({project?.members?.length || 0})</Typography>
        <List disablePadding>
          {project?.members?.map((m, i) => (
            <motion.div key={m._id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.05 }}>
              <ListItem sx={{ px:0,py:1,gap:1 }}
                secondaryAction={isOwner && m._id !== user?.id && (
                  <Tooltip title="Remove member">
                    <IconButton size="small" onClick={() => handleRemove(m._id)} sx={{ color:"error.main","&:hover":{background:"rgba(255,107,107,0.1)"} }}>
                      <RemoveCircleOutline fontSize="small"/>
                    </IconButton>
                  </Tooltip>
                )}>
                <ListItemAvatar sx={{ minWidth:46 }}>
                  <Box sx={{ position:"relative",display:"inline-block" }}>
                    <Avatar sx={{ width:36,height:36,fontSize:"0.8rem",fontWeight:700,background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{m.name?.[0]}</Avatar>
                    <Box sx={{ position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:isOnline(m._id)?"#00D4AA":"#555",border:"2px solid #0D0D20" }}/>
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={<Box sx={{ display:"flex",alignItems:"center",gap:1 }}>
                    <Typography variant="body2" fontWeight={600}>{m.name}</Typography>
                    {m._id===project?.createdBy?._id && <Chip label="Owner" size="small" sx={{ height:16,fontSize:"0.6rem",background:"rgba(108,99,255,0.15)",color:"primary.light" }}/>}
                  </Box>}
                  secondary={<Typography variant="caption" color="text.secondary">{m.email} · {isOnline(m._id)?"Online":"Offline"}</Typography>}
                />
              </ListItem>
              {i < project.members.length-1 && <Divider sx={{ borderColor:"rgba(108,99,255,0.08)" }}/>}
            </motion.div>
          ))}
        </List>
      </Paper>

      {isOwner && (
        <Paper sx={{ p:3,borderRadius:"16px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)" }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Add Member</Typography>
          <TextField fullWidth placeholder="Search by name or email…" value={search} onChange={e=>handleSearch(e.target.value)} size="small"
            InputProps={{ startAdornment:<Search sx={{ color:"text.secondary",mr:0.5,fontSize:"1rem" }}/>,
              endAdornment:searching?<CircularProgress size={14} sx={{ color:"primary.main" }}/>:null }} />
          {results.length > 0 && (
            <List dense sx={{ mt:1 }}>
              {results.map(u => (
                <ListItem key={u._id} sx={{ px:0,py:0.8,gap:1 }}
                  secondaryAction={<Button size="small" variant="outlined" onClick={()=>handleAdd(u._id)} disabled={adding===u._id} startIcon={<PersonAdd sx={{ fontSize:"0.85rem" }}/>}
                    sx={{ borderColor:"rgba(108,99,255,0.3)",color:"primary.light",fontSize:"0.75rem",py:0.4 }}>{adding===u._id?"Adding…":"Add"}</Button>}>
                  <ListItemAvatar sx={{ minWidth:40 }}>
                    <Avatar sx={{ width:30,height:30,fontSize:"0.7rem",background:"linear-gradient(135deg,#FF6584,#FF8FA3)" }}>{u.name?.[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="body2" fontWeight={600}>{u.name}</Typography>} secondary={<Typography variant="caption" color="text.secondary">{u.email}</Typography>}/>
                </ListItem>
              ))}
            </List>
          )}
          {search.length >= 2 && results.length === 0 && !searching && (
            <Typography variant="caption" color="text.secondary" sx={{ mt:1,display:"block" }}>No users found.</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}
