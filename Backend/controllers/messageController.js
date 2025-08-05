const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.userId;

  try {
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

const getMessages = async (req, res) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

module.exports = { sendMessage, getMessages };
