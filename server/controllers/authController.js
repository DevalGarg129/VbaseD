const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields are required" });
    if (await User.findOne({ email })) return res.status(400).json({ msg: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields are required" });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ msg: "Invalid credentials" });
    await User.findByIdAndUpdate(user._id, { isOnline: true });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("notifications");
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $set: { "notifications.$[].read": true } });
    res.json({ msg: "Marked as read" });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }],
      _id: { $ne: req.user.id },
    }).select("name email avatar").limit(10);
    res.json(users);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
