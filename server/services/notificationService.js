// 📁 services/notificationService.js
const { getIO } = require("../sockets/socket");

const sendNotification = (userId, message) => {
  console.log("🔥 sendNotification CALLED");
  console.log("👉 userId:", userId);
  console.log("👉 message:", message);

  try {
    const io = getIO();

    io.to(userId).emit("notification", {
      id: Date.now(),
      text: message,
      read: false,
      createdAt: new Date(),
    });

    console.log("✅ Notification emitted to room:", userId);

  } catch (err) {
    console.error("⚠️ Notification FAILED:", err.message);
  }
};

module.exports = { sendNotification };
