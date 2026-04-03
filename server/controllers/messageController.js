const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ msg: "Message cannot be empty" });
    const msg = await Message.create({ project: req.params.projectId, sender: req.user.id, text: text.trim() });
    const populated = await Message.findById(msg._id).populate("sender", "name avatar");
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findOneAndDelete({ _id: req.params.id, sender: req.user.id });
    res.json({ msg: "Deleted" });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
