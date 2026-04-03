const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createTask, getTasksByProject, getAllUserTasks, updateTask, deleteTask, addComment, deleteComment } = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/my", auth, getAllUserTasks);
router.get("/:projectId", auth, getTasksByProject);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.post("/:id/comments", auth, addComment);
router.delete("/:id/comments/:commentId", auth, deleteComment);

module.exports = router;
