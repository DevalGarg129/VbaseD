import { Box, Typography, Paper, Badge } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

const COLUMN_CONFIG = {
  todo: {
    label: "To Do",
    color: "#9B9BB4",
    bg: "rgba(155,155,180,0.07)",
    dot: "#9B9BB4",
    border: "rgba(155,155,180,0.2)",
  },
  inprogress: {
    label: "In Progress",
    color: "#6C63FF",
    bg: "rgba(108,99,255,0.06)",
    dot: "#6C63FF",
    border: "rgba(108,99,255,0.25)",
  },
  done: {
    label: "Done",
    color: "#00D4AA",
    bg: "rgba(0,212,170,0.06)",
    dot: "#00D4AA",
    border: "rgba(0,212,170,0.2)",
  },
};

export default function TaskColumn({ status, tasks, onStatusChange, onDelete, onEdit }) {
  const config = COLUMN_CONFIG[status] || COLUMN_CONFIG.todo;

  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: { xs: "85vw", sm: 280, md: 0 },
        maxWidth: { md: 380 },
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "16px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 220px)",
        overflow: "hidden",
      }}
    >
      {/* Column Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, pb: 1.5, borderBottom: `1px solid ${config.border}` }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: config.dot, flexShrink: 0,
          boxShadow: `0 0 8px ${config.dot}` }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: config.color, flex: 1, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
          {config.label}
        </Typography>
        <Box sx={{ background: `${config.dot}22`, px: 1.2, py: 0.3, borderRadius: "20px" }}>
          <Typography variant="caption" sx={{ color: config.color, fontWeight: 700 }}>
            {tasks.length}
          </Typography>
        </Box>
      </Box>

      {/* Tasks */}
      <Box sx={{ overflowY: "auto", flex: 1, pr: 0.5,
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": { background: config.border, borderRadius: "2px" } }}>
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{ textAlign: "center", py: 4, opacity: 0.4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                  No tasks here
                </Typography>
              </Box>
            </motion.div>
          ) : (
            tasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                index={i}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </AnimatePresence>
      </Box>
    </Paper>
  );
}
