import { useState } from "react";
import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { Delete, Edit, MoreVert, Schedule, Flag, ChatBubbleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";

const PRI={high:{color:"#FF6B6B",bg:"rgba(255,107,107,0.1)",label:"High"},medium:{color:"#FFB347",bg:"rgba(255,179,71,0.1)",label:"Med"},low:{color:"#00D4AA",bg:"rgba(0,212,170,0.1)",label:"Low"}};
const STA={todo:{color:"#9B9BB4",label:"To Do"},inprogress:{color:"#6C63FF",label:"In Progress"},done:{color:"#00D4AA",label:"Done"}};

export default function TaskCard({task,onStatusChange,onDelete,onEdit,index=0}){
  const [anchor,setAnchor]=useState(null);
  const p=PRI[task.priority]||PRI.medium;
  const s=STA[task.status]||STA.todo;
  const overdue=task.deadline&&new Date(task.deadline)<new Date()&&task.status!=="done";
  const dl=task.deadline?new Date(task.deadline).toLocaleDateString("en-US",{month:"short",day:"numeric"}):null;

  return(
    <motion.div initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:8}} transition={{duration:0.22,delay:index*0.03}} whileHover={{scale:1.01}} layout>
      <Card sx={{ background:"#0D0D20",border:"1px solid rgba(108,99,255,0.09)",borderRadius:"12px",mb:1.5,cursor:"pointer","&:hover":{borderColor:"rgba(108,99,255,0.28)",boxShadow:"0 4px 16px rgba(0,0,0,0.35)"},transition:"all 0.2s" }}>
        <CardContent sx={{ p:"12px 14px !important" }}>
          <Box sx={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",mb:0.8 }}>
            <Typography variant="body2" sx={{ fontWeight:600,fontSize:"0.87rem",lineHeight:1.4,flex:1,pr:0.5,textDecoration:task.status==="done"?"line-through":"none",color:task.status==="done"?"text.secondary":"text.primary" }}>{task.title}</Typography>
            <IconButton size="small" onClick={e=>{e.stopPropagation();setAnchor(e.currentTarget)}} sx={{ color:"text.secondary",p:0.3,"&:hover":{color:"text.primary"} }}>
              <MoreVert sx={{ fontSize:"0.95rem" }}/>
            </IconButton>
          </Box>
          {task.description&&<Typography variant="caption" color="text.secondary" sx={{ display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",mb:1,lineHeight:1.5 }}>{task.description}</Typography>}
          <Box sx={{ display:"flex",flexWrap:"wrap",gap:0.6,mb:0.8 }}>
            <Chip icon={<Flag sx={{ fontSize:"0.65rem !important",color:`${p.color} !important` }}/>} label={p.label} size="small" sx={{ background:p.bg,color:p.color,height:20,fontSize:"0.67rem",fontWeight:700 }}/>
            <Chip label={s.label} size="small" sx={{ background:`${s.color}15`,color:s.color,height:20,fontSize:"0.67rem",fontWeight:700 }}/>
            {task.comments?.length>0&&<Chip icon={<ChatBubbleOutline sx={{ fontSize:"0.65rem !important" }}/>} label={task.comments.length} size="small" sx={{ height:20,fontSize:"0.67rem",background:"rgba(108,99,255,0.1)",color:"primary.light" }}/>}
          </Box>
          <Box sx={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:0.5 }}>
            {dl&&<Box sx={{ display:"flex",alignItems:"center",gap:0.4 }}>
              <Schedule sx={{ fontSize:"0.7rem",color:overdue?"error.main":"text.secondary" }}/>
              <Typography variant="caption" sx={{ color:overdue?"error.main":"text.secondary",fontWeight:overdue?700:400,fontSize:"0.7rem" }}>{overdue?"Overdue · ":""}{dl}</Typography>
            </Box>}
            {task.assignedTo&&<Box sx={{ display:"flex",alignItems:"center",gap:0.5 }}>
              <Avatar sx={{ width:18,height:18,fontSize:"0.55rem",background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{task.assignedTo?.name?.[0]||"?"}</Avatar>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize:"0.68rem" }}>{task.assignedTo?.name}</Typography>
            </Box>}
          </Box>
        </CardContent>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)} PaperProps={{ sx:{background:"#13132A",border:"1px solid rgba(108,99,255,0.18)",minWidth:160} }}>
          {["todo","inprogress","done"].map(st=><MenuItem key={st} onClick={()=>{setAnchor(null);onStatusChange&&onStatusChange(task._id,st)}} sx={{ fontSize:"0.82rem",fontWeight:task.status===st?700:400,color:task.status===st?"primary.main":"text.primary" }}>{STA[st].label}</MenuItem>)}
          <Box sx={{ borderTop:"1px solid rgba(108,99,255,0.12)",mt:0.5,pt:0.5 }}>
            <MenuItem onClick={()=>{setAnchor(null);onEdit&&onEdit(task)}} sx={{ fontSize:"0.82rem",gap:1.2 }}><Edit fontSize="small" sx={{ color:"primary.main" }}/>Edit</MenuItem>
            <MenuItem onClick={()=>{setAnchor(null);onDelete&&onDelete(task._id)}} sx={{ fontSize:"0.82rem",gap:1.2,color:"error.main" }}><Delete fontSize="small"/>Delete</MenuItem>
          </Box>
        </Menu>
      </Card>
    </motion.div>
  );
}
