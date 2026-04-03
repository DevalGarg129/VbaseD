import { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, Skeleton, Alert, Paper, InputBase, Chip, Avatar, AvatarGroup, LinearProgress } from "@mui/material";
import { Add, Search, FolderOpen, CheckCircle, Inbox, TrendingUp, Assignment } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import CreateProjectDialog from "../components/CreateProjectDialog";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const COLORS=["linear-gradient(135deg,#6C63FF,#8B85FF)","linear-gradient(135deg,#FF6584,#FF8FA3)","linear-gradient(135deg,#00D4AA,#00F5C8)","linear-gradient(135deg,#FFB347,#FFD700)","linear-gradient(135deg,#4FC3F7,#81D4FA)","linear-gradient(135deg,#CE93D8,#F48FB1)"];
function hashColor(s){let h=0;for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h);return COLORS[Math.abs(h)%COLORS.length];}

function StatCard({label,value,icon:Icon,color,delay}){
  return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay,duration:0.4}}>
      <Paper sx={{ p:2.5,borderRadius:"16px",background:"#13132A",border:"1px solid rgba(108,99,255,0.1)",display:"flex",alignItems:"center",gap:2,"&:hover":{borderColor:color+"55",boxShadow:`0 4px 20px ${color}22`},transition:"all 0.3s" }}>
        <Box sx={{ p:1.2,borderRadius:"12px",background:`${color}18`,flexShrink:0 }}>
          <Icon sx={{ color,fontSize:"1.5rem" }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color,lineHeight:1 }}>{value}</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}

