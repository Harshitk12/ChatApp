const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const connectedUsers = new Map();

function setupSocket(io) {
  io.use((socket, next) => {
    let token = socket.handshake?.auth?.token || null;

    if (!token && socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.token || null;
    }

    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      return next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket);

    socket.on("sendMessage", ({ to, content }) => {
      const receiverSocket = connectedUsers.get(to);
      const messageData = {
        from: socket.userId,
        to, 
        content,
        timestamp: new Date().toISOString()
      };

      if (receiverSocket) {
        receiverSocket.emit("receiveMessage", messageData);
      }

      // Also send back to sender for their UI
      socket.emit("receiveMessage", messageData);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });
  });
}

module.exports = setupSocket;