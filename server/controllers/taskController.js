const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, project, assignedTo, tags } = req.body;
    if (!(await Project.findById(project))) return res.status(404).json({ msg: "Project not found" });
    const task = await Task.create({ title, description, priority, deadline, project, assignedTo, tags, createdBy: req.user.id, status: "todo" });
    if (assignedTo && assignedTo !== req.user.id) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: { notifications: { message: `You were assigned task: "${title}"`, type: "task", link: `/project/${project}` } }
      });
    }
    const populated = await Task.findById(task._id).populate("assignedTo", "name email avatar").populate("createdBy", "name email").populate("comments.user", "name avatar");
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("comments.user", "name avatar")
      .sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getAllUserTasks = async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ createdBy: req.user.id }, { members: req.user.id }] });
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("assignedTo", "name email avatar")
      .populate("project", "title color")
      .sort({ deadline: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email")
      .populate("comments.user", "name avatar");
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted" });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: req.user.id, text } } },
      { new: true }
    ).populate("comments.user", "name avatar").populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ msg: "Task not found" });
    // notify assignee
    if (task.assignedTo && task.assignedTo._id.toString() !== req.user.id) {
      await User.findByIdAndUpdate(task.assignedTo._id, {
        $push: { notifications: { message: `New comment on task: "${task.title}"`, type: "comment", link: `/project/${task.project}` } }
      });
    }
    res.json(task);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.deleteComment = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    ).populate("comments.user", "name avatar");
    res.json(task);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
