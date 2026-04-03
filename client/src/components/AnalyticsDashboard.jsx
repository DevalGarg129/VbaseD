import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, CircularProgress, Chip } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import API from "../services/api";

const STATUS_COLORS={"todo":"#9B9BB4","inprogress":"#6C63FF","done":"#00D4AA"};
const PRIORITY_COLORS={"low":"#00D4AA","medium":"#FFB347","high":"#FF6B6B"};

function StatBox({label,value,color,sub}){
  return(
    <Paper sx={{ p:2.5,borderRadius:"14px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)",textAlign:"center" }}>
      <Typography variant="h4" fontWeight={800} sx={{ color,lineHeight:1,mb:0.5 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>{label}</Typography>
      {sub&&<Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </Paper>
  );
}

const CustomTooltip=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <Paper sx={{ p:1.5,background:"#1A1A35",border:"1px solid rgba(108,99,255,0.25)",borderRadius:"10px" }}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      {payload.map((p,i)=><Typography key={i} variant="caption" sx={{ display:"block",color:p.color }}>{p.name}: {p.value}</Typography>)}
    </Paper>
  );
};

export default function AnalyticsDashboard({projectId}){
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    API.get(`/projects/${projectId}/analytics`).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[projectId]);

  if(loading) return <Box sx={{ display:"flex",justifyContent:"center",py:8 }}><CircularProgress sx={{ color:"primary.main" }}/></Box>;
  if(!data) return null;

  const statusData=[
    {name:"To Do",value:data.byStatus.todo,color:"#9B9BB4"},
    {name:"In Progress",value:data.byStatus.inprogress,color:"#6C63FF"},
    {name:"Done",value:data.byStatus.done,color:"#00D4AA"},
  ];
  const priorityData=[
    {name:"Low",value:data.byPriority.low,fill:"#00D4AA"},
    {name:"Medium",value:data.byPriority.medium,fill:"#FFB347"},
    {name:"High",value:data.byPriority.high,fill:"#FF6B6B"},
  ];
  const memberData=Object.entries(data.byMember).map(([name,count])=>({name:name.split(" ")[0],count}));

  return(
    <Box>
      <Grid container spacing={2} mb={3}>
        {[
          {label:"Total Tasks",value:data.total,color:"#6C63FF"},
          {label:"Completed",value:data.byStatus.done,color:"#00D4AA",sub:`${data.completion}% done`},
          {label:"In Progress",value:data.byStatus.inprogress,color:"#FFB347"},
          {label:"Overdue",value:data.overdue,color:"#FF6B6B"},
        ].map((s,i)=>(
          <Grid item xs={6} sm={3} key={i}>
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <StatBox {...s}/>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Completion Ring */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.15}}>
            <Paper sx={{ p:3,borderRadius:"16px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)",textAlign:"center",height:"100%" }}>
              <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">Task Status</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {statusData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Legend formatter={(val)=><span style={{fontSize:"0.75rem",color:"#8888AA"}}>{val}</span>}/>
                  <Tooltip content={<CustomTooltip/>}/>
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="h3" fontWeight={900} sx={{ color:"#6C63FF",mt:1 }}>{data.completion}%</Typography>
              <Typography variant="caption" color="text.secondary">Overall Completion</Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Priority Bar */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}}>
            <Paper sx={{ p:3,borderRadius:"16px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)",height:"100%" }}>
              <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">Priority Breakdown</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={priorityData} barSize={36}>
                  <XAxis dataKey="name" tick={{fill:"#8888AA",fontSize:12}} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="value" name="Tasks" radius={[6,6,0,0]}>
                    {priorityData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        {/* Members */}
        <Grid item xs={12} md={4}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.25}}>
            <Paper sx={{ p:3,borderRadius:"16px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)",height:"100%" }}>
              <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.secondary">Tasks by Member</Typography>
              {memberData.length===0 ? (
                <Box sx={{ textAlign:"center",py:4,opacity:0.4 }}><Typography variant="body2" color="text.secondary">No assignments yet</Typography></Box>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={memberData} layout="vertical" barSize={18}>
                    <XAxis type="number" hide/>
                    <YAxis type="category" dataKey="name" tick={{fill:"#8888AA",fontSize:11}} axisLine={false} tickLine={false} width={60}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="count" name="Tasks" fill="#6C63FF" radius={[0,6,6,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
