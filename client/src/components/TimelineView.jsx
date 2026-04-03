import { Box, Typography, Paper, Chip, Avatar, Tooltip } from "@mui/material";
import { motion } from "framer-motion";

const PRI_COLOR={high:"#FF6B6B",medium:"#FFB347",low:"#00D4AA"};
const STA_COLOR={done:"#00D4AA",inprogress:"#6C63FF",todo:"#9B9BB4"};

export default function TimelineView({ tasks }) {
  const withDeadline = tasks.filter(t => t.deadline).sort((a,b) => new Date(a.deadline)-new Date(b.deadline));

  if (withDeadline.length === 0) return (
    <Box sx={{ textAlign:"center",py:8,opacity:0.5 }}>
      <Typography variant="body1" color="text.secondary">No tasks with deadlines set.</Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>Add deadlines to tasks to see the timeline.</Typography>
    </Box>
  );

  const minDate = new Date(withDeadline[0].deadline);
  const maxDate = new Date(withDeadline[withDeadline.length-1].deadline);
  const totalDays = Math.max((maxDate - minDate) / 86400000, 1);

  const today = new Date();
  const todayPct = Math.min(100, Math.max(0, ((today - minDate) / (maxDate - minDate)) * 100));

  const getLeft = (d) => Math.min(95, Math.max(0, ((new Date(d) - minDate) / (maxDate - minDate)) * 90));

  const months = [];
  const cur = new Date(minDate); cur.setDate(1);
  while (cur <= maxDate) {
    months.push({ label: cur.toLocaleDateString("en-US",{month:"short",year:"numeric"}), pct: ((cur-minDate)/(maxDate-minDate))*100 });
    cur.setMonth(cur.getMonth()+1);
  }

  return (
    <Box>
      <Paper sx={{ p:3,borderRadius:"16px",background:"#0D0D20",border:"1px solid rgba(108,99,255,0.1)",overflowX:"auto" }}>
        <Typography variant="subtitle2" fontWeight={700} mb={3} color="text.secondary">Task Timeline</Typography>

        {/* Header ruler */}
        <Box sx={{ position:"relative",height:24,mb:1,minWidth:600 }}>
          {months.map((m,i) => (
            <Typography key={i} variant="caption" sx={{ position:"absolute",left:`${Math.max(0,m.pct)}%`,color:"text.secondary",fontSize:"0.65rem",transform:"translateX(-50%)",whiteSpace:"nowrap" }}>{m.label}</Typography>
          ))}
        </Box>

        {/* Track */}
        <Box sx={{ position:"relative",height:3,background:"rgba(255,255,255,0.06)",borderRadius:2,mb:3,minWidth:600 }}>
          <Box sx={{ position:"absolute",left:0,top:0,height:"100%",width:"100%",background:"linear-gradient(90deg,rgba(108,99,255,0.15),rgba(0,212,170,0.15))",borderRadius:2 }}/>
          {/* Today marker */}
          <Tooltip title="Today">
            <Box sx={{ position:"absolute",left:`${todayPct}%`,top:-6,transform:"translateX(-50%)",width:2,height:15,background:"#FFB347",borderRadius:1 }}>
              <Box sx={{ position:"absolute",top:-4,left:"50%",transform:"translateX(-50%)",width:6,height:6,borderRadius:"50%",background:"#FFB347" }}/>
            </Box>
          </Tooltip>
        </Box>

        {/* Tasks */}
        <Box sx={{ display:"flex",flexDirection:"column",gap:1.5,minWidth:600 }}>
          {withDeadline.map((task, i) => {
            const left = getLeft(task.deadline);
            const overdue = new Date(task.deadline) < today && task.status !== "done";
            const dl = new Date(task.deadline).toLocaleDateString("en-US",{month:"short",day:"numeric"});
            return (
              <motion.div key={task._id} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}>
                <Box sx={{ position:"relative",height:36,display:"flex",alignItems:"center" }}>
                  {/* Line to dot */}
                  <Box sx={{ position:"absolute",left:`${left}%`,width:2,height:"100%",background:"rgba(108,99,255,0.15)",transform:"translateX(-50%)" }}/>
                  {/* Dot */}
                  <Tooltip title={`${task.title} — ${dl}`}>
                    <Box sx={{ position:"absolute",left:`${left}%`,transform:"translateX(-50%)",width:14,height:14,borderRadius:"50%",background:overdue?"#FF6B6B":STA_COLOR[task.status],boxShadow:`0 0 10px ${overdue?"rgba(255,107,107,0.5)":STA_COLOR[task.status]+"55"}`,cursor:"pointer",zIndex:2,border:"2px solid #0D0D20",transition:"transform 0.2s","&:hover":{transform:"translateX(-50%) scale(1.4)"} }}/>
                  </Tooltip>
                  {/* Label */}
                  <Box sx={{ position:"absolute",left:`calc(${left}% + 12px)`,background:"rgba(19,19,42,0.95)",border:"1px solid rgba(108,99,255,0.15)",borderRadius:"8px",px:1.2,py:0.4,display:"flex",alignItems:"center",gap:0.8,whiteSpace:"nowrap",maxWidth:220,overflow:"hidden" }}>
                    <Chip label={task.priority} size="small" sx={{ height:14,fontSize:"0.58rem",fontWeight:700,background:`${PRI_COLOR[task.priority]}18`,color:PRI_COLOR[task.priority],flexShrink:0 }}/>
                    <Typography variant="caption" fontWeight={600} sx={{ fontSize:"0.72rem",overflow:"hidden",textOverflow:"ellipsis" }}>{task.title}</Typography>
                    {task.assignedTo && <Avatar sx={{ width:14,height:14,fontSize:"0.5rem",flexShrink:0,background:"linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{task.assignedTo.name?.[0]}</Avatar>}
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
