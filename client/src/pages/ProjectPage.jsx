import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Alert, Skeleton, Breadcrumbs, Link, Paper,
  Tabs, Tab, Chip, Avatar, AvatarGroup, LinearProgress, Tooltip
} from "@mui/material";
import {
  ArrowBack, ViewKanban, Timeline, BarChart, People, Chat,
  CheckCircle, Autorenew, RadioButtonUnchecked
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import TimelineView from "../components/TimelineView";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import TeamPanel from "../components/TeamPanel";
import TeamChat from "../components/TeamChat";
import API from "../services/api";

const TABS = [
  { label: "Kanban", icon: <ViewKanban sx={{ fontSize: "1rem" }} /> },
  { label: "Timeline", icon: <Timeline sx={{ fontSize: "1rem" }} /> },
  { label: "Analytics", icon: <BarChart sx={{ fontSize: "1rem" }} /> },
  { label: "Team", icon: <People sx={{ fontSize: "1rem" }} /> },
  { label: "Chat", icon: <Chat sx={{ fontSize: "1rem" }} /> },
];

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  const init = useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, tRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/${id}`)
      ]);
      setProject(pRes.data);
      setTasks(tRes.data);
    } catch { setError("Failed to load project"); }
    finally { setLoading(false); }
  }, [id]);

  const fetchTasks = useCallback(async () => {
    try { const res = await API.get(`/tasks/${id}`); setTasks(res.data); } catch {}
  }, [id]);

  const fetchProject = useCallback(async () => {
    try { const res = await API.get(`/projects/${id}`); setProject(res.data); } catch {}
  }, [id]);

  useEffect(() => { init(); }, [init]);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const inprog = tasks.filter(t => t.status === "inprogress").length;
  const todo = tasks.filter(t => t.status === "todo").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const statItems = [
    { count: todo, label: "todo", color: "#9B9BB4", Icon: RadioButtonUnchecked },
    { count: inprog, label: "in progress", color: "#6C63FF", Icon: Autorenew },
    { count: done, label: "done", color: "#00D4AA", Icon: CheckCircle },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: "#0A0A14" }}>
      <Navbar />
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>

        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { color: "text.secondary" } }}>
          <Link component="button" onClick={() => navigate("/dashboard")}
            sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", textDecoration: "none", fontSize: "0.85rem", "&:hover": { color: "primary.main" } }}>
            <ArrowBack sx={{ fontSize: "0.85rem" }} /> Dashboard
          </Link>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {project?.title || "Project"}
          </Typography>
        </Breadcrumbs>

        {/* Project Header */}
        {loading ? (
          <Skeleton variant="rounded" height={110} sx={{ bgcolor: "rgba(108,99,255,0.06)", borderRadius: "16px", mb: 3 }} />
        ) : (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Paper sx={{ p: 2.5, mb: 3, borderRadius: "16px", background: "#13132A", border: "1px solid rgba(108,99,255,0.12)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: total > 0 ? 2 : 0 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: "12px",
                    background: project?.color || "#6C63FF", flexShrink: 0,
                    boxShadow: `0 4px 14px ${project?.color || "#6C63FF"}55`
                  }} />
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.3, flexWrap: "wrap" }}>
                      <Typography variant="h5" fontWeight={800}>{project?.title}</Typography>
                      <Chip label={project?.status} size="small" sx={{
                        height: 20, fontSize: "0.65rem", fontWeight: 700,
                        background: project?.status === "active" ? "rgba(0,212,170,0.12)" : "rgba(108,99,255,0.12)",
                        color: project?.status === "active" ? "#00D4AA" : "#8B85FF"
                      }} />
                    </Box>
                    {project?.description && (
                      <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                    )}
                  </Box>
                </Box>

                {project?.members?.length > 0 && (
                  <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: "0.65rem", border: "2px solid #13132A" } }}>
                    {project.members.map(m => (
                      <Tooltip key={m._id} title={m.name}>
                        <Avatar sx={{ background: "linear-gradient(135deg,#6C63FF,#8B85FF)" }}>{m.name?.[0]}</Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                )}
              </Box>

              {total > 0 && (
                <Box>
                  <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap", mb: 1.2, alignItems: "center" }}>
                    {statItems.map(({ count, label, color, Icon }) => (
                      <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Icon sx={{ fontSize: "0.85rem", color }} />
                        <Typography variant="body2" sx={{ color, fontWeight: 600, fontSize: "0.8rem" }}>
                          {count} {label}
                        </Typography>
                      </Box>
                    ))}
                    <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" sx={{ color: "#00D4AA", fontWeight: 700 }}>{progress}%</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      style={{ height: "100%", background: "linear-gradient(90deg,#6C63FF,#00D4AA)", borderRadius: 3 }}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}

        {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }} onClose={() => setError("")}>{error}</Alert>}

        {/* Tabs */}
        <Box sx={{ mb: 3, borderBottom: "1px solid rgba(108,99,255,0.12)" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { color: "text.secondary", gap: 0.8, minHeight: 44, fontSize: "0.85rem" },
              "& .Mui-selected": { color: "primary.light" },
              "& .MuiTabs-indicator": { background: "linear-gradient(90deg,#6C63FF,#8B85FF)", height: 2, borderRadius: 1 }
            }}>
            {TABS.map((t, i) => (
              <Tab key={i} icon={t.icon} iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {loading ? (
            <Skeleton variant="rounded" height={400} sx={{ bgcolor: "rgba(108,99,255,0.06)", borderRadius: "16px" }} />
          ) : (
            <>
              {tab === 0 && <KanbanBoard tasks={tasks} projectId={id} onRefresh={fetchTasks} members={project?.members || []} />}
              {tab === 1 && <TimelineView tasks={tasks} />}
              {tab === 2 && <AnalyticsDashboard projectId={id} />}
              {tab === 3 && <TeamPanel project={project} onRefresh={() => { fetchProject(); fetchTasks(); }} />}
              {tab === 4 && <TeamChat projectId={id} />}
            </>
          )}
        </motion.div>
      </Box>
    </Box>
  );
}
