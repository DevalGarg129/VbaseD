import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Add, RadioButtonUnchecked, Autorenew, CheckCircle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import CreateTaskDialog from "./CreateTaskDialog";
import API from "../services/api";

const COLS=[
  {status:"todo",label:"To Do",color:"#9B9BB4",bg:"rgba(155,155,180,0.06)",border:"rgba(155,155,180,0.18)",icon:RadioButtonUnchecked},
  {status:"inprogress",label:"In Progress",color:"#6C63FF",bg:"rgba(108,99,255,0.06)",border:"rgba(108,99,255,0.22)",icon:Autorenew},
  {status:"done",label:"Done",color:"#00D4AA",bg:"rgba(0,212,170,0.06)",border:"rgba(0,212,170,0.18)",icon:CheckCircle},
];

export default function KanbanBoard({tasks,projectId,onRefresh,members}){
  const [dialog,setDialog]=useState(false);
  const [editTask,setEditTask]=useState(null);
  const [saving,setSaving]=useState(false);

  const byStatus=s=>tasks.filter(t=>t.status===s);

  const handleSave=async(form,taskId)=>{
    try{
      setSaving(true);
      if(taskId) await API.put(`/tasks/${taskId}`,form);
      else await API.post("/tasks",{...form,project:projectId});
      setDialog(false);setEditTask(null);onRefresh();
    }catch{}finally{setSaving(false);}
  };

  const handleStatus=async(taskId,status)=>{
    try{await API.put(`/tasks/${taskId}`,{status});onRefresh();}catch{}
  };

  const handleDelete=async(taskId)=>{
    if(!window.confirm("Delete task?"))return;
    try{await API.delete(`/tasks/${taskId}`);onRefresh();}catch{}
  };

  const handleEdit=task=>{setEditTask(task);setDialog(true);};

  return(
    <Box>
      <Box sx={{ display:"flex",justifyContent:"flex-end",mb:2 }}>
        <Button variant="contained" startIcon={<Add/>} size="small" onClick={()=>{setEditTask(null);setDialog(true);}}>Add Task</Button>
      </Box>
      <Box sx={{ display:"flex",gap:2,overflowX:"auto",pb:2,alignItems:"flex-start" }}>
        {COLS.map((col,ci)=>(
          <Paper key={col.status} sx={{ flex:1,minWidth:{xs:"82vw",sm:270,md:0},background:col.bg,border:`1px solid ${col.border}`,borderRadius:"16px",p:2,display:"flex",flexDirection:"column",maxHeight:"calc(100vh-280px)",overflow:"hidden" }}>
            <Box sx={{ display:"flex",alignItems:"center",gap:1,mb:2,pb:1.5,borderBottom:`1px solid ${col.border}` }}>
              <col.icon sx={{ fontSize:"0.9rem",color:col.color }}/>
              <Typography sx={{ fontWeight:700,color:col.color,flex:1,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.08em" }}>{col.label}</Typography>
              <Box sx={{ background:`${col.color}22`,px:1,py:0.2,borderRadius:"20px" }}>
                <Typography variant="caption" sx={{ color:col.color,fontWeight:700 }}>{byStatus(col.status).length}</Typography>
              </Box>
            </Box>
            <Box sx={{ overflowY:"auto",flex:1,"&::-webkit-scrollbar":{width:"3px"},"&::-webkit-scrollbar-thumb":{background:col.border,borderRadius:"2px"} }}>
              <AnimatePresence>
                {byStatus(col.status).length===0?(
                  <Box sx={{ textAlign:"center",py:5,opacity:0.35 }}><Typography variant="caption" color="text.secondary">No tasks</Typography></Box>
                ):byStatus(col.status).map((task,i)=>(
                  <TaskCard key={task._id} task={task} index={i} onStatusChange={handleStatus} onDelete={handleDelete} onEdit={handleEdit}/>
                ))}
              </AnimatePresence>
            </Box>
          </Paper>
        ))}
      </Box>
      <CreateTaskDialog open={dialog} onClose={()=>{setDialog(false);setEditTask(null);}} onCreate={handleSave} loading={saving} editTask={editTask} members={members}/>
    </Box>
  );
}
