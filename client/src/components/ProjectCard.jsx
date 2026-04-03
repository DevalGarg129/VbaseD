import { Card, CardContent, CardActionArea, Typography, Box, Chip, Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, FolderOpen, CalendarToday, Delete, Edit } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const COLORS = [
  "linear-gradient(135deg, #6C63FF, #8B85FF)",
  "linear-gradient(135deg, #FF6584, #FF8FA3)",
  "linear-gradient(135deg, #00D4AA, #00F5C8)",
  "linear-gradient(135deg, #FFB347, #FFD700)",
  "linear-gradient(135deg, #4FC3F7, #81D4FA)",
  "linear-gradient(135deg, #CE93D8, #F48FB1)",
];

function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function ProjectCard({ project, onDelete, index = 0 }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const gradient = hashColor(project._id || project.title);
  const date = new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          background: "#1A1A2E",
          border: "1px solid rgba(108,99,255,0.12)",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          transition: "box-shadow 0.3s, border-color 0.3s",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(108,99,255,0.2)",
            borderColor: "rgba(108,99,255,0.35)",
          },
        }}
      >
        {/* Color bar top */}
        <Box sx={{ height: 5, background: gradient }} />

        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: "12px",
                background: gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                flexShrink: 0,
              }}
            >
              <FolderOpen sx={{ color: "#fff", fontSize: "1.3rem" }} />
            </Box>

            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
              sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>

          <Box
            onClick={() => navigate(`/project/${project._id}`)}
            sx={{ cursor: "pointer" }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.5, lineHeight: 1.3,
                "&:hover": { color: "primary.light" }, transition: "color 0.2s" }}
            >
              {project.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, minHeight: 36, lineHeight: 1.5,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {project.description || "No description provided."}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: "0.75rem", color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">{date}</Typography>
            </Box>
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { background: "#1A1A2E", border: "1px solid rgba(108,99,255,0.2)", minWidth: 150 },
          }}
        >
          <MenuItem
            onClick={() => { setAnchorEl(null); navigate(`/project/${project._id}`); }}
            sx={{ gap: 1.5, fontSize: "0.875rem" }}
          >
            <Edit fontSize="small" sx={{ color: "primary.main" }} /> Open Project
          </MenuItem>
          <MenuItem
            onClick={() => { setAnchorEl(null); onDelete && onDelete(project._id); }}
            sx={{ gap: 1.5, fontSize: "0.875rem", color: "error.main" }}
          >
            <Delete fontSize="small" /> Delete
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
}
