let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // ✅ frontend
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId;

    console.log("🧪 socket.id:", socket.id);
    console.log("🧪 socket.handshake.auth.userId:", userId);

    if (userId) {
      socket.join(userId);
      console.log("✅ Joined room for user:", userId);
    }
  });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
