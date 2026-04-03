const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const { title, description, color, dueDate } = req.body;
    const project = await Project.create({ title, description, color, dueDate, createdBy: req.user.id, members: [req.user.id] });
    const populated = await Project.findById(project._id).populate("members", "name email avatar").populate("createdBy", "name email");
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ $or: [{ createdBy: req.user.id }, { members: req.user.id }] })
      .populate("members", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    // attach task counts
    const withCounts = await Promise.all(projects.map(async (p) => {
      const total = await Task.countDocuments({ project: p._id });
      const done = await Task.countDocuments({ project: p._id, status: "done" });
      return { ...p.toObject(), taskCount: total, doneCount: done };
    }));
    res.json(withCounts);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email avatar isOnline")
      .populate("createdBy", "name email");
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("members", "name email avatar")
      .populate("createdBy", "name email");
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });
    res.json({ msg: "Project deleted" });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("members", "name email avatar");
    // notify new member
    await User.findByIdAndUpdate(userId, {
      $push: { notifications: { message: `You were added to project "${project.title}"`, type: "project", link: `/project/${project._id}` } }
    });
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.params.userId } },
      { new: true }
    ).populate("members", "name email avatar");
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ project: id }).populate("assignedTo", "name");
    const total = tasks.length;
    const byStatus = { todo: 0, inprogress: 0, done: 0 };
    const byPriority = { low: 0, medium: 0, high: 0 };
    const byMember = {};
    tasks.forEach((t) => {
      byStatus[t.status] = (byStatus[t.status] || 0) + 1;
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
      if (t.assignedTo) {
        const name = t.assignedTo.name;
        byMember[name] = (byMember[name] || 0) + 1;
      }
    });
    const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "done").length;
    res.json({ total, byStatus, byPriority, byMember, overdue, completion: total ? Math.round((byStatus.done / total) * 100) : 0 });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
