const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.post("/", verifyToken, sendMessage); // Send a message
router.get("/:receiverId", verifyToken, getMessages); // Get messages with a user

module.exports = router;
