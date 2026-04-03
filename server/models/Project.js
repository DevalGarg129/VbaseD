const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, default: "#6C63FF" },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
