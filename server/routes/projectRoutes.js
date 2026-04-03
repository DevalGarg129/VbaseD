const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createProject, getProjects, getProjectById, updateProject, deleteProject, addMember, removeMember, getAnalytics } = require("../controllers/projectController");

router.post("/", auth, createProject);
router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
router.post("/:id/members", auth, addMember);
router.delete("/:id/members/:userId", auth, removeMember);
router.get("/:id/analytics", auth, getAnalytics);

module.exports = router;
