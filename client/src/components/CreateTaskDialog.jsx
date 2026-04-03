import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Autocomplete, Avatar } from "@mui/material";
import { Close, Add, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";

const DEFAULT = { title:"", description:"", priority:"medium", deadline:"", status:"todo", assignedTo:"" };

export default function CreateTaskDialog({ open, onClose, onCreate, loading, editTask, members=[] }) {
  const [form, setForm] = useState(DEFAULT);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(editTask);

  useEffect(() => {
    if (editTask) {
      setForm({ title:editTask.title||"", description:editTask.description||"", priority:editTask.priority||"medium",
        deadline:editTask.deadline?editTask.deadline.split("T")[0]:"", status:editTask.status||"todo", assignedTo:editTask.assignedTo?._id||editTask.assignedTo||"" });
    } else { setForm(DEFAULT); }
    setErrors({});
  }, [editTask, open]);

  const validate = () => { const e={}; if(!form.title.trim()) e.title="Title required"; return e; };

  const handleSubmit = async () => {
    const e=validate(); if(Object.keys(e).length>0){setErrors(e);return;}
    await onCreate(form, editTask?._id); setForm(DEFAULT); setErrors({});
  };

  const handleClose = () => { setForm(DEFAULT); setErrors({}); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ component:motion.div, initial:{scale:0.9,opacity:0}, animate:{scale:1,opacity:1}, transition:{duration:0.22} }}>
      <DialogTitle sx={{ p:"22px 24px 14px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <Box><Typography variant="h6" fontWeight={700}>{isEdit?"Edit Task":"New Task"}</Typography><Typography variant="caption" color="text.secondary">{isEdit?"Update task details":"Add a task to this project"}</Typography></Box>
        <IconButton onClick={handleClose} size="small" sx={{ color:"text.secondary" }}><Close fontSize="small"/></IconButton>
      </DialogTitle>
      <DialogContent sx={{ px:3,pb:2 }}>
        <Box sx={{ display:"flex",flexDirection:"column",gap:2.5,pt:1 }}>
          <TextField label="Task Title *" value={form.title} onChange={e=>{setForm({...form,title:e.target.value});setErrors({...errors,title:""})}} error={!!errors.title} helperText={errors.title} fullWidth autoFocus placeholder="e.g. Design landing hero"/>
          <TextField label="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} fullWidth multiline rows={2} placeholder="Details…"/>
          <Box sx={{ display:"flex",gap:2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={form.priority} label="Priority" onChange={e=>setForm({...form,priority:e.target.value})} sx={{ borderRadius:"10px" }}>
                <MenuItem value="low">🟢 Low</MenuItem>
                <MenuItem value="medium">🟡 Medium</MenuItem>
                <MenuItem value="high">🔴 High</MenuItem>
              </Select>
            </FormControl>
            {isEdit && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={e=>setForm({...form,status:e.target.value})} sx={{ borderRadius:"10px" }}>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="inprogress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
          <TextField label="Deadline" type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} fullWidth InputLabelProps={{ shrink:true }}/>
          {members.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select value={form.assignedTo} label="Assign To" onChange={e=>setForm({...form,assignedTo:e.target.value})} sx={{ borderRadius:"10px" }}>
                <MenuItem value=""><em>Unassigned</em></MenuItem>
                {members.map(m=>(
                  <MenuItem key={m._id} value={m._id}>
                    <Box sx={{ display:"flex",alignItems:"center",gap:1 }}>
                      <Avatar sx={{ width:22,height:22,fontSize:"0.6rem",background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{m.name?.[0]}</Avatar>
                      {m.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px:3,pb:3,gap:1.5 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderColor:"rgba(108,99,255,0.3)",color:"text.secondary" }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} startIcon={isEdit?<Edit/>:<Add/>} sx={{ minWidth:130 }}>{loading?(isEdit?"Saving…":"Adding…"):(isEdit?"Save Changes":"Add Task")}</Button>
      </DialogActions>
    </Dialog>
  );
}
