const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { register, login, getMe, getNotifications, markNotificationsRead, searchUsers } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.get("/notifications", auth, getNotifications);
router.put("/notifications/read", auth, markNotificationsRead);
router.get("/search", auth, searchUsers);

module.exports = router;
