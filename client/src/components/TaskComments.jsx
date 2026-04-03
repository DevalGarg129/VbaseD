import { useState } from "react";
import { Box, Typography, Avatar, TextField, Button, Divider, IconButton, Paper } from "@mui/material";
import { Send, Delete } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function TaskComments({ task, onUpdate }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await API.post(`/tasks/${task._id}/comments`, { text: text.trim() });
      setText(""); onUpdate(res.data);
    } catch {} finally { setSending(false); }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await API.delete(`/tasks/${task._id}/comments/${commentId}`);
      onUpdate(res.data);
    } catch {}
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">
        Comments ({task.comments?.length || 0})
      </Typography>
      <AnimatePresence>
        {(task.comments||[]).map((c,i) => (
          <motion.div key={c._id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:i*0.03}}>
            <Box sx={{ display:"flex",gap:1.2,mb:2 }}>
              <Avatar sx={{ width:30,height:30,fontSize:"0.7rem",flexShrink:0,background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{c.user?.name?.[0]}</Avatar>
              <Box sx={{ flex:1 }}>
                <Box sx={{ display:"flex",alignItems:"center",gap:1,mb:0.4 }}>
                  <Typography variant="caption" fontWeight={700}>{c.user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleDateString()}</Typography>
                  {(c.user?._id===user?.id||c.user?.id===user?.id) && (
                    <IconButton size="small" onClick={()=>handleDelete(c._id)} sx={{ ml:"auto",p:0.2,color:"text.secondary","&:hover":{color:"error.main"} }}>
                      <Delete sx={{ fontSize:"0.8rem" }}/>
                    </IconButton>
                  )}
                </Box>
                <Paper sx={{ px:1.5,py:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(108,99,255,0.1)",borderRadius:"4px 12px 12px 12px" }}>
                  <Typography variant="body2" sx={{ fontSize:"0.85rem",lineHeight:1.5 }}>{c.text}</Typography>
                </Paper>
              </Box>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
      <Box sx={{ display:"flex",gap:1,mt:1 }}>
        <TextField fullWidth size="small" value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}}
          placeholder="Add a comment…" multiline maxRows={3} sx={{ "& .MuiOutlinedInput-root":{borderRadius:"10px"} }}/>
        <Button variant="contained" onClick={handleSend} disabled={!text.trim()||sending} sx={{ minWidth:44,px:0,borderRadius:"10px" }}>
          <Send sx={{ fontSize:"1rem" }}/>
        </Button>
      </Box>
    </Box>
  );
}
