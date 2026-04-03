const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMessages, sendMessage, deleteMessage } = require("../controllers/messageController");

router.get("/:projectId", auth, getMessages);
router.post("/:projectId", auth, sendMessage);
router.delete("/:id", auth, deleteMessage);

module.exports = router;
