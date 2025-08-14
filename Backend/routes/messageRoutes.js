const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.post("/", verifyToken, sendMessage); 
router.get("/:receiverId", verifyToken, getMessages); 

module.exports = router;
