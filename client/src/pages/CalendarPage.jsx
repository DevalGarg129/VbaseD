import { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip, IconButton, Avatar, Tooltip, Grid } from "@mui/material";
import { ChevronLeft, ChevronRight, FlagOutlined } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import API from "../services/api";

const PRI_COLOR={high:"#FF6B6B",medium:"#FFB347",low:"#00D4AA"};
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarPage(){
  const [tasks,setTasks]=useState([]);
  const [date,setDate]=useState(new Date());
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    API.get("/tasks/my").then(r=>setTasks(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const year=date.getFullYear(), month=date.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date();

  const tasksOnDay=(d)=>tasks.filter(t=>{
    if(!t.deadline) return false;
    const dl=new Date(t.deadline);
    return dl.getFullYear()===year&&dl.getMonth()===month&&dl.getDate()===d;
  });

  const selectedTasks=selected?tasksOnDay(selected):[];

  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  while(cells.length%7!==0) cells.push(null);

  const isToday=(d)=>d&&today.getDate()===d&&today.getMonth()===month&&today.getFullYear()===year;
  const isPast=(d)=>d&&new Date(year,month,d)<new Date(today.getFullYear(),today.getMonth(),today.getDate());

  return(
    <Box sx={{ minHeight:"100vh",background:"#0A0A14" }}>
      <Navbar/>
      <Box sx={{ maxWidth:1100,mx:"auto",px:{xs:2,md:4},py:4 }}>
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}>
          <Typography variant="h4" fontWeight={800} mb={0.5}>Calendar</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>All your task deadlines in one view.</Typography>
        </motion.div>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius:"20px",background:"#13132A",border:"1px solid rgba(108,99,255,0.12)",overflow:"hidden" }}>
              {/* Header */}
              <Box sx={{ display:"flex",alignItems:"center",justifyContent:"space-between",px:3,py:2,borderBottom:"1px solid rgba(108,99,255,0.1)" }}>
                <Typography variant="h6" fontWeight={700}>{MONTHS[month]} {year}</Typography>
                <Box sx={{ display:"flex",gap:0.5 }}>
                  <IconButton onClick={()=>setDate(new Date(year,month-1,1))} size="small" sx={{ color:"text.secondary","&:hover":{color:"primary.main"} }}><ChevronLeft/></IconButton>
                  <IconButton onClick={()=>setDate(new Date())} size="small" sx={{ color:"primary.light",fontSize:"0.75rem",borderRadius:"8px",px:1.2,border:"1px solid rgba(108,99,255,0.25)" }}>Today</IconButton>
                  <IconButton onClick={()=>setDate(new Date(year,month+1,1))} size="small" sx={{ color:"text.secondary","&:hover":{color:"primary.main"} }}><ChevronRight/></IconButton>
                </Box>
              </Box>

              {/* Day headers */}
              <Grid container sx={{ borderBottom:"1px solid rgba(108,99,255,0.08)" }}>
                {DAYS.map(d=>(
                  <Grid item key={d} xs={12/7} sx={{ textAlign:"center",py:1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize:"0.7rem",textTransform:"uppercase" }}>{d}</Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Cells */}
              <Grid container>
                {cells.map((d,i)=>{
                  const dayTasks=d?tasksOnDay(d):[];
                  const active=selected===d&&d;
                  const past=isPast(d);
                  return(
                    <Grid item key={i} xs={12/7}>
                      <Box onClick={()=>d&&setSelected(selected===d?null:d)}
                        sx={{ minHeight:{xs:52,md:72},p:0.8,borderRight:"1px solid rgba(108,99,255,0.06)",borderBottom:"1px solid rgba(108,99,255,0.06)",cursor:d?"pointer":"default",position:"relative",background:active?"rgba(108,99,255,0.1)":isToday(d)?"rgba(108,99,255,0.06)":"transparent","&:hover":{background:d?"rgba(108,99,255,0.07)":"transparent"},transition:"background 0.15s" }}>
                        {d&&(
                          <>
                            <Box sx={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:"50%",background:isToday(d)?"#6C63FF":"transparent",mb:0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight:isToday(d)?700:400,color:isToday(d)?"#fff":past?"text.secondary":"text.primary",fontSize:"0.8rem",lineHeight:1 }}>{d}</Typography>
                            </Box>
                            <Box sx={{ display:"flex",flexDirection:"column",gap:0.3 }}>
                              {dayTasks.slice(0,2).map(t=>(
                                <Tooltip key={t._id} title={t.title}>
                                  <Box sx={{ borderRadius:"4px",px:0.6,py:0.15,background:`${PRI_COLOR[t.priority]||"#6C63FF"}22`,overflow:"hidden" }}>
                                    <Typography sx={{ fontSize:"0.6rem",fontWeight:600,color:PRI_COLOR[t.priority]||"#6C63FF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.title}</Typography>
                                  </Box>
                                </Tooltip>
                              ))}
                              {dayTasks.length>2&&<Typography variant="caption" sx={{ fontSize:"0.6rem",color:"text.secondary",pl:0.5 }}>+{dayTasks.length-2} more</Typography>}
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius:"16px",background:"#13132A",border:"1px solid rgba(108,99,255,0.12)",p:2.5,position:"sticky",top:20 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                {selected ? `${MONTHS[month]} ${selected}` : "Select a day"}
              </Typography>
              <AnimatePresence mode="wait">
                {selected ? (
                  selectedTasks.length===0 ? (
                    <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign:"center",py:3 }}>No tasks due this day.</Typography>
                    </motion.div>
                  ) : selectedTasks.map((t,i)=>(
                    <motion.div key={t._id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{delay:i*0.04}}>
                      <Paper sx={{ p:1.8,mb:1.5,borderRadius:"12px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)" }}>
                        <Box sx={{ display:"flex",alignItems:"flex-start",gap:1,mb:0.8 }}>
                          <FlagOutlined sx={{ fontSize:"0.9rem",color:PRI_COLOR[t.priority],mt:0.2,flexShrink:0 }}/>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize:"0.87rem",lineHeight:1.3 }}>{t.title}</Typography>
                        </Box>
                        <Box sx={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:0.5 }}>
                          <Chip label={t.project?.title||"Project"} size="small" sx={{ height:18,fontSize:"0.63rem",background:"rgba(108,99,255,0.12)",color:"primary.light" }}/>
                          <Chip label={t.status} size="small" sx={{ height:18,fontSize:"0.63rem",background:t.status==="done"?"rgba(0,212,170,0.12)":t.status==="inprogress"?"rgba(108,99,255,0.12)":"rgba(155,155,180,0.1)",color:t.status==="done"?"#00D4AA":t.status==="inprogress"?"#6C63FF":"#9B9BB4" }}/>
                        </Box>
                        {t.assignedTo&&<Box sx={{ display:"flex",alignItems:"center",gap:0.7,mt:0.8 }}>
                          <Avatar sx={{ width:18,height:18,fontSize:"0.55rem",background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{t.assignedTo?.name?.[0]}</Avatar>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize:"0.68rem" }}>{t.assignedTo?.name}</Typography>
                        </Box>}
                      </Paper>
                    </motion.div>
                  ))
                ) : (
                  <motion.div key="hint" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign:"center",py:3,opacity:0.6 }}>Click a date to see tasks due that day.</Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
