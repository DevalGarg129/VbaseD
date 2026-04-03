import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton } from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import { motion } from "framer-motion";

const COLORS=["#6C63FF","#FF6584","#00D4AA","#FFB347","#4FC3F7","#CE93D8","#FF7043","#66BB6A"];

export default function CreateProjectDialog({ open, onClose, onCreate, loading }) {
  const [form, setForm] = useState({ title:"", description:"", color:"#6C63FF", dueDate:"" });
  const [errors, setErrors] = useState({});

  const validate = () => { const e={}; if(!form.title.trim()) e.title="Title required"; return e; };

  const handleSubmit = async () => {
    const e=validate(); if(Object.keys(e).length>0){setErrors(e);return;}
    await onCreate(form); setForm({title:"",description:"",color:"#6C63FF",dueDate:""}); setErrors({});
  };

  const handleClose = () => { setForm({title:"",description:"",color:"#6C63FF",dueDate:""}); setErrors({}); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ component:motion.div, initial:{scale:0.9,opacity:0}, animate:{scale:1,opacity:1}, transition:{duration:0.22} }}>
      <DialogTitle sx={{ p:"22px 24px 14px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <Box><Typography variant="h6" fontWeight={700}>New Project</Typography><Typography variant="caption" color="text.secondary">Set up your project workspace</Typography></Box>
        <IconButton onClick={handleClose} size="small" sx={{ color:"text.secondary" }}><Close fontSize="small"/></IconButton>
      </DialogTitle>
      <DialogContent sx={{ px:3,pb:2 }}>
        <Box sx={{ display:"flex",flexDirection:"column",gap:2.5,pt:1 }}>
          <TextField label="Project Title *" value={form.title} onChange={e=>{setForm({...form,title:e.target.value});setErrors({...errors,title:""})}} error={!!errors.title} helperText={errors.title} fullWidth autoFocus placeholder="e.g. Website Redesign"/>
          <TextField label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} fullWidth multiline rows={2} placeholder="Brief description…"/>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb:1,display:"block",fontWeight:600 }}>Project Color</Typography>
            <Box sx={{ display:"flex",gap:1,flexWrap:"wrap" }}>
              {COLORS.map(c=>(
                <Box key={c} onClick={()=>setForm({...form,color:c})} sx={{ width:28,height:28,borderRadius:"8px",background:c,cursor:"pointer",border:form.color===c?"3px solid #fff":"3px solid transparent",transform:form.color===c?"scale(1.1)":"scale(1)",transition:"all 0.15s",boxShadow:form.color===c?`0 0 12px ${c}88`:"none" }}/>
              ))}
            </Box>
          </Box>
          <TextField label="Due Date (optional)" type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} fullWidth InputLabelProps={{ shrink:true }}/>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px:3,pb:3,gap:1.5 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderColor:"rgba(108,99,255,0.3)",color:"text.secondary" }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} startIcon={<Add/>} sx={{ minWidth:140 }}>{loading?"Creating…":"Create Project"}</Button>
      </DialogActions>
    </Dialog>
  );
}
