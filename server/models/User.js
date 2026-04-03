const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    notifications: [
      {
        message: String,
        type: { type: String, enum: ["task", "comment", "project", "mention"], default: "task" },
        read: { type: Boolean, default: false },
        link: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