function ProjectCard({project,onDelete,index}){
  const navigate=useNavigate();
  const grad=hashColor(project._id||project.title);
  const progress=project.taskCount>0?Math.round((project.doneCount/project.taskCount)*100):0;
  return(
    <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:index*0.06}} whileHover={{y:-4,transition:{duration:0.2}}}>
      <Paper onClick={()=>navigate(`/project/${project._id}`)} sx={{ cursor:"pointer",borderRadius:"16px",background:"#13132A",border:"1px solid rgba(108,99,255,0.1)",overflow:"hidden",transition:"box-shadow 0.3s,border-color 0.3s","&:hover":{boxShadow:"0 12px 40px rgba(108,99,255,0.18)",borderColor:"rgba(108,99,255,0.3)"} }}>
        <Box sx={{ height:4,background:grad }} />
        <Box sx={{ p:2.5 }}>
          <Box sx={{ display:"flex",alignItems:"flex-start",gap:1.5,mb:1.5 }}>
            <Box sx={{ width:40,height:40,borderRadius:"11px",background:grad,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <FolderOpen sx={{ color:"#fff",fontSize:"1.2rem" }} />
            </Box>
            <Box sx={{ flex:1,minWidth:0 }}>
              <Typography fontWeight={700} sx={{ fontSize:"0.95rem",lineHeight:1.3,mb:0.3 }} noWrap>{project.title}</Typography>
              <Chip label={project.status} size="small" sx={{ height:18,fontSize:"0.65rem",fontWeight:700,background:project.status==="active"?"rgba(0,212,170,0.12)":project.status==="completed"?"rgba(108,99,255,0.12)":"rgba(255,255,255,0.06)",color:project.status==="active"?"#00D4AA":project.status==="completed"?"#8B85FF":"#9B9BB4" }} />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb:2,minHeight:32,fontSize:"0.8rem",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{project.description||"No description."}</Typography>
          <Box sx={{ mb:1.5 }}>
            <Box sx={{ display:"flex",justifyContent:"space-between",mb:0.5 }}>
              <Typography variant="caption" color="text.secondary">{project.taskCount} tasks</Typography>
              <Typography variant="caption" sx={{ color:"#00D4AA",fontWeight:700 }}>{progress}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ borderRadius:3,height:5,background:"rgba(255,255,255,0.06)","& .MuiLinearProgress-bar":{background:"linear-gradient(90deg,#6C63FF,#00D4AA)",borderRadius:3} }} />
          </Box>
          {project.members?.length>0 && (
            <AvatarGroup max={4} sx={{ justifyContent:"flex-end","& .MuiAvatar-root":{width:24,height:24,fontSize:"0.6rem",border:"1px solid #13132A"} }}>
              {project.members.map(m=><Avatar key={m._id} sx={{ background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{m.name?.[0]}</Avatar>)}
            </AvatarGroup>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function Dashboard(){
  const {user}=useAuth();
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [creating,setCreating]=useState(false);
  const [dialogOpen,setDialogOpen]=useState(false);
  const [search,setSearch]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{fetchProjects();},[]);

  const fetchProjects=async()=>{
    try{setLoading(true);const res=await API.get("/projects");setProjects(res.data);}
    catch{setError("Failed to load projects");}finally{setLoading(false);}
  };

  const handleCreate=async(form)=>{
    try{setCreating(true);await API.post("/projects",form);setDialogOpen(false);await fetchProjects();}
    catch(err){setError(err.response?.data?.msg||"Failed to create project");}finally{setCreating(false);}
  };

  const handleDelete=async(id)=>{
    if(!window.confirm("Delete this project?"))return;
    try{await API.delete(`/projects/${id}`);setProjects(p=>p.filter(x=>x._id!==id));}
    catch{setError("Failed to delete");}
  };

  const filtered=projects.filter(p=>p.title.toLowerCase().includes(search.toLowerCase())||p.description?.toLowerCase().includes(search.toLowerCase()));
  const total=projects.length;
  const allTasks=projects.reduce((s,p)=>s+p.taskCount,0);
  const allDone=projects.reduce((s,p)=>s+p.doneCount,0);
  const active=projects.filter(p=>p.status==="active").length;
  const hour=new Date().getHours();
  const greeting=hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";

  return(
    <Box sx={{ minHeight:"100vh",background:"#0A0A14" }}>
      <Navbar/>
      <Box sx={{ maxWidth:1300,mx:"auto",px:{xs:2,md:4},py:4 }}>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
          <Box sx={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:2,mb:4 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} mb={0.5}>{greeting}, {user?.name?.split(" ")[0]} 👋</Typography>
              <Typography variant="body1" color="text.secondary">{total===0?"Start by creating your first project.":`You have ${total} project${total!==1?"s":""}.`}</Typography>
            </Box>
            <Button variant="contained" startIcon={<Add/>} onClick={()=>setDialogOpen(true)}>New Project</Button>
          </Box>
        </motion.div>

        <Grid container spacing={2} mb={4}>
          {[{label:"Projects",value:total,color:"#6C63FF",icon:FolderOpen,delay:0.05},{label:"Active",value:active,color:"#00D4AA",icon:TrendingUp,delay:0.1},{label:"Total Tasks",value:allTasks,color:"#FFB347",icon:Assignment,delay:0.15},{label:"Completed",value:allDone,color:"#FF6584",icon:CheckCircle,delay:0.2}].map(s=>(
            <Grid item xs={6} sm={3} key={s.label}><StatCard {...s}/></Grid>
          ))}
        </Grid>

        {error&&<Alert severity="error" sx={{ mb:3,borderRadius:"10px" }} onClose={()=>setError("")}>{error}</Alert>}

        {projects.length>0&&(
          <Paper sx={{ display:"flex",alignItems:"center",gap:1.5,px:2,py:1,mb:3,borderRadius:"12px",background:"#13132A",border:"1px solid rgba(108,99,255,0.15)",maxWidth:400 }}>
            <Search sx={{ color:"text.secondary",fontSize:"1.1rem" }}/>
            <InputBase placeholder="Search projects..." value={search} onChange={e=>setSearch(e.target.value)} sx={{ flex:1,fontSize:"0.88rem",color:"text.primary" }}/>
          </Paper>
        )}

        {loading?(
          <Grid container spacing={2.5}>
            {[...Array(6)].map((_,i)=><Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rounded" height={200} sx={{ bgcolor:"rgba(108,99,255,0.06)",borderRadius:"16px" }}/></Grid>)}
          </Grid>
        ):filtered.length===0?(
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <Box sx={{ textAlign:"center",py:10,opacity:0.7 }}>
              <Inbox sx={{ fontSize:"4rem",color:"text.secondary",mb:2 }}/>
              <Typography variant="h6" color="text.secondary" fontWeight={600}>{search?"No results":"No projects yet"}</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>{search?"Try a different keyword":"Create your first project to get started"}</Typography>
              {!search&&<Button variant="contained" startIcon={<Add/>} onClick={()=>setDialogOpen(true)}>Create First Project</Button>}
            </Box>
          </motion.div>
        ):(
          <Grid container spacing={2.5}>
            <AnimatePresence>
              {filtered.map((p,i)=><Grid item xs={12} sm={6} md={4} key={p._id}><ProjectCard project={p} onDelete={handleDelete} index={i}/></Grid>)}
            </AnimatePresence>
          </Grid>
        )}
      </Box>
      <CreateProjectDialog open={dialogOpen} onClose={()=>setDialogOpen(false)} onCreate={handleCreate} loading={creating}/>
    </Box>
  );
}
